import { apiCall, uploadToS3 } from "@/utils/apiUtils";
import {GenerateImagePayload, GenerateImageResponse} from "@/types";

export const imageService = {
  // Get presigned URLs from backend
  generateUploadURL: async (payload: GenerateImagePayload): Promise<GenerateImageResponse> => {
    console.log('imageService')
    return apiCall<GenerateImageResponse>('POST', `/user/upload-image`, payload);
  },

  // Upload to presigned S3 URL
  uploadImage: async (uploadURL: string, file: File): Promise<void> => {
    return uploadToS3<void>(uploadURL, file);
  }
};

export default imageService;