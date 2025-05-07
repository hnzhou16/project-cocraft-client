import {apiCall} from '@/utils/apiUtils';
import {ApiResponse, LoginPayload, RegisterPayload, User, UserWithStats} from '@/types';

const authService = {
  // TODO: Register a new user
  register: async (userData: RegisterPayload): Promise<ApiResponse> => {
    return apiCall<ApiResponse>('POST', '/authentication/user', userData);
  },

  // Login user
  // directly call from loginAction - server component
  login: async (credentials: LoginPayload): Promise<string> => {
    return apiCall<string>('POST', '/authentication/token', credentials);
  },

  // TODO: Activate user account
  activateAccount: async (token: string): Promise<void> => {
    return apiCall<void>('PUT', `/user/activate/${token}`);
  },

  // Get current user
  getCurrentUser: async (): Promise<UserWithStats> => {
    return apiCall<UserWithStats>('GET', `/user/me`);
  },
};

export default authService;
