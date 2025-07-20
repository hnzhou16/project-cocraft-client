"use server"

import {CreatePostPayload} from "@/types";
import {postService} from "@/services";
import {cookies} from "next/headers";

export async function createPostAction(
  prevState: { error?: string; success?: boolean }, formData: FormData
): Promise<{ success: boolean, error: string }> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value;

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const tags = formData.get('tags') as string;
  const images = formData.getAll('images[]') as string[]; // use name attribute to retrie values

  const postData: CreatePostPayload = {
    title,
    content,
    tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    images: images,
  };

  try {
    await postService.createPost(postData, token)
    return {success: true, error: ''}
  } catch (error) {
    console.log(error)
    return {success: false, error: `Failed to create post.`}
  }
}
