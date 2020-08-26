from django.urls import path 
from . import views 
from rest_framework_jwt.views import refresh_jwt_token

urlpatterns = [
    path("csrf", views.get_csrf),
    path("user", views.UserView.as_view()),
    path("users", views.UserListView.as_view()),
    path("refresh_token", refresh_jwt_token),
    path("login", views.login),
    path("listings", views.ListingView.as_view()),
    path("reservations", views.ReservationView.as_view()),
    path("stay/<int:pk>", views.StayView.as_view()),
    path("stays", views.StayListView.as_view())
]