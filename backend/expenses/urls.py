from django.urls import path
from .views import RegistrationView, getUserInfo, TransactionView, BalanceView

urlpatterns = [
    path('register/', RegistrationView.as_view(), name='register'),
    path('user/', getUserInfo),
    path('transactions/', TransactionView.as_view(), name='add-transaction'),
    path('balance/', BalanceView.as_view(), name='balance'),
]