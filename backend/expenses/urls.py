from django.urls import path
from .views import RegistrationView, getUserInfo

urlpatterns = [
    path('register/', RegistrationView.as_view(), name='register'),
    path('user/', getUserInfo),
]