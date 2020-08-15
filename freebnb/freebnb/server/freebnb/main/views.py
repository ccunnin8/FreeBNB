from .serializers import CreateUserSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response 
from .models import  User 
from rest_framework import authentication, permissions 
from django.middleware.csrf import get_token
from datetime import datetime 
from rest_framework_jwt.settings import api_settings

@api_view(["get"])
def get_csrf(request):
    return Response({ "csrf": get_token(request) })

class UserView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({ "msg": "this is a success!"})

    def post(self, request, format=None):
        # convert mm/dd/yyyy birth being sent to python friendly format 
        birthdate = datetime.strptime(request.data["birthdate"], "%m/%d/%Y")
        request.data["birthdate"] = str(birthdate.date())
        # create serialized user 
        user = CreateUserSerializer(data=request.data)
        # check if valid, create token, send user info and token back to server 
        if user.is_valid():
            new_user = user.save()
            payload = api_settings.JWT_PAYLOAD_HANDLER(new_user)
            token = api_settings.JWT_ENCODE_HANDLER(payload)
            return Response({ 
                "status": "success", 
                "username": new_user.username,
                "email": new_user.email,
                "firstname": new_user.first_name,
                "lastname": new_user.last_name,
                "token": token 
            })
        else:
            return Response({ "status": "error", "errors": user.errors})


class UserListView(APIView):
    query_set = User.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def get(self, request):
        users = [user for user in User.objects.all()]
        return Response({ "users": users }) 


@api_view(["POST"])
def renew_session(request):
    permissions = (permissions.IsAuthenticated, permissions,)
    username = request.data.username 
    user = User.objects.get(username=username)

    payload = api_settings.JWT_PAYLOAD_HANDLER(user)
    token = api_settings.JWT_ENCODE_HANDLER(payload)

    return Response({
        "status": "success",
        "user": UserSerializer(instance=user).data,
        "token": token 
    })

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def login(request):
    email = request.data["email"] 
    password = request.data["password"]
    try:
        user = User.objects.get(email=email)
    except:
        return Response({ "error": "email not found "})
    if not user.check_password(password):
        return Response({ "error": "password incorrect "})

    payload = api_settings.JWT_PAYLOAD_HANDLER(user)
    token = api_settings.JWT_ENCODE_HANDLER(payload)

    return Response({
        "token": token,
        "status": "success",
        "user": UserSerializer(instance=user).data
    })