import axios from 'axios';

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
    email?: string;
    firstname?: string;
    lastname?: string;
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

const BASE_URL = 'http://127.0.0.1:8000/api';

const userService = {
    // Authentication
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await axios.post<LoginResponse>(`${BASE_URL}/user/login/`, credentials);
        if (response.data.token) {
            this.setAuthToken(response.data.token);
            localStorage.setItem('userId', response.data.user.user_id.toString());
        }
        return response.data;
    },

    async logout(): Promise<void> {
        try {
            await axios.post(`${BASE_URL}/user/logout/`);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            delete axios.defaults.headers.common['Authorization'];
        }
    },

    async register(data: RegistrationData): Promise<RegisterResponse> {
        const response = await axios.post<RegisterResponse>(`${BASE_URL}/user/register/`, data);
        return response.data;
    },

    // User Profile Management
    async getUserDetails(userId: number): Promise<UserProfile> {
        const response = await axios.get<UserProfile>(`${BASE_URL}/user/${userId}/detail/`);
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

        const response = await axios.put<UserProfile>(`${BASE_URL}/user/${userId}/updateEditProfile/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async updateUserFavorites(userId: number, favoritesData: UserProfile): Promise<UserProfile> {
        const response = await axios.put<UserProfile>(`${BASE_URL}/user/${userId}/updateFavorites/`, favoritesData);
        return response.data;
    },

    async getUserProfileDetails(userId: number): Promise<UserProfile> {
        const response = await axios.get<UserProfile>(`${BASE_URL}/user/${userId}/detailEditProfile/`);
        return response.data;
    },

    async getUserFavorites(userId: number): Promise<UserProfile> {
        const response = await axios.get<UserProfile>(`${BASE_URL}/user/${userId}/detailFavorites/`);
        return response.data;
    },

    async getUserPaintings(userId: number): Promise<Painting[]> {
        const response = await axios.get<Painting[]>(`${BASE_URL}/painting/user/${userId}/paintings/`);
        return response.data;
    },

    async addPainting(userId: number, formData: FormData): Promise<Painting> {
        const response = await axios.post<Painting>(`${BASE_URL}/painting/user/${userId}/paintings/add/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Utility function to set up auth token
    setAuthToken(token: string): void {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        }
    },

    // Initialize auth state from localStorage
    initializeAuth(): void {
        const token = localStorage.getItem('token');
        if (token) {
            this.setAuthToken(token);
        }
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    },

    // Get current user ID
    getCurrentUserId(): number | null {
        const userId = localStorage.getItem('userId');
        return userId ? parseInt(userId) : null;
    }
};

// Initialize auth state when the service is loaded
userService.initializeAuth();

export default userService;
