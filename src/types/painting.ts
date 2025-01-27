export interface Painting {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
  style: string;
  material: string;
  horizontalDepth: string;
  verticalDepth: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  author: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
  };
} 