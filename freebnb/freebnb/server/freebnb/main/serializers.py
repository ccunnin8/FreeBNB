from rest_framework import serializers 
from django.contrib.auth.models import User 

class CreateUserSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    username = serializers.CharField(max_length=100)
    birthday = serializers.DateField() 
    
    def save(self):
        new_user = User()
        new_user.password = self.password 
        new_user.email = self.email 
        new_user.first_name = self.first_name 
        new_user.last_name = self.last_name 
        new_user.save()

