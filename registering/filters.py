import django_filters
from registering.models import CustomUser

class CustomUserFilter(django_filters.FilterSet):
    class Meta:
        model = CustomUser
        fields = {
            'firstname': ['exact', 'icontains'],
            'lastname': ['exact', 'icontains'],
            'username': ['exact', 'icontains'],
            'email': ['exact', 'icontains'],
            'phone_number': ['exact', 'icontains'],
            'nickname': ['exact', 'icontains'],
            'country': ['exact', 'icontains'],
            'city': ['exact', 'icontains'],
            'favorite_painter': ['exact', 'icontains'],
            'favorite_painting': ['exact', 'icontains'],
            'favorite_painting_style': ['exact', 'icontains'],
            'favorite_painting_technique': ['exact', 'icontains'],
            'favorite_painting_to_own': ['exact', 'icontains'],
            'biography': ['exact', 'icontains'],
            'gallery_name': ['exact', 'icontains'],
            'description': ['exact', 'icontains'],
            # Add other fields as necessary
        } 