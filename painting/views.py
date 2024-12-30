from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView
from rest_framework.permissions import AllowAny ,  IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from rest_framework.views import APIView
from .models import Painting , Like
from .serializers import PaintingDetailSerializer, PaintingListSerializer , LikeSerializer , UserLikesSumSerializer
from registering.models import CustomUser
from django.db.models import Count 
from django.db import models
from rest_framework.pagination import PageNumberPagination
from .serializers import UserLikesSumSerializer
from django.db.models import Sum , F , Q
from django.db.models import Sum, OuterRef, Subquery
from rest_framework.generics import DestroyAPIView









class PaintingDetailView(APIView):
    """
    View to retrieve details of a specific painting.
    """
    serializer_class = PaintingDetailSerializer
    permission_classes = [AllowAny]

    def get(self, request, painting_id):
        try:
            painting = get_object_or_404(Painting, painting_id=painting_id)
            serializer = self.serializer_class(painting)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Painting.DoesNotExist:
            return Response({"error": "Painting not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal server error", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class UserPaintingsView(ListAPIView):
    """
    View to list all paintings of a specific user.
    """
    serializer_class = PaintingListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = get_object_or_404(CustomUser, user_id=user_id)
        return Painting.objects.filter(artist=user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = request.query_params.get('page', 1)
        limit = request.query_params.get('limit', 10)
        
        paginator = Paginator(queryset, limit)
        try:
            paintings = paginator.page(page)
        except PageNotAnInteger:
            paintings = paginator.page(1)
        except EmptyPage:
            paintings = paginator.page(paginator.num_pages)

        serializer = self.serializer_class(paintings, many=True)
        response_data = {
            "userId": self.kwargs['user_id'],
            "paintings": serializer.data,
            "pagination": {
                "page": int(page),
                "limit": int(limit),
                "totalPages": paginator.num_pages,
                "totalPaintings": paginator.count
            }
        }
        return Response(response_data, status=status.HTTP_200_OK)







class AddPaintingView(CreateAPIView):
    """
    View to add a new painting.
    """
    serializer_class = PaintingDetailSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):

        if request.user.user_id != int(user_id):
            return Response({"error": "You do not have permission to add a painting for this user."}, status=status.HTTP_403_FORBIDDEN)
        user = get_object_or_404(CustomUser, user_id=user_id)
        
        
        data = request.data.copy()
        data.update(request.FILES)

        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            painting = serializer.save(artist=user)
            response_data = {
                "message": "Painting added successfully.",
                "painting": self.serializer_class(painting).data
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid request body", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)








class DeletePaintingView(DestroyAPIView):
    """
    View to delete a painting.
    """
    queryset = Painting.objects.all()
    serializer_class = PaintingDetailSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        
      
        if instance.artist != request.user:
            return Response({"error": "You do not have permission to delete this painting."}, status=status.HTTP_403_FORBIDDEN)
        
        instance.delete()
        return Response({"message": "Painting deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    



class DeletePaintingView2(APIView):
    """
    View to delete a painting for a specific user.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id, painting_id):
        
        user = get_object_or_404(CustomUser, user_id=user_id)
        painting = get_object_or_404(Painting, painting_id=painting_id, artist=user)

        
        if painting.artist != request.user:
            return Response({"error": "You do not have permission to delete this painting."}, status=status.HTTP_403_FORBIDDEN)

      
        painting.delete()
        return Response({"message": "Painting deleted successfully."}, status=status.HTTP_204_NO_CONTENT)










class LikePaintingView(CreateAPIView):
    """
    View to like a painting by a user.
    """
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, painting_id):
        painting = get_object_or_404(Painting, painting_id=painting_id)
        user = request.user

        
        if Like.objects.filter(user=user, painting=painting).exists():
            return Response({"error": "You have already liked this painting"}, status=status.HTTP_400_BAD_REQUEST)

       
        like = Like.objects.create(user=user, painting=painting)

        response_data = {
            "message": "Painting liked successfully.",
            "like": LikeSerializer(like).data
        }
        return Response(response_data, status=status.HTTP_201_CREATED)




class UnLikePaintingView(CreateAPIView):
    """
    View to like or unlike a painting by a user.
    """
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, painting_id):  
        painting = get_object_or_404(Painting, painting_id=painting_id) 
        user = request.user

        
        like = Like.objects.filter(user=user, painting=painting).first()
        if like:
            
            like.delete()
            return Response({"message": "Painting unliked successfully."}, status=status.HTTP_200_OK)
        else:
            
            like = Like.objects.create(user=user, painting=painting)
            response_data = {
                "message": "Painting liked successfully.",
                "like": LikeSerializer(like).data
            }
            return Response(response_data, status=status.HTTP_201_CREATED)





class GetPaintingLikesView(RetrieveAPIView):
    """
    View to get the number of likes for a painting.
    """
    serializer_class = LikeSerializer

    def get(self, request, painting_id):
        painting = get_object_or_404(Painting, painting_id=painting_id)
        likes_count = painting.likes.count()

        response_data = {
            "painting_id": painting_id,
            "likes_count": likes_count
        }
        return Response(response_data, status=status.HTTP_200_OK)
    





class TopPaintingView(APIView):
    """
    View to get the top painting based on the number of likes.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        # Annotate each painting with the count of likes
        top_painting = Painting.objects.annotate(likes_count=models.Count('likes')).order_by('-likes_count').first()

        if top_painting:
            serializer = PaintingDetailSerializer(top_painting)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No paintings found"}, status=status.HTTP_404_NOT_FOUND)
        





class SortedPaintingsByLikesView(ListAPIView):
    """
    View to list all paintings sorted by the number of likes.
    """
    serializer_class = PaintingListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        
        return Painting.objects.annotate(likes_count=models.Count('likes')).order_by('-likes_count')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = request.query_params.get('page', 1)
        limit = request.query_params.get('limit', 10)
        
        paginator = Paginator(queryset, limit)
        try:
            paintings = paginator.page(page)
        except PageNotAnInteger:
            paintings = paginator.page(1)
        except EmptyPage:
            paintings = paginator.page(paginator.num_pages)

        serializer = self.serializer_class(paintings, many=True)
        response_data = {
            "paintings": serializer.data,
            "pagination": {
                "page": int(page),
                "limit": int(limit),
                "totalPages": paginator.num_pages,
                "totalPaintings": paginator.count
            }
        }
        return Response(response_data, status=status.HTTP_200_OK)










class UserLikesSumView(ListAPIView):
    serializer_class = UserLikesSumSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
       
        painting_likes_subquery = Like.objects.filter(
            painting=OuterRef('pk')
        ).values('painting').annotate(
            total_likes=Count('id')
        ).values('total_likes')

       
        user_likes_subquery = Painting.objects.filter(
            artist=OuterRef('pk')
        ).annotate(
            painting_likes=Subquery(painting_likes_subquery, output_field=models.IntegerField())
        ).values('artist').annotate(
            total_likes=Sum('painting_likes')
        ).values('total_likes')

     
        queryset = CustomUser.objects.annotate(
            total_likes=Subquery(user_likes_subquery, output_field=models.IntegerField())
        ).exclude(total_likes=None).order_by('-total_likes')

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

       
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response_data = {
                "users": serializer.data,
                "pagination": {
                    "page": self.paginator.page.number,
                    "limit": self.paginator.page_size,
                    "totalPages": self.paginator.page.paginator.num_pages,
                    "totalUsers": self.paginator.page.paginator.count
                }
            }
            return Response(response_data, status=status.HTTP_200_OK)

       
        serializer = self.get_serializer(queryset, many=True)
        response_data = {
            "users": serializer.data,
            "pagination": {
                "page": 1,  
                "limit": 10,  
                "totalPages": 1, 
                "totalUsers": len(queryset)  
            }
        }
        return Response(response_data, status=status.HTTP_200_OK)









class CheckUserLikedPaintingView(APIView):
    """
    View to check if a specific user has liked a specific painting.
    """
    permission_classes = [AllowAny]

    def get(self, request, user_id, painting_id):
        user = get_object_or_404(CustomUser, user_id=user_id)
        painting = get_object_or_404(Painting, painting_id=painting_id)

      
        liked = Like.objects.filter(user=user, painting=painting).exists()

        response_data = {
            "user_id": user_id,
            "painting_id": painting_id,
            "liked": liked
        }
        return Response(response_data, status=status.HTTP_200_OK)










