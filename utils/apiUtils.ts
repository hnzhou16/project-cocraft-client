import { apiRequest } from '../services/api';
import authService from '../services/authService';

/**
 * Utility function to handle API requests with authentication
 * @param method HTTP method
 * @param endpoint API endpoint
 * @param data Request data (optional)
 * @param params URL parameters (optional)
 * @returns Promise with the response data
 */
export async function apiCall<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  data?: any,
  params?: Record<string, string>
): Promise<T> {
  try {
    // Check if token exists
    const token = authService.getToken();
    
    // Prepare request config
    const config = {
      method,
      url: endpoint,
      data: data || undefined,
      params: params || undefined,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    };
    
    // Make the request
    return await apiRequest<T>(config);
  } catch (error: any) {
    // Handle token expiration
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      authService.removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    // Re-throw the error for the caller to handle
    throw error;
  }
}

/**
 * Helper function to decode JWT token
 * @param token JWT token
 * @returns Decoded token payload
 */
export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

/**
 * Helper function to check if token is expired
 * @param token JWT token
 * @returns Boolean indicating if token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    // exp is in seconds, Date.now() is in milliseconds
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}
