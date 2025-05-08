"use server"

import {CreatePostPayload} from "@/types";
import {postService} from "@/services";
import {cookies} from "next/headers";

export async function createPostAction(
  prevState: { error?: string; success?: boolean }, formData: FormData
): Promise<{ success: boolean } | { error: string }> {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value;

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const tags = formData.get('tags') as string;
  const images = formData.get('images') as string[];

  // TODO: image urls
  const imageUrl = formData.get('imageUrl') as string[];

  const postData: CreatePostPayload = {
    title,
    content,
    tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    images_path: images,
  };

  try {
    await postService.createPost(postData, token)
    return {success: true}
  } catch (error) {
    return {error: "Failed to create post."}
  }
}
