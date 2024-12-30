from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import ListCreateAPIView, CreateAPIView
from .models import Blog, Comment
from .serializers import BlogSerializer, CommentSerializer
from rest_framework.exceptions import ValidationError

class BlogListCreateView(ListCreateAPIView):
    queryset = Blog.objects.all().order_by('-created_at')
    serializer_class = BlogSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CommentCreateView(CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        blog_id = self.kwargs['blog_id']
        parent_id = self.request.data.get('parent')

        if parent_id:
            try:
                parent_comment = Comment.objects.get(id=parent_id)
                if parent_comment.parent is not None:
                    raise ValidationError("Replies to replies are not allowed.")
            except Comment.DoesNotExist:
                raise ValidationError("Parent comment does not exist.")
        else:
            parent_comment = None

        serializer.save(author=self.request.user, blog_id=blog_id, parent=parent_comment)

