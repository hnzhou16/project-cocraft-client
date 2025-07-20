"use server"

import {LoginPayload} from "@/types";
import {authService} from "@/services";
import {cookies} from "next/headers";

export async function loginAction(
  prevState: { error?: string; success?: boolean }, formData: FormData
): Promise<{ success: boolean } | { error: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return {error: 'Email and password are required.'};
  }

  const credentials: LoginPayload = {
    email,
    password,
  };

  try {
    // server-side authentication don't need redux dispatch anymore (which is for client-side state management)
    // cookies package can only use in server components
    const token = await authService.login(credentials)

    const cookieStore = await cookies();

    cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 3, // 3 day
    } as any);

    return {success: true};
  } catch (error) {
    console.log(error)
    return {error: `Invalid email or password.`};
  }
}