"use client"

import React, {useActionState, useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {createPostAction} from "@/app/actions/createPostAction";
import ImageUploader from "@/components/image/imageUploader";
import {UploadedImage} from "@/types";
import imageService from "@/services/imageService";

const CreatePostForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const {loading} = useAppSelector((state: any) => state.post);
  const [state, formAction] = useActionState(createPostAction, {error: '', success: false})

  const [images, setImages] = useState<UploadedImage[]>([]);

  useEffect(() => {
    if (state.success) {
      router.push('/')
    }
  }, [state.success]);

  const handleUploadComplete = (newImages: UploadedImage[]) => {
    console.log("newImages", newImages)
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = async (index: number) => {
    const imgToRemove = images[index];
    console.log('imgToRemove: ', imgToRemove)

    try {
      await imageService.deleteImage(imgToRemove);
      setImages(images.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create a New Post</h2>

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{state.error}</span>
        </div>
      )}

      <form action={formAction}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter post title"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Content
          </label>
          <textarea
            name="content"
            id="content"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter post content"
            rows={6}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="tags" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="art, design, technology"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Upload Images
          </label>
          <ImageUploader onUploadComplete={handleUploadComplete}/>
        </div>

        {images.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Uploaded Images ({images.length})</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, index) => {
                const imageUrl = `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${img.key}`;
                return (
                  <div key={index} className="relative">
                    <img src={imageUrl} alt={`Uploaded ${index}`} className="rounded shadow" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 text-white bg-red-600 rounded-full w-6 h-6 text-sm"
                    >
                      ×
                    </button>
                    <input type="hidden" name="images[]" value={img.key} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
