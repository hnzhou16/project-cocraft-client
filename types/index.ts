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
  user: User;
  token: string;
}

// Post types
export interface Post {
  id: string;
  user_id: string;
  user_role: Role;
  title: string;
  content: string;
  tags?: string[];
  mentions?: string[];
  images?: string[];
  like_count: number;
  comment_count: number;
  version: number;
  created_at?: string;
  updated_at?: string;
}

export interface PostWithLikeStatus {
  post: Post;
  liked_by_user: boolean;
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

// Pagination types
export interface PaginationQuery {
  limit?: number;
  offset?: number;
  sort?: "asc" | "desc";
  following?: boolean;
  mentioned?: boolean;
  roles?: Role[];
}
