// Add theme to UserProfile interface
export interface UserProfile {
  user_id: number;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  is_active: boolean;
  is_admin: boolean;
  date_joined: string;
  nickname?: string;
  phone_number?: string;
  date_of_birth?: string;
  country?: string;
  city?: string;
  is_gallery?: boolean;
  profile_picture?: string | File;
  Theme?: string;
  Dark_light_theme?: 'light' | 'dark';
  favorite_painter?: string;
  favorite_painting?: string;
  favorite_painting_style?: string;
  favorite_painting_technique?: string;
  favorite_painting_to_own?: string;
  biography?: string;
  gallery_name?: string;
  description?: string;
  cover_painting?: string;
  number_of_paintings?: number;
  following?: number;
  followers?: number;
}

// Backend Painting type from API
export interface BackendPainting {
  painting_id: number;
  title: string;
  description: string;
  image: string | null;
  creation_date: string;
  horizontal_depth: string;
  vertical_depth: string;
  material: string;
  price: string;
  style: string;
  year: number;
  artist?: number;
  artist_name?: string;
  likes?: number;
  is_liked?: boolean;
}

// Common painting interface used throughout the app
export interface Painting {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
  year: string;
  style: string;
  material: string;
  horizontalDepth: string;
  verticalDepth: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user_id: number;
  username: string;
  message: string;
}
