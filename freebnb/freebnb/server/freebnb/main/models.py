from django.db import models
from django.contrib.auth.models import  AbstractUser
from localflavor.us.models import USStateField, USZipCodeField

# Create your models here.

class User(AbstractUser):
    email = models.EmailField(unique=True)
    birthdate = models.DateField(null=True)
    superhost = models.BooleanField(default=False)
    
class Address(models.Model):
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    state = USStateField()
    zip_code = USZipCodeField()
    created_at = models.DateTimeField(auto_now_add=True)

class Listing(models.Model):
    address = models.OneToOneField(Address, on_delete=models.CASCADE) 
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings", related_query_name="listing") 
    headline = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    price_per_night = models.IntegerField()
    room_type = models.CharField(max_length=1, choices=[("P", "Private Room"), ("S", "Shared Room"), ("W", "Whole House")])

class ListingPhoto(models.Model):
    image = models.ImageField(upload_to="listings/")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="photos", related_query_name="photo")

class Reservation(models.Model):
    from_date = models.DateField()
    to_date = models.DateField()
    total_price = models.IntegerField()
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="reservations", related_query_name="reservation")
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Conversation(models.Model):
    created_at = models.DateTimeField(auto_created=True)
    last_modified = models.DateTimeField() 
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="conversations", related_query_name="conversation")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE)

class Message(models.Model): 
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField(max_length=500)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages", related_query_name="message")