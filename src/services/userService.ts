import axios from 'axios';
import api from '../api/config';

// Types
interface RequestConfig {
    headers?: {
        Authorization?: string;
        'Content-Type'?: string;
        [key: string]: string | undefined;
    };
}

export interface UserProfile {
    user_id?: number;
    email: string;
    firstname: string;
    lastname: string;
    username?: string;
    is_active?: boolean;
    is_admin?: boolean;
    date_joined?: string;
    nickname?: string;
    phone_number?: string;
    date_of_birth?: string;
    country?: string;
    city?: string;
    is_gallery?: boolean;
    profile_picture?: string | File;
    Theme?: string;
    Dark_light_theme?: string;
    favorite_painter?: string;
    favorite_painting?: string;
    favorite_painting_style?: string;
    favorite_painting_technique?: string;
    favorite_painting_to_own?: string;
    biography?: string;
}

export interface LoginResponse {
    token: string;
    user: {
        user_id: number;
        email: string;
        firstname: string;
        lastname: string;
        username: string;
        is_active: boolean;
        is_admin: boolean;
        date_joined: string;
    };
}

export interface RegistrationData {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    confirm_password: string;
    email: string;
}

export interface Painting {
    painting_id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    creation_date: string;
    style?: string;
    material?: string;
    year?: number;
    vertical_depth?: number;
    horizontal_depth?: number;
}

interface LoginCredentials {
    username: string;
    password: string;
}

interface RegisterResponse {
    message: string;
}

const userService = {
    // Authentication
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/user/login/', credentials);
        if (response.data.token) {
            this.setAuthToken(response.data.token);
            localStorage.setItem('userId', response.data.user.user_id.toString());
        }
        return response.data;
    },

    async logout(): Promise<void> {
        try {
            await api.post('/user/logout/');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            delete api.defaults.headers.common['Authorization'];
        }
    },

    async register(data: RegistrationData): Promise<RegisterResponse> {
        const response = await api.post<RegisterResponse>('/user/register/', data);
        return response.data;
    },

    // User Profile Management
    async getUserDetails(userId: number): Promise<UserProfile> {
        const response = await api.get<UserProfile>(`/user/${userId}/detail/`);
        return response.data;
    },

    async updateUserProfile(userId: number, profileData: UserProfile): Promise<UserProfile> {
        const formData = new FormData();
        Object.entries(profileData).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key === 'profile_picture' && value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        const response = await api.put<UserProfile>(`/user/${userId}/updateEditProfile/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async updateUserFavorites(userId: number, favoritesData: UserProfile): Promise<UserProfile> {
        const response = await api.put<UserProfile>(`/user/${userId}/updateFavorites/`, favoritesData);
        return response.data;
    },

    async getUserProfileDetails(userId: number): Promise<UserProfile> {
        const response = await api.get<UserProfile>(`/user/${userId}/detailEditProfile/`);
        return response.data;
    },

    async getUserFavorites(userId: number): Promise<UserProfile> {
        const response = await api.get<UserProfile>(`/user/${userId}/detailFavorites/`);
        return response.data;
    },

    // Painting Management
    async getUserPaintings(userId: number): Promise<Painting[]> {
        const response = await api.get<Painting[]>(`/painting/user/${userId}/paintings/`);
        return response.data;
    },

    async addPainting(userId: number, formData: FormData): Promise<Painting> {
        const response = await api.post<Painting>(`/painting/user/${userId}/paintings/add/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Utility function to set up auth token
    setAuthToken(token: string): void {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Token ${token}`;
    },

    // Initialize auth state from localStorage
    initializeAuth(): void {
        const token = localStorage.getItem('token');
        if (token) {
            this.setAuthToken(token);
        }
    },


    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    },


    getCurrentUserId(): number | null {
        const userId = localStorage.getItem('userId');
        return userId ? parseInt(userId, 10) : null;
    },
};


userService.initializeAuth();

export default userService;
