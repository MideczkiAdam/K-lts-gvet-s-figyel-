from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegistrationView, getUserInfo, TransactionView, BalanceView, TransactionListView, MonthlyExpenseChartView, CategoryViewSet, spending_by_category, weekly_expense

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('register/', RegistrationView.as_view(), name='register'),
    path('user/', getUserInfo),
    path('transactions/', TransactionView.as_view(), name='add-transaction'),
    path('transactions/list/', TransactionListView.as_view(), name='transaction-list'),
    path('balance/', BalanceView.as_view(), name='balance'),
    path('expenses/monthly/', MonthlyExpenseChartView.as_view(), name='monthly-expense-chart'),
    path('', include(router.urls)),
    path('stats/spending-by-category/', spending_by_category),
    path('expenses/weekly/', weekly_expense, name='weekly-expense'),
]