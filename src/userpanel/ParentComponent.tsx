import React, { useState } from 'react';
import PostGrid from './PostGrid';
import { Post } from '../types';

const ParentComponent: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      imageUrl: 'https://via.placeholder.com/300',
      caption: 'Abstract art piece exploring color and form',
      title: 'Chromatic Dreams',
      price: '$299.99',
      likes: 15,
      isLiked: false,
      isSaved: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '2',
      imageUrl: 'https://via.placeholder.com/300',
      caption: 'Digital landscape with vibrant colors',
      title: 'Digital Vista',
      price: '$399.99',
      likes: 42,
      isLiked: false,
      isSaved: false,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    }
  ]);

  const handleLike = (id: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleSave = (id: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  const handleDelete = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  const handleShare = (id: string) => {
    // Implement your share functionality here
    console.log(`Post ${id} shared!`);
  };

  return (
    <PostGrid
      posts={posts}
      onLike={handleLike}
      onSave={handleSave}
      onDelete={handleDelete}
      onShare={handleShare}
    />
  );
};

export default ParentComponent;