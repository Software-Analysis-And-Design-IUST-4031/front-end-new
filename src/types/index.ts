// Backend Types
export interface AuthorData {
  user_id?: number;
  id?: number;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  profile_picture?: string;
  biography?: string;
}

export interface BackendPainting {
  painting_id: number;
  title: string;
  description: string;
  image: string;
  creation_date: string;
  artist: number;
  price: number | null;
  material: string | null;
  style: string | null;
  year: number | null;
  vertical_depth: number | null;
  horizontal_depth: number | null;
  likes?: number;
  is_liked?: boolean;
}

// Frontend Types
export interface Painting {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number | string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  style?: string;
  material?: string;
  horizontalDepth?: string;
  verticalDepth?: string;
  year?: string;
  author?: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
    email?: string;
  };
}

export interface UserProfile {
  user_id: number;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  nickname: string | null;
  phone_number: File;
  date_of_birth: string | null;
  country: string | null;
  city: string | null;
  is_gallery: boolean;
  profile_picture: string | File | null;
  Theme: string | null;
  Dark_light_theme: string | null;
  favorite_painter: string | null;
  favorite_painting: string | null;
  favorite_painting_style: string | null;
  favorite_painting_technique: string | null;
  favorite_painting_to_own: string | null;
  biography: string | null;
  gallery_name?: string;
  description?: string;
  number_of_paintings: number;
  number_of_artists: number;
  followers: number;
  following: number;
}

export interface LoginResponse {
  message?: string;
  access: string;
  refresh: string;
  user_id?: number;  
  username?: string; 
}

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
