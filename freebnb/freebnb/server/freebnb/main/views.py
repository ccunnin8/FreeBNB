from .serializers import *
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView, ListAPIView, UpdateAPIView, CreateAPIView
from rest_framework import status 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response 
from .models import  User, Listing, Address, ListingPhoto, Reservation
from rest_framework import authentication, permissions
from rest_framework.parsers import MultiPartParser, JSONParser, FormParser
from django.middleware.csrf import get_token
from datetime import datetime 
from rest_framework_jwt.settings import api_settings
from dateutil import parser as dateutil_parser 

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

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def get_user_reservations(request):
    try:
        user = request.user 
        approved_reservations = Reservation.objects.filter(listing__owner=user, accepted=True)
        pending_reservations = Reservation.objects.filter(listing__owner=user, accepted=False)
        return Response({ "status": "success", "approved": ReservationSerializer(approved_reservations, many=True).data,
            "pending": ReservationSerializer(pending_reservations, many=True).data
        })
    except Exception:
        return Response({ "status": "error" })

@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def approve_reservation(request):
    user = request.user 
    try:
        reservation = Reservation.objects.get(pk=request.data["id"])
<<<<<<< HEAD
        if request.user == reservation.listing.owner:
            reservation.accepted = True 
            reservation.save()
            return Response({"status": "success"})
        else:
            return Response({"status": "error", "msg": "not authorized"})
    except Exception:
=======
        reservation.accepted = True 
        reservation.save()
        convo = Conversation.objects.get_prev_convo(user, reservation.listing.owner)
        Message.objects.create(
            sender=user,
            message=f"{user.first_name} has accepted your request to stay",
            time=datetime.now().strftime("%m/%d/%Y %H:%M"),
            conversation=convo
        )
        return Response({"status": "success"})
    except:
>>>>>>> channels
        return Response({ "status": "error"})



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
        address = AddressSerializer(data=request.data)
        if not address.is_valid():
            return Response({ "status": "error", "errors": address.errors })
        serialized_listing = CreateListingSerializer(data=request.data) 
        if not serialized_listing.is_valid():
            return Response({ "status": "error", "errors": serialized_listing.errors })
        listing = serialized_listing.save(owner=user, address=address.save())

        try:
            image=request.FILES["photos"]
        except:
            return Response({ "error": "please include a photo!"})

        listingphoto = ListingPhoto(listing=listing, image=image)
        listingphoto.save() 

        return Response({ "status": "success", "listing": ListingSerializer(instance=listing).data}) 
        
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
        user = request.user 
        toDate = dateutil_parser.isoparse(request.data["toDate"])
        fromDate = dateutil_parser.isoparse(request.data["fromDate"])
        totalDays = toDate - fromDate 
        price = round(int(totalDays.days) * float(request.data["price"]), 2)
        listing = Listing.objects.get(pk=request.data["id"])
        reservations = Reservation.objects.filter(listing=listing, from_date__gte=fromDate, to_date__lte=toDate)

        # stop user from booking their own place 
        if listing.owner == user:
            return Response({ "status": "error", "msg": "you cannot book your own place"})

        # if no reservations exists for current dates make one 
        if not reservations:
            try:
                reservation = Reservation(
                    user=user, 
                    to_date = toDate,
                    from_date = fromDate,
                    listing=listing,
                    total_price = price 
                )
                reservation.save()

                # send owner of lister a message alerting them about the request 
                conversation = Converation.objects.get_prev_convo(user, listing.owner)
                
                message=f"{user.first_name} would like to book your place"
                
                # if no conversation currently exists between requester and owner make one
                if len(conversation) == 0:
                    conversation = Conversation.objects.create(
                        sender=user,
                        receiver=listing.owner
                    )

                # add an automated message to the conversation 
                Message.objects.create(
                    message=message,
                    sender=user, 
                    conversation=conversation[0],
                    time=datetime.now().strftime("%m/%d/%Y %H:%M")
                )
                return Response({ "status": "success"}, status=200)
            except Exception:
                return Response({ "status": "error"}, status=401)
            
        else:
            return Response({ "status": "error", "msg": "dates are not valid" }, status=401)

class StayView(RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ListingSerializer
    queryset = Listing.objects.all()

class ListingUpdateView(UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ListingSerializer
    queryset = Listing.objects.all()
    lookup_field = "pk"

    def update(self, request, *args, **kwargs):
        listing = ListingSerializer(instance=self.get_object(), data=request.data, partial=True)
        address = AddressSerializer(instance=self.get_object().address, data=request.data, partial=True)
        
        if listing.is_valid():
            listing.save()
        else:
            return Response({"status": "invalid listing data"})
        if address.is_valid():
            address.save()
        else:
            return Response({"status": "invalid address data"})
        
        if "photos" in request.FILES:
            photo = ListingPhoto(listing=self.get_object(), image=request.FILES["photos"])
           
        return Response({"status": "success" })

class StayListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        query = {}
        if request.GET.get("city"):
            query["address__city__contains"] = request.GET.get("city")
        if request.GET.get("state"):
            query["address__state__contains"] = request.GET.get("state")
        if request.GET.get("priceHigh"):
            query["price_per_night__lte"] = request.GET.get("priceHigh")
        if request.GET.get("priceLow"):
            query["price_per_night__gte"] = request.GET.get("priceLow")

        exclude = {}
        if request.GET.get("toDate"):
            exclude["reservation__to_date__gte"] = datetime.strptime("%Y-%m-%d", request.GET.get("toDate"))
        if request.GET.get("fromDate"):
            exclude["reservation__from_date__lte"] = datetime.strptime("%Y-%m-%d", request.GET.get("fromDate"))

        queryset = Listing.objects.filter(**query).exclude(**exclude)
        return Response({ "stays": ListingSerializer(queryset, many=True).data})

class AmenityListView(ListAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = AmenitySerializer
    queryset = Amenity.objects.all()

class AmenityUpdateView(UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AmenitySerializer
    queryset = Amenity.objects.all() 

    def put(self, request):
        amenities = request.data["amenities"]
        id = request.data["id"]
        listing = Listing.objects.get(id=id)

        for amenity in amenities:
            a = Amenity.objects.get(amenity=amenity["amenity"])
            if amenity["checked"]:
                listing.amenity_set.add(a) 
            else:
                listing.amenity_set.remove(a) 
        return Response({ "status": "success"})

class RulesCreateUpdateView(CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Rules.objects.all() 
    serializer_class = RulesSerializer 

    def post(self, request, *args, **kwargs):
        listing = Listing.objects.get(id=request.data["listing"])
        try:
            rules = listing.rules
            rules_serializer = CreateRulesSerializer(instance=rules, data=request.data, partial=True)
            if rules_serializer.is_valid():
                rules_serializer.save()
            else:
                return Response({ "status": "error"}, status=500)  
        except:
            request.data["listing"] = listing
            rules = Rules(**request.data)
            try:
                rules.save()
            except:
                Response({"status": "error"}, status=500)
        return Response(data={"status": "success"})

        
class ConversationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConversationSerializer 
    query_set = Conversation.objects.all() 

    def get(self, request, format=None):
        try:
            user = request.user 
            conversations = Conversation.objects.get_user_convos(user)
            return Response({ 
                "convos": ConversationSerializer(conversations, many=True).data,
                "status": "success"
            })
        except Exception:
            print(Exception.with_traceback())
            return Response({ "status": "error" })


class MessageListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    query_set = Conversation.objects.all() 
    serializer_class = MessageSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        user = request.user 
        convo = Conversation.objects.get(pk=kwargs["pk"]) 
        if convo.receiver == user or convo.sender == user:
            messages = convo.messages.all()
            return Response({ "status": "success", "messages": MessageSerializer(messages, many=True).data})
        else:
            return Response({ "status": "error", "msg": "not authorized"})