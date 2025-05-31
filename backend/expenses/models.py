from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('income', 'Bevétel'),
        ('expense', 'Kiadás'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(choices=TRANSACTION_TYPES, max_length=10)
    date = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL)


    def __str__(self):
        return f"{self.user.username} - {self.type} - {self.amount} Ft"
