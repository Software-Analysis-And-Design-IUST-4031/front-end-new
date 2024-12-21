// Backend Types
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
}

// Frontend Types
export interface Painting {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

export interface UserProfile {
  user_id: number;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  nickname: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  country: string | null;
  city: string | null;
  is_gallery: boolean;
  profile_picture: string | null;
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
