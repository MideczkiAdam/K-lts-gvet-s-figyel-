from django.urls import path
from .views import RegistrationView, getUserInfo, TransactionView, BalanceView, TransactionListView, MonthlyExpenseChartView

urlpatterns = [
    path('register/', RegistrationView.as_view(), name='register'),
    path('user/', getUserInfo),
    path('transactions/', TransactionView.as_view(), name='add-transaction'),
    path('transactions/list/', TransactionListView.as_view(), name='transaction-list'),
    path('balance/', BalanceView.as_view(), name='balance'),
    path('expenses/monthly/', MonthlyExpenseChartView.as_view(), name='monthly-expense-chart'),
]