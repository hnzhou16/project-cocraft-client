"use client"

import React, {useActionState, useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {createPostAction} from "@/app/actions/createPostAction";
import ImageUploader from "@/components/image/imageUploader";

const CreatePostForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const {loading} = useAppSelector((state: any) => state.post);
  const [state, formAction] = useActionState(createPostAction, {error: '', success: false})

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (state.success) {
      router.push('/')
    }
  }, [state.success]);

  const handleUploadComplete = (urls: string[]) => {
    setImages((prev) => [...prev, ...urls]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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

        {/*<div className="mb-4">*/}
        {/*  <label htmlFor="imageUrl" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">*/}
        {/*    Add Image URL*/}
        {/*  </label>*/}
        {/*  <div className="flex">*/}
        {/*    <input*/}
        {/*      type="text"*/}
        {/*      name="imageUrl"*/}
        {/*      id="imageUrl"*/}
        {/*      className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"*/}
        {/*      placeholder="https://example.com/image.jpg"*/}
        {/*    />*/}
        {/*    <button*/}
        {/*      type="button"*/}
        {/*      onClick={handleAddImage}*/}
        {/*      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"*/}
        {/*    >*/}
        {/*      Add*/}
        {/*    </button>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {images.length > 0 && (
          <div className="mb-4">
            <p className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Uploaded Images ({images.length})
            </p>
            <div className="space-y-2">
              {images.map((img, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  <span className="text-gray-700 dark:text-gray-300 text-sm truncate flex-1">{img}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                  <input type="hidden" name="images[]" value={img}/>
                </div>
              ))}
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
