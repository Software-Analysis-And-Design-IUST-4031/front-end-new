from rest_framework import serializers
from .models import Painting
from .models import Like
from registering.models import CustomUser



class PaintingDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Painting
        fields = ['painting_id', 'title', 'description','image', 'creation_date', 'artist' , 'price', 'material' , 'style' , 'year' , 'vertical_depth' , 'horizontal_depth']
        read_only_fields = ['artist', 'creation_date'] 

class PaintingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Painting
        fields = ['painting_id', 'title', 'description' ,'image' , 'creation_date' , 'price','material' , 'style' , 'year' , 'vertical_depth' , 'horizontal_depth']


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['user', 'painting', 'created_at']


class UserLikesSumSerializer(serializers.ModelSerializer):
    total_likes = serializers.IntegerField()  
    class Meta:
        model = CustomUser
        fields = ['user_id', 'username', 'profile_picture', 'total_likes']


