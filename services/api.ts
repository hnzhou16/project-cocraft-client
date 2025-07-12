// Default API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Generic API request method
export const apiRequest = async <T>(
  config: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    params?: Record<string, string>,
    token?: string,
  }
): Promise<T> => {

  const {method, url, data, params, token} = config;
  const query = params
    ? '?' + new URLSearchParams(params).toString()
    : '';
  const fullUrl = `${API_URL}${url}${query}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Cookie'] = `token=${token}`; // Only attach manually for server component actions
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  // not need to wrap inside 'try', it's handled on apiUtils
  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    const error = new Error(errorData.error.message || `Request failed with status ${response.status}`);
    (error as any).code = errorData.error.code; // attach server error code
    throw error;
  }

  if (response.status !== 204) {
    const result = await response.json();
    return result.data as T;
  }

  return undefined as T;
};

export default apiRequest;
