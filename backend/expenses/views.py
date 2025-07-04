from rest_framework import status, generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.utils.timezone import now
from django.db.models import Sum
from .serializers import RegisterSerializer, TransactionSerializer, CategorySerializer
from .models import Transaction, Category
from django.db.models.functions import TruncMonth



class RegistrationView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Sikeres regisztracio!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserInfo(request):
    return Response({
        'username': request.user.username
    })

class TransactionView(generics.CreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class BalanceView(APIView):
    def get(self, request):
        user = request.user
        current_month = now().month
        current_year = now().year

        income_total = Transaction.objects.filter(user=user, type='income').aggregate(Sum('amount'))['amount__sum'] or 0
        expense_total = Transaction.objects.filter(user=user, type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
        balance = income_total - expense_total

        monthly_income = Transaction.objects.filter(user=user, type='income', date__month=current_month, date__year=current_year).aggregate(Sum('amount'))['amount__sum'] or 0

        monthly_expense = Transaction.objects.filter(user=user, type='expense', date__month=current_month, date__year=current_year).aggregate(Sum('amount'))['amount__sum'] or 0

        return Response({
            "balance": balance,
            "monthly_income": monthly_income,
            "monthly_expense": monthly_expense
        })


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-date')[:5]


class MonthlyExpenseChartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = (Transaction.objects.filter(user=request.user, type='expense').annotate(month=TruncMonth('date')).values('month').annotate(total=Sum('amount')).order_by('month'))

        formatted = [
            {
                "honap": expense["month"].strftime('%b'),
                "kiadas": expense["total"]
            }
            for expense in expenses
        ]
        return Response(formatted)
    
class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
def spending_by_category(request):
    user = request.user 
    spending = (
        Transaction.objects
        .filter(user=user, type='expense')
        .values('category__name')
        .annotate(total=Sum('amount'))
        .order_by('-total')
    )
    return Response(spending)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def weekly_expense(request):
    user = request.user
    today = timezone.now().date()
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)          

    expenses = Transaction.objects.filter(
        user = user,
        type='expense',
        date__date__gte=start_of_week,
        date__date__lte=end_of_week
    )
    total = expenses.aggregate(total=models.Sum('amount'))['total'] or 0

    return Response({'weekly_expense': total})