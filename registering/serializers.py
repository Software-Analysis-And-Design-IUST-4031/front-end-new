from rest_framework import serializers
from .models import CustomUser
from painting.models import Painting
from django.db.models import Count
from painting.serializers import PaintingListSerializer
import random


class UserRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['firstname', 'lastname', 'username', 'password', 'confirm_password', 'email']
        extra_kwargs = {
            'firstname': {'required': True},
            'lastname': {'required': True},
            'username': {'required': True},
            'password': {'write_only': True, 'required': True},
            'email': {'required': True}
        }

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = CustomUser.objects.create_user(
            firstname=validated_data['firstname'],
            lastname=validated_data['lastname'],
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
        )
        return user




class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length = 200)
    password = serializers.CharField(max_length = 200, min_length=10, style={'input_type': 'password'})
    token = serializers.CharField(max_length=255, read_only=True)



class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['user_id', 'email', 'firstname', 'lastname', 'username', 
                  'is_active', 'is_admin','date_joined','nickname', 'phone_number'
                    , 'date_of_birth' , 'profile_picture' , 'nickname' , 'country',
                      'city' ,'favorite_painter' , 'favorite_painting' , 'favorite_painting_style',
                        'favorite_painting_technique' ,'favorite_painting_to_own','biography',
                          'Theme' , 'Dark_light_theme','gallery_name','description','cover_painting','is_gallery']

 


# class UserUpdateSerializerEditProfile(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ['firstname', 'lastname', 'nickname' ,'email' , 'phone_number' ,'date_of_birth' ,'country', 'city' ,'is_gallery','profile_picture' , 'Theme' , 'Dark_light_theme','gallery_name','description']



class UserUpdateSerializerEditProfile(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['firstname', 'lastname', 'nickname' ,'email' , 'phone_number' ,'date_of_birth' ,'country', 'city' ,'is_gallery','profile_picture' , 'Theme' , 'Dark_light_theme','gallery_name','description','biography']
        def get_profile_picture_url(self, obj):
            if obj.profile_picture:
                return obj.profile_picture.url
            return None




class UserUpdateSerializerFavorites(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['favorite_painter', 'favorite_painting', 'favorite_painting_style', 'favorite_painting_technique' ,'favorite_painting_to_own' , 'biography' , 'Theme' , 'Dark_light_theme' ]





# class UserDetailSerializerEditProfile(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ['firstname', 'lastname', 'nickname' ,'email' , 'phone_number' ,'date_of_birth' ,'country', 'city' ,'is_gallery','profile_picture' , 'Theme' , 'Dark_light_theme','gallery_name','description','cover_painting']

#     def update(self, instance, validated_data):
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()  
#         return instance





# class UserDetailSerializerEditProfile(serializers.ModelSerializer):
#     # cover_painting = serializers.SerializerMethodField()

#     class Meta:
#         model = CustomUser
#         fields = ['firstname', 'lastname', 'nickname', 'email', 'phone_number', 'date_of_birth', 'country', 'city', 'is_gallery', 'profile_picture', 'Theme', 'Dark_light_theme', 'gallery_name', 'description', 'biography', 'cover_painting']

#     # def get_cover_painting(self, obj):
      
#     #     latest_painting = Painting.objects.filter(artist=obj).order_by('-creation_date').first()
#     #     if latest_painting:
           
#     #         return latest_painting.image.url
#     #     return None


class UserDetailSerializerEditProfile(serializers.ModelSerializer):
    cover_painting = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['firstname', 'lastname', 'nickname', 'email', 'phone_number', 'date_of_birth', 'country', 'city', 'is_gallery', 'profile_picture', 'Theme', 'Dark_light_theme', 'gallery_name', 'description', 'biography', 'cover_painting']
    def get_cover_painting(self, obj):
      
        paintings = Painting.objects.filter(artist=obj)
        
        if paintings.exists():
       
            random_painting = random.choice(paintings)
            return random_painting.image.url
        
        return None 



class UserDetailSerializerFavorites(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['favorite_painter', 'favorite_painting', 'favorite_painting_style', 'favorite_painting_technique' ,'favorite_painting_to_own' , 'biography' ]
 

class GallerySerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()
    number_of_paintings = serializers.SerializerMethodField()
    number_of_artists = serializers.SerializerMethodField()
    owner_id = serializers.IntegerField(source='user_id')

    class Meta:
        model = CustomUser
        fields = ['gallery_name', 'description', 'cover_image', 'number_of_paintings', 'number_of_artists', 'owner_id']

    # def get_cover_image(self, obj):
    #     if obj.cover_painting:
    #         return obj.cover_painting.image.url
    #     return None

    def get_cover_image(self, obj):
        paintings = Painting.objects.filter(artist=obj)
        
        if paintings.exists():
        
            random_painting = random.choice(paintings)
            return random_painting.image.url
        
        return None 
    
    def get_number_of_paintings(self, obj):
        return Painting.objects.filter(artist=obj).count()

    def get_number_of_artists(self, obj):
        return Painting.objects.filter(artist=obj).values('artist').distinct().count()

class GalleryCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['gallery_name', 'description']


class UserSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['user_id', 'email', 'firstname', 'lastname', 'username','nickname', 'phone_number' , 'date_of_birth' , 'profile_picture' , 'nickname' , 'country', 'city' ,'favorite_painter' , 'favorite_painting' , 'favorite_painting_style', 'favorite_painting_technique' ,'favorite_painting_to_own','biography','gallery_name', 'description']

 
