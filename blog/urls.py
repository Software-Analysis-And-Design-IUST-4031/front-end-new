from django.urls import path
from .views import BlogListCreateView, CommentCreateView

urlpatterns = [
    path('blogs/', BlogListCreateView.as_view(), name='blog_list_create'),
    path('blogs/<int:blog_id>/comments/', CommentCreateView.as_view(), name='comment_create'),
]
