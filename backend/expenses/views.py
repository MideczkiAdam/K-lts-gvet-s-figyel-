from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from django.db.models import Sum
from .serializers import RegisterSerializer, TransactionSerializer
from .models import Transaction



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
