from .serializers import CreateUserSerializer, UserSerializer, ListingSerializer, ReservationSerializer
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response 
from .models import  User, Listing, Address, ListingPhoto, Reservation
from rest_framework import authentication, permissions
from rest_framework.parsers import MultiPartParser, JSONParser, FormParser
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

class ListingView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ListingSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request, format=None):
        user = request.user 
        queryset = Listing.objects.filter(owner=user)
        return Response({ "listings": ListingSerializer(queryset, many=True).data })

    def post(self, request, format=None):
        user = request.user 
        address = Address(
            street = request.data["street"],
            city = request.data["city"],
            state = request.data["state"],
            zip_code = request.data["zip_code"]
        )
        address.save()
        listing = Listing(address=address, 
            owner=user, 
            headline=request.data["headline"], 
            description=request.data["description"]
        )
        listing.save()

        listingphoto = ListingPhoto(listing=listing, image=request.FILES["photos"])
    
        listingphoto.save() 

        return Response({ "listing": ListingSerializer(instance=listing).data}) 

    def delete(self, request, format=None):
        try:
            Listing.objects.filter(id=request.data["id"]).delete()
            return Response({ "status": "success" })
        except:
            return Response({ "status": "error" })

class UserListView(APIView):
    query_set = User.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def get(self, request):
        users = [user for user in User.objects.all()]
        return Response({ "users": users }) 

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

class ReservationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReservationSerializer 

    def get(self, request, format=None):
        user = request.user 
        queryset = Reservation.objects.filter(user=user)
        return Response({ "reservations": ReservationSerializer(queryset, many=True).data }) 

    def post(self, request, format=None):
        pass 