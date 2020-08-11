from django.db import models
from django.contrib.auth.models import User 
# Create your models here.

class Birthday(models.Model):
    birthday = models.DateField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)