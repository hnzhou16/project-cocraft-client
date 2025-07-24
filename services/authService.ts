import {apiCall} from '@/utils/apiUtils';
import {ApiResponse, LoginPayload, RegisterPayload, User, UserWithStats} from '@/types';

const authService = {
  register: async (userData: RegisterPayload): Promise<ApiResponse> => {
    return apiCall<ApiResponse>('POST', '/authentication/user', userData);
  },

  // Login user
  // directly call from loginAction - server component
  login: async (credentials: LoginPayload): Promise<string> => {
    return apiCall<string>('POST', '/authentication/token', credentials);
  },

  // Get current user
  getCurrentUser: async (): Promise<UserWithStats> => {
    return apiCall<UserWithStats>('GET', `/user/me`);
  },
};

export default authService;
