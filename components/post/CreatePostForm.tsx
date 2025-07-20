"use client"

import React, {useActionState, useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {useAppSelector} from '@/store/hooks';
import {createPostAction} from "@/app/actions/createPostAction";
import ImageUploader from "@/components/image/imageUploader";
import {UploadedImage} from "@/types";
import imageService from "@/services/imageService";
import {button, cn, form, typography} from "@/utils/classnames";
import Image from "next/image";

const CreatePostForm: React.FC = () => {
  const router = useRouter()
  const {loading} = useAppSelector(state => state.post);
  const [state, formAction] = useActionState(createPostAction, {error: '', success: false})

  const [images, setImages] = useState<UploadedImage[]>([]);

  useEffect(() => {
    if (state.success) {
      router.push('/')
    }
  }, [router, state.success]);

  const handleUploadComplete = (newImages: UploadedImage[]) => {
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = async (index: number) => {
    const imgToRemove = images[index];

    try {
      await imageService.deleteImage(imgToRemove);
      setImages(images.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  return (
    <div className="bg-primary-background rounded-lg shadow-md p-6 w-full mx-auto">
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{state.error}</span>
        </div>
      )}

      <form action={formAction}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className={form.input}
            placeholder="Enter post title"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-bold mb-2">
            Content
          </label>
          <textarea
            name="content"
            id="content"
            className={form.input}
            placeholder="Enter post content"
            rows={6}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-bold mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            className={form.input}
            placeholder="art, design, technology"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">
            Upload Images
          </label>
          <ImageUploader onUploadComplete={handleUploadComplete}/>
        </div>

        {images.length > 0 && (
          <div className="mb-4">
            <p className={cn(typography.p2, "font-bold mb-2")}>Uploaded Images ({images.length})</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, index) => {
                const imageUrl = `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${img.key}`;
                return (
                  <div key={index} className="relative">
                    <img src={imageUrl} alt={`Uploaded ${index}`} className="rounded shadow"/>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 text-white bg-accent rounded-full w-6 h-6 text-sm"

                    >
                      ×
                    </button>
                    <input type="hidden" name="images[]" value={img.key}/>
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
            className={cn(button.primary, `w-full ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`)}
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
