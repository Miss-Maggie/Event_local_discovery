from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    # Make email unique and required for login
    email = models.EmailField(unique=True)
    
    # Optional fields for extra info
    is_host = models.BooleanField(default=False)  # True if user can create events
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    
    # Use email as the username field for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Fields required when creating superuser (besides email and password)

    def __str__(self):
        return self.email