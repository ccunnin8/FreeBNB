from django.db import models
from django.db.models import Q 
from django.contrib.auth.models import  AbstractUser
from localflavor.us.models import USStateField, USZipCodeField
from django.core.validators import MaxValueValidator, MinValueValidator
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
    price_per_night = models.DecimalField(max_digits=4, decimal_places=2)
    room_type = models.CharField(max_length=1, choices=[("P", "Private Room"), ("S", "Shared Room"), ("W", "Whole House")])

class Amenity(models.Model):
    amenity = models.CharField(max_length=50)
    listings = models.ManyToManyField(Listing)

class Rules(models.Model):
    listing = models.OneToOneField(Listing, on_delete=models.CASCADE, related_name="rules", related_query_name="rules")
    smoking = models.BooleanField(default=False)
    pets = models.BooleanField(default=False)
    parties = models.BooleanField(default=False)
    check_in = models.IntegerField(default=12)
    check_out = models.IntegerField(default=10)
    additional = models.TextField(max_length=500)

class Review(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="reviews", related_query_name="review")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews", related_query_name="review")
    review = models.TextField(max_length=500)
    rating = models.IntegerField(default=1, validators=[
        MaxValueValidator(5),
        MinValueValidator(1)
    ])

class ListingPhoto(models.Model):
    image = models.ImageField(upload_to="listings/")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="photos", related_query_name="photo")

class Reservation(models.Model):
    from_date = models.DateField()
    to_date = models.DateField()
    total_price = models.IntegerField()
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="reservations", related_query_name="reservation")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    accepted = models.BooleanField(default=False)

class ConversationManager(models.Manager):
    def get_user_convos(self, user):
        q = Q(sender=user) | Q(receiver=user)
        return self.get_queryset().filter(q) 
    
    def get_prev_convo(self, user1, user2):
        q1 = Q(sender=user1) & Q(receiver=user2)
        q2 = Q(sender=user2) & Q(receiver=user1)
        return self.get_queryset().filter(q1 | q2)
    
class Conversation(models.Model):
    objects = ConversationManager()

    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now_add=True) 
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="conversations", related_query_name="conversation")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE)

class Message(models.Model): 
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField(max_length=500)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages", related_query_name="message")
    time = models.TextField(max_length=15, default="")
    