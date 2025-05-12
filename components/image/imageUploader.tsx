'use client';

import React, {useState} from 'react';
import imageService from "@/services/imageService";
import {GenerateImagePayload} from "@/types";

interface Props {
  onUploadComplete: (urls: string[]) => void;
}

const ImageUploader: React.FC<Props> = ({onUploadComplete}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(selectedFiles);
      console.log(selectedFiles)
    }
  };

  const uploadImages = async () => {
    if (files.length === 0) return;
    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!extension || !['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
          alert(`Unsupported file: ${file.name}`);
          continue;
        }

        const payload: GenerateImagePayload = {extension};
        const response = await imageService.generateUploadURL(payload);
        const uploadURL = response.upload_url
        console.log(uploadURL)

        await imageService.uploadImage(uploadURL, file);

        // You should know the public S3 base URL or save s3Key for backend
        const imageUrl = uploadURL.split('?')[0];
        uploadedUrls.push(imageUrl);
      }

      onUploadComplete(uploadedUrls);
      setUploadStatus(`Uploaded ${uploadedUrls.length} file(s) successfully.`);
    } catch (err: any) {
      console.error(err);
      setUploadStatus('One or more uploads failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <input  className="ml-2 text-white px-3 py-1 rounded" type="file" multiple accept="image/*" onChange={handleFileChange}/>
      <button
        onClick={uploadImages}
        disabled={files.length === 0 || uploading}
        className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
      >
        {uploading ? 'Uploading...' : 'Upload Selected Images'}
      </button>
      {uploadStatus && <p className="text-sm mt-2">{uploadStatus}</p>}
    </div>
  );
};

export default ImageUploader;