from .serializers import CreateUserSerializer
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from django.contrib.auth.models import User 
from rest_framework import authentication, permissions 

# Create your views here.

@api_view(["POST"])
def create_user(request):
    if request.method == "POST":
        new_user = CreateUserSerializer(request.data)
        if new_user.is_valid:
            new_user.save() 
            Response({ "status": "user_created" })
        else:
            Reponse({ "error": "there was an error creating the user"})