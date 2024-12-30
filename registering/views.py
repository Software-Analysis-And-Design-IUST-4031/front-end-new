from django.shortcuts import render

from registering.serializers import UserRegistrationSerializer, UserLoginSerializer , UserDetailSerializer , UserUpdateSerializerEditProfile,UserUpdateSerializerFavorites,UserDetailSerializerEditProfile,UserDetailSerializerFavorites,UserSearchSerializer

from registering.serializers import UserRegistrationSerializer, UserLoginSerializer , UserDetailSerializer , UserUpdateSerializerEditProfile,UserUpdateSerializerFavorites,UserDetailSerializerEditProfile,UserDetailSerializerFavorites

from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from django.conf import settings
from django.contrib.auth import get_user_model
from .utils import generate_access_token
import jwt
from django.shortcuts import get_object_or_404
from registering.models import CustomUser
from rest_framework.generics import RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import GalleryCreationSerializer , GallerySerializer
from painting.models import Painting

from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from registering.filters import CustomUserFilter
from rest_framework.filters import SearchFilter
from rest_framework.filters import OrderingFilter
from rest_framework.viewsets import ModelViewSet




class UserRegistrationAPIView(APIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            data = {
                'message': 'User registered successfully.',
            }
            response = Response(data, status=status.HTTP_201_CREATED)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class UserLoginAPIView(APIView):
    serializer_class = UserLoginSerializer
    permission_classes = (AllowAny,)
    def post(self, request):       
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):          
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')

            user_model = get_user_model()
            user_instance = authenticate(username=username, password=password)            
            if not user_instance:
                raise AuthenticationFailed('Invalid username or password.')           
            if not user_instance.is_active:
                raise AuthenticationFailed('This account is inactive.')
            refresh = RefreshToken.for_user(user_instance)          
            access_token = str(refresh.access_token)
            return Response({
                'user_id': user_instance.user_id,
                'message': 'Login successful.',
                'access': access_token,               
                'refresh': str(refresh),
                'user_id': user_instance.user_id,                                
                }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)










class UserViewAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request):
        user_token = request.COOKIES.get('access_token')
        if not user_token:
            raise AuthenticationFailed('Unauthenticated user.')

        payload = jwt.decode(user_token, settings.SECRET_KEY, algorithms=['HS256'])
        user_model = get_user_model()
        user = user_model.objects.filter(user_id=payload['user_id']).first()
        user_serializer = UserRegistrationSerializer(user)
        return Response(user_serializer.data)






class UserLogoutViewAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request):
        user_token = request.COOKIES.get('access_token', None)
        response = Response()
        if user_token:
            response.delete_cookie('access_token')
            response.data = {'message': 'Logged out successfully.'}
        else:
            response.data = {'message': 'User is already logged out.'}
        return response




class GetUsernameByUserIdAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = get_object_or_404(CustomUser, user_id=user_id)
            return Response({"username": user.username}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal server error", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class GetUserIdByUsernameAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        try:
            user = get_object_or_404(CustomUser, username=username)
            return Response({"user_id": user.user_id}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal server error", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






class UserDetailAPIView(APIView):
    serializer_class = UserDetailSerializer
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = get_object_or_404(CustomUser, user_id=user_id)
            serializer = self.serializer_class(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Internal server error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



# class UserUpdateAPIViewEditProfile(APIView):
#     serializer_class = UserUpdateSerializerEditProfile
#     permission_classes = [IsAuthenticated]

#     def put(self, request, user_id):
#         try:
#             user = get_object_or_404(CustomUser, user_id=user_id)
#             if 'is_gallery' in request.data:
           
#                 user.is_gallery = bool(request.data['is_gallery'])
            
#             serializer = self.serializer_class(user, data=request.data, partial=True)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(
#                     {"message": "User profile updated successfully.", "user": serializer.data},
#                     status=status.HTTP_200_OK
#                 )
#             else:
#                 return Response(
#                     {"error": "Invalid data", "details": serializer.errors},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
#         except CustomUser.DoesNotExist:
#             return Response(
#                 {"error": "User not found"},
#                 status=status.HTTP_404_NOT_FOUND
#             )
#         except Exception as e:
#             return Response(
#                 {"error": "Internal server error", "details": str(e)},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )





class UserUpdateAPIViewEditProfile(APIView):
    serializer_class = UserUpdateSerializerEditProfile
    permission_classes = [IsAuthenticated]

    def put(self, request, user_id):
        try:
            user = get_object_or_404(CustomUser, user_id=user_id)
            
            if 'biography' in request.data:
                user.description = request.data['biography']
            
            if 'firstname' in request.data:
                user.gallery_name = request.data['firstname']
            
            if 'is_gallery' in request.data:
                user.is_gallery = bool(request.data['is_gallery'])
            
            serializer = self.serializer_class(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                
                
                detail_serializer = UserDetailSerializerEditProfile(user)
                return Response(
                    {"message": "User profile updated successfully.", "user": detail_serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "Invalid data", "details": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Internal server error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )








class UserUpdateAPIViewFavorites(APIView):
    serializer_class = UserUpdateSerializerFavorites
    permission_classes = [IsAuthenticated]

    def put(self, request, user_id):
        try:
            user = get_object_or_404(CustomUser, user_id=user_id)
            
          
            serializer = self.serializer_class(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "User profile updated successfully.", "user": serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "Invalid data", "details": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Internal server error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class UserDetailAPIViewEditProfile(APIView):
    serializer_class = UserDetailSerializerEditProfile
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = get_object_or_404(CustomUser, user_id=user_id)
            serializer = self.serializer_class(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Internal server error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class UserDetailAPIViewFavorites(APIView):
    serializer_class = UserDetailSerializerFavorites
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = get_object_or_404(CustomUser, user_id=user_id)
            serializer = self.serializer_class(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Internal server error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CreateGalleryAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        user_id = user.user_id  

       
        print(f"User ID: {user_id}")
        if 'is_gallery' in request.data:
            user.is_gallery = request.data['is_gallery']  # This ensures the is_gallery is updated
            user.save()

        if not user.is_gallery:
            return Response({"error": "Only gallery users can create a gallery."}, status=status.HTTP_403_FORBIDDEN)
        
        paintings = Painting.objects.filter(artist=user)
        
        if not paintings.exists():
            return Response({"error": "User has no paintings. Gallery cannot be created."}, status=status.HTTP_400_BAD_REQUEST)
        
        
        first_painting = paintings.first()
        cover_image = first_painting.image
        
        
        number_of_paintings = paintings.count()
        number_of_artists = paintings.values('artist').distinct().count()

        serializer = GalleryCreationSerializer(data=request.data)
        if serializer.is_valid():
            gallery_name = serializer.validated_data['gallery_name']
            description = serializer.validated_data['description']

            user.gallery_name = gallery_name
            user.description = description
            user.cover_painting = first_painting  
            user.number_of_paintings = number_of_paintings  
            user.number_of_artists = number_of_artists 
            user.save()
            return Response({
                "message": "Gallery created successfully.",
                "gallery_name": gallery_name,
                "description": description,
                "cover_image": first_painting.image.url,
                "number_of_paintings": number_of_paintings,
                "number_of_artists": number_of_artists
            }, status=status.HTTP_201_CREATED)
        
        return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    


class ListGalleriesAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        galleries = CustomUser.objects.filter(is_gallery=True)
        serializer = GallerySerializer(galleries, many=True)

        for gallery in serializer.data:
            if not gallery.get('profile_picture'):
                gallery['profile_picture'] = None  
            gallery.pop('cover_image', None)

        return Response(serializer.data, status=status.HTTP_200_OK)







class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100







class UserSearchListAPIView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSearchSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = CustomUserFilter
    search_fields = [
        'firstname', 'lastname', 'username', 'email', 'phone_number',
        'country', 'city', 'favorite_painter', 'favorite_painting',
        'favorite_painting_style', 'favorite_painting_technique',
        'favorite_painting_to_own', 'biography', 'gallery_name', 'description','nickname','date_of_birth'
    ]
    ordering_fields = ['firstname', 'lastname', 'date_joined']
    ordering = ['firstname']  # Default sorting
    pagination_class = CustomPagination







class UserSearchAdvancedListAPIView(generics.ListAPIView):
    queryset = CustomUser.objects.all().order_by('firstname')  
    serializer_class = UserSearchSerializer
    pagination_class = CustomPagination
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = [
        'firstname', 'lastname', 'username', 'email', 'phone_number',
        'country', 'city', 'favorite_painter', 'favorite_painting',
        'favorite_painting_style', 'favorite_painting_technique',
        'favorite_painting_to_own', 'biography', 'gallery_name', 'description','nickname','date_of_birth'
    ]
    ordering_fields = ['firstname', 'lastname', 'date_joined']  
    filterset_fields = ['is_active', 'is_staff']  
    # return Response(serializer.data, status=status.HTTP_200_OK)




