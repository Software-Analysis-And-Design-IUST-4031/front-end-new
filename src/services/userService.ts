import api from './api';

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

const userService = {
    // Authentication
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/auth/login/', credentials);
        if (response.data.token) {
            this.setAuthToken(response.data.token);
            localStorage.setItem('username', response.data.user.username);
        }
        return response.data;
    },

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout/');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            delete api.defaults.headers.common['Authorization'];
        }
    },

    async register(data: RegistrationData): Promise<RegisterResponse> {
        const response = await api.post<RegisterResponse>('/auth/register/', data);
        return response.data;
    },

    // User Profile Management
    async getUserDetails(username: string): Promise<UserProfile> {
        const response = await api.get<UserProfile>(`/users/${username}/profile/`);
        return response.data;
    },

    async updateUserProfile(username: string, profileData: UserProfile): Promise<UserProfile> {
        let config: RequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

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

        const response = await api.put<UserProfile>(
            `/users/${username}/profile/`,
            formData,
            config
        );
        return response.data;
    },

    async updateUserFavorites(username: string, favoritesData: UserProfile): Promise<UserProfile> {
        const response = await api.put<UserProfile>(`/users/${username}/favorites/`, favoritesData);
        return response.data;
    },

    async getUserProfileDetails(username: string): Promise<UserProfile> {
        const response = await api.get<UserProfile>(`/users/${username}/profile/`);
        return response.data;
    },

    async getUserFavorites(username: string): Promise<UserProfile> {
        const response = await api.get<UserProfile>(`/users/${username}/favorites/`);
        return response.data;
    },

    async getUserPaintings(username: string): Promise<Painting[]> {
        const response = await api.get<Painting[]>(`/users/${username}/paintings/`);
        return response.data;
    },

    async addPainting(username: string, formData: FormData): Promise<Painting> {
        const response = await api.post<Painting>(
            `/users/${username}/paintings/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    // Utility function to set up auth token
    setAuthToken(token: string): void {
       if (token) {
         api.defaults.headers.common['Authorization'] = `Token ${token}`;
       } else {
         delete api.defaults.headers.common['Authorization'];
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

    // Get current username
    getCurrentUsername(): string | null {
        return localStorage.getItem('username');
    }
};

// Initialize auth state when the service is loaded
userService.initializeAuth();

export default userService;
