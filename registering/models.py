from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from painting.models import Painting




class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("A user email is needed.")
        
        if not password:
            raise ValueError("A user password is needed.")
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)

        if not email:
            raise ValueError("A user email is needed.")
        
        if not password:
            raise ValueError("A user password is needed.")
        
        return self.create_user(email, password, **extra_fields)





class CustomUser(AbstractBaseUser, PermissionsMixin):


    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=200, blank=False, null=False, unique=True)  
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    date_joined = models.DateField(auto_now_add=True)

    firstname = models.CharField(max_length=200, blank=False, null=False)  
    lastname = models.CharField(max_length=200, blank=False, null=False)    
    nickname = models.CharField(max_length=50, null=True, blank=True)
    email = models.EmailField(max_length=200, unique=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    is_gallery = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    Theme = models.CharField(max_length=255, null=True, blank=True)
    Dark_light_theme = models.CharField(max_length=255, null=True, blank=True)
    

    favorite_painter = models.CharField(max_length=255 , null=True , blank=True)
    favorite_painting = models.CharField(max_length=255, null=True , blank=True)
    favorite_painting_style = models.CharField(max_length=255, null=True , blank=True)
    favorite_painting_technique = models.CharField(max_length=255, null=True , blank=True)
    favorite_painting_to_own = models.CharField(max_length=255, null=True , blank=True)
    biography = models.TextField(null=True, blank=True)

    gallery_name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(null=True, blank=True)
    cover_painting = models.ForeignKey(
        Painting,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='galleries_as_cover',
        default=None,
    )
    number_of_paintings = models.IntegerField(default=0)
    number_of_artists = models.IntegerField(default=0)


    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']  

    objects = CustomUserManager()

    def __str__(self):
        return self.username




        

