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

// only for uploading images to s3
export const uploadToS3 = async (url: string, file: File): Promise<void> => {
  const response = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`S3 upload failed with status ${response.status}`);
  }
};

// only for deleting image on s3
export const deleteImageOnS3 = async (imageUrl: string) => {
  const objectKey = imageUrl.split('.com/')[1];
  try {
    await fetch('/api/user/delete-image', {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: objectKey}),
    });
    // update UI here (e.g. remove from state)
  } catch (error) {
    console.error("Failed to delete image:", error);
  }
}