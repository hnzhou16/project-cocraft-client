import { apiCall, uploadToS3 } from "@/utils/apiUtils";
import {GenerateImagePayload, GenerateImageResponse, UploadedImage} from "@/types";

export const imageService = {
  // Get presigned URLs from backend
  generateUploadURL: async (payload: GenerateImagePayload): Promise<GenerateImageResponse> => {
    return apiCall<GenerateImageResponse>('POST', `/user/upload-image`, payload);
  },

  // Upload to presigned S3 URL
  uploadImage: async (uploadURL: string, file: File): Promise<void> => {
    return uploadToS3<void>(uploadURL, file);
  },

  deleteImage: async (uploadedImage: UploadedImage): Promise<void> => {
    return apiCall<void>('DELETE', '/user/delete-image', uploadedImage)
  }
};

export default imageService;