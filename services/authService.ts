import { apiCall } from '../utils/apiUtils';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../types';

export const authService = {
  // Register a new user
  register: async (userData: RegisterPayload): Promise<AuthResponse> => {
    return apiCall<AuthResponse>('POST', '/authentication/user', userData);
  },

  // Login user
  login: async (credentials: LoginPayload): Promise<string> => {
    return apiCall<string>('POST', '/authentication/token', credentials);
  },

  // Activate user account
  activateAccount: async (token: string): Promise<void> => {
    return apiCall<void>('PUT', `/user/activate/${token}`);
  },

  // Get current user
  getCurrentUser: async (userId: string): Promise<User> => {
    return apiCall<User>('GET', `/user/${userId}`);
  },

  // Store token in localStorage
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  // Remove token from localStorage
  removeToken: (): void => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },

  // Logout user
  logout: (): void => {
    authService.removeToken();
  },
};

export default authService;
