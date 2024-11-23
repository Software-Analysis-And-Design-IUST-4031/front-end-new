export interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  title: string;
  price: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  description?: string;
  location?: string;
  followers: number;
  following: number;
  socialLinks?: {
    twitter?: string;
    pinterest?: string;
  };
  bio?: string;
}

export interface CustomTheme {
  bg: string;
  text: string;
}

export interface CustomThemeProps {
  customBg?: string;
  customText?: string;
}
