from rest_framework import serializers  
from .models import * 
from random import randint
from django.core.validators import MaxLengthValidator, MinValueValidator, MaxValueValidator, MinLengthValidator

class CreateUserSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    firstname = serializers.CharField(max_length=100)
    lastname = serializers.CharField(max_length=100)
    birthdate = serializers.DateField() 
    
    def save(self):
        username = f'{self.data["firstname"]}_{self.data["lastname"]}{randint(0,200)}'
        
        new_user = User(
            email=self.data["email"],
            first_name=self.data["firstname"],
            last_name = self.data["lastname"],
            birthdate = self.data["birthdate"],
            username=username 
        ) 
        new_user.set_password(self.data["password"])
        new_user.save()

        return new_user 

class UserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    birthdate = serializers.DateField()
    username = serializers.CharField() 

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Review 
        fields = "__all__"

class ListingPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingPhoto 
        fields = "__all__"

class AddressSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Address 
        fields = "__all__"


class ListingReservationSerializer(serializers.ModelSerializer):
    photos = ListingPhotoSerializer(many=True, read_only=True)
    address = AddressSerializer()
    owner = UserSerializer()
    class Meta:
        model = Listing 
        fields = ["id", "headline", "photos", "owner", "address"]

class ReservationSerializer(serializers.ModelSerializer):
    listing = ListingReservationSerializer()
    user = UserSerializer()
    class Meta:
        model = Reservation 
        fields = "__all__"



class RulesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rules 
        fields = [
            "smoking",
            "pets",
            "parties",
            "check_in",
            "check_out",
            "additional"
        ]

class CreateRulesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rules 
        fields = "__all__"

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = "__all__"

class ListingSerializer(serializers.ModelSerializer):
    owner = UserSerializer()
    address = AddressSerializer()
    photos = ListingPhotoSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(source="amenity_set", many=True, read_only=True)
    rules = RulesSerializer()
    class Meta:
        model = Listing 
        fields = [
            'id', 
            'owner', 
            'address', 
            'description', 
            'headline', 
            'photos', 
            "reservations", 
            "price_per_night",
            "room_type",
            "reviews",
            "rules",
            "amenities"
        ]

class CreateListingSerializer(serializers.Serializer):
    description = serializers.CharField(max_length=500)
    headline = serializers.CharField(max_length=255)
    price_per_night = serializers.DecimalField(max_digits=5, decimal_places=2)
    room_type = serializers.ChoiceField(choices=["P", "S", "W"])

    def create(self, validated_data):
        return Listing.objects.create(**validated_data)
    
class ListingQuerySerializer(serializers.Serializer):
    city = serializers.CharField(max_length=50)
    state = serializers.CharField(max_length=2)



class MessageSerializer(serializers.Serializer):
    sender = serializers.CharField()
    message = serializers.CharField()
    id = serializers.CharField()
    time = serializers.CharField()
    class Meta:
        model = Message 
        fields = ["id", "sender", "message", "time"]

class ConversationSerializer(serializers.Serializer):
    sender = UserSerializer()
    receiver = UserSerializer()
    id = serializers.CharField()
    messages = MessageSerializer(many=True)
    class Meta:
        model = Conversation 
        fields = "__all__"


