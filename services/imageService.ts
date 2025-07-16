import { apiCall, uploadToS3 } from "@/utils/apiUtils";
import {GenerateImagePayload, GenerateImageResponse, UploadedImage, GenerateAIImagePayload, GenerateAIImageResponse} from "@/types";

export const imageService = {
  // Get presigned URLs from backend
  generateUploadURL: async (payload: GenerateImagePayload): Promise<GenerateImageResponse> => {
    return apiCall<GenerateImageResponse>('POST', `/user/upload-image`, payload);
  },

  // Upload to presigned S3 URL
  uploadImage: async (uploadURL: string, file: File): Promise<void> => {
    return uploadToS3(uploadURL, file);
  },

  deleteImage: async (uploadedImage: UploadedImage): Promise<void> => {
    return apiCall<void>('DELETE', '/user/delete-image', uploadedImage)
  },

  // AI Image Generation
  generateAIImage: async (payload: GenerateAIImagePayload): Promise<GenerateAIImageResponse> => {
    return apiCall<GenerateAIImageResponse>('POST', '/ai/generate-image', payload);
  }
};

export default imageService;
