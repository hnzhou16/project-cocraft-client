import {FollowStatus, User, UserWithStats} from "@/types";

// Mock implementation that reflects the latest API structure
const mockUserService = {
  // Get user by ID
  getUserById: async (userId: string): Promise<UserWithStats> => {
    return {
      user: {
        id: userId,
        username: `user${userId}`,
        email: `user${userId}@example.com`,
        role: 'contractor' as any,
        is_active: true,
        profile: {
          bio: `This is user ${userId}'s bio. A passionate professional in the construction industry.`,
          location: 'San Francisco, CA',
          contact: {
            email: `user${userId}@example.com`,
            phone: '+1-555-0123'
          }
        },
        rating: {
          total_rating: 4.5,
          rating_count: 12
        },
        created_at: new Date(Date.now() - Math.random() * 31536000000).toISOString(), // Random date within last year
        updated_at: new Date().toISOString()
      },
      post_count: Math.floor(Math.random() * 50 + 5),
      follower_count: Math.floor(Math.random() * 200 + 10),
      following_count: Math.floor(Math.random() * 150 + 5)
    };
  },

  // Get all users (admin only)
  getAllUsers: async (): Promise<User[]> => {
    return Array(10).fill(0).map((_, index) => ({
      id: (index + 1).toString(),
      username: `user${index + 1}`,
      email: `user${index + 1}@example.com`,
      role: ['contractor', 'designer', 'manufacturer', 'homeowner'][Math.floor(Math.random() * 4)] as any,
      is_active: Math.random() > 0.1, // 90% active
      profile: {
        bio: `User ${index + 1} bio`,
        location: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX'][Math.floor(Math.random() * 4)],
        contact: {
          email: `user${index + 1}@example.com`,
          phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
        }
      },
      rating: {
        total_rating: Math.round((Math.random() * 4 + 1) * 10) / 10, // 1.0 to 5.0
        rating_count: Math.floor(Math.random() * 20 + 1)
      },
      created_at: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
      updated_at: new Date().toISOString()
    }));
  },

  // Check follow status
  getFollowStatus: async (userId: string): Promise<boolean> => {
    // Mock returns random follow status
    return Math.random() > 0.5;
  },

  // Follow a user
  followUser: async (userId: string): Promise<boolean> => {
    console.log('Mock: Following user', userId);
    // Mock returns true (now following)
    return true;
  },

  // Unfollow a user
  unfollowUser: async (userId: string): Promise<boolean> => {
    console.log('Mock: Unfollowing user', userId);
    // Mock returns false (no longer following)
    return false;
  },
};

export default mockUserService;
