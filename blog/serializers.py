from rest_framework import serializers
from .models import Blog, Comment

class BlogSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'image', 'author_name', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'blog', 'content', 'author_name', 'created_at', 'parent', 'replies']
        read_only_fields = ['author_name', 'created_at', 'replies']

    def get_replies(self, obj):
        if not obj.is_reply():
            replies = obj.replies.all()
            return CommentSerializer(replies, many=True).data
        return []

    def validate_parent(self, value):
        if value and value.parent is not None:
            raise serializers.ValidationError("Replies to replies are not allowed.")
        return value
