export interface ApiResponse {
  data: string;
}

export interface UserWithStats {
  user: User;
  post_count: number;
  follower_count: number;
  following_count: number;
}

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  profile?: Profile;
  rating?: Rating;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  bio?: string;
  location?: string;
  contact?: Contact;
}

export interface Contact {
  email?: string;
  phone?: string;
}

export interface Rating {
  total_rating?: number;
  rating_count?: number;
}

export enum Role {
  Admin = "admin",
  Contractor = "contractor",
  Manufacturer = "manufacturer",
  Designer = "designer",
  HomeOwner = "homeowner"
}

export const PUBLIC_ROLES: Role[] = [
  Role.Contractor,
  Role.Manufacturer,
  Role.Designer,
  Role.HomeOwner,
]

// use FeedFilterKey enum directly for type safety
export enum FeedFilterKey {
  Mentioned = "mentioned",
  Following = "following",
}

export const INITIAL_FEED_FILTER_STATE: Record<FeedFilterKey, boolean> = {
  [FeedFilterKey.Mentioned]: false, // computed property syntax, needed when key is stored in var/const
  [FeedFilterKey.Following]: false,
}

// Pagination types
export interface PaginationQuery {
  limit?: number;
  offset?: number;
  sort?: "asc" | "desc";
  following?: boolean;
  mentioned?: boolean;
  roles?: Role[];
}

// Authentication types
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: Role;
  profile?: Profile;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Post types
export interface Post {
  id: string;
  user_id: string;
  username: string;
  user_role: Role;
  title: string;
  content: string;
  tags?: string[];
  mentions?: string[];
  images?: string[];
  like_count: number;
  likedByUser: boolean;
  comment_count: number;
  version: number;
  created_at?: string;
  updated_at?: string;
}

export interface PostWithLikeStatus {
  post: Post;
  username: string;
  liked_by_user: boolean;
}

export interface GenerateImagePayload {
  extension: string;
}

export interface GenerateImageResponse {
  upload_url: string;
  s3_key: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  tags?: string[];
  images_path?: string[];
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
  tags?: string[];
  images_path?: string[];
  version: number;
}

// Comment types
export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  parent_id?: string;
  content: string;
  created_at: string;
}

export interface CommentWithParentAndUser {
  id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
  parent_comment?: ParentComment;
}

export interface ParentComment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface CreateCommentPayload {
  parent_id?: string;
  content: string;
}

// Follow types
export interface FollowStatus {
  isFollowing: boolean;
}

// Review types
export interface Review {
  id: string;
  rated_user_id: string;
  rater_id: string;
  rater_username: string;
  score: number;
  comment: string;
  created_at: string;
}

export interface CreateReviewPayload {
  rated_user_id: string;
  score: number;
  comment: string;
}