'use client';

import React, {useState} from 'react';
import imageService from "@/services/imageService";
import {GenerateImagePayload, UploadedImage} from "@/types";
import {button} from "@/utils/classnames";

interface Props {
  onUploadComplete: (uploadedImages: UploadedImage[]) => void;
}

const ImageUploader: React.FC<Props> = ({onUploadComplete}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadImages = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadedImages: UploadedImage[] = [];

    try {
      for (const file of files) {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!extension || !['jpg', 'jpeg', 'png', 'webp'].includes(extension)) { // TODO: set up ext type
          alert(`Unsupported file: ${file.name}`);
          continue;
        }

        const payload: GenerateImagePayload = {extension};
        const {upload_url, s3_key} = await imageService.generateUploadURL(payload);

        await imageService.uploadImage(upload_url, file);

        uploadedImages.push({key: s3_key});
      }

      onUploadComplete(uploadedImages);
      setUploadStatus(`Uploaded ${uploadedImages.length} file(s) successfully.`);
    } catch (err: any) {
      console.error(err);
      setUploadStatus('One or more uploads failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-row items-start justify-between w-full mb-4">
      <input className="file:w-1/2 file:mr-4 text-primary-foreground rounded" type="file" multiple accept="image/*" onChange={handleFileChange}/>
      <button
        onClick={uploadImages}
        disabled={files.length === 0 || uploading}
        className={button.primary}
      >
        {uploading ? 'Uploading...' : 'Upload Selected Images'}
      </button>
      {/*{uploadStatus && <p className="text-sm mt-2">{uploadStatus}</p>}*/}
    </div>
  );
};

export default ImageUploader;