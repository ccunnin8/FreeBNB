from rest_framework import serializers  
from .models import User, Listing, Reservation, Address, ListingPhoto  
from random import randint

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


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation 
        fields = "__all__"

class AddressSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Address 
        fields = "__all__"

class ListingPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingPhoto 
        fields = "__all__"

class ListingSerializer(serializers.ModelSerializer):
    owner = UserSerializer()
    address = AddressSerializer()
    photos = ListingPhotoSerializer(many=True, read_only=True)
    reservations = ReservationSerializer(many=True, read_only=True)
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
            "room_type"
        ]
    