import { apiRequest } from '@/services';

/**
 * Utility function to handle API requests with authentication
 * @param method HTTP method
 * @param endpoint API endpoint
 * @param data Request data (optional)
 * @param token
 * @param params URL parameters (optional)
 * @returns Promise with the response data
 */
export async function apiCall<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  data?: any,
  params?: Record<string, string>,
  token?: string,
): Promise<T> {
  try {
    // Prepare request config
    const config = {
      method,
      url: endpoint,
      data: data || undefined,
      params: params || undefined,
      token: token || undefined,
      withCredentials: true,
    };

    return await apiRequest<T>(config);
  } catch (error: any) {
    throw error;
  }
}