import { apiCall } from '@/utils/apiUtils';
import {FollowStatus, User, UserWithStats} from '@/types';
import authService from "@/services/authService";

const userService = {
  // Get user by ID
  getUserById: async (userId: string): Promise<UserWithStats> => {
    return apiCall<UserWithStats>('GET', `/user/${userId}/profile`);
  },

  // Get all users (admin only)
  getAllUsers: async (): Promise<User[]> => {
    return apiCall<User[]>('GET', '/user/admin');
  },

  // Get following users
  getFollowing: async (userId: string): Promise<string[]> => {
    const response = await apiCall<{ following_ids: string[] }>('GET', `/user/${userId}/following`);
    return response.following_ids;
  },

  // Check follow status
  getFollowStatus: async (userId: string): Promise<boolean> => {
    const response = await apiCall<FollowStatus>('GET', `/user/${userId}/follow-status`);
    return response.isFollowing;
  },

  // Follow a user
  followUser: async (userId: string): Promise<boolean> => {
    const response = await apiCall<FollowStatus>('POST', `/user/${userId}/follow`);
    return response.isFollowing;
  },

  // Unfollow a user
  unfollowUser: async (userId: string): Promise<boolean> => {
    const response = await apiCall<FollowStatus>('DELETE', `/user/${userId}/follow`);
    return response.isFollowing;
  },

  // Generate upload URL for profile image
  generateUploadURL: async (userId: string): Promise<string> => {
    return apiCall<string>('POST', `/user/${userId}/upload-image`);
  },
};

export default userService;
