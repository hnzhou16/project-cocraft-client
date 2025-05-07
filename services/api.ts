// Default API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Generic API request method
export const apiRequest = async <T>(
  config: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    params?: Record<string, string>,
  }
): Promise<T> => {

  const { method, url, data, params } = config;
  const query = params
    ? '?' + new URLSearchParams(params).toString()
    : '';
  const fullUrl = `${API_URL}${url}${query}`;

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  // not need to wrap inside 'try', it's handled on apiUtils
  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  if (response.status !== 204) {
    const result = await response.json();
    return result.data as T;
  }

  return undefined as T;
};

export default apiRequest;
