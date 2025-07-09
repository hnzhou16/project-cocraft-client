import {PUBLIC_ROLES, RegisterPayload, Role} from "@/types";
import {redirect} from "next/navigation";
import {authService} from "@/services";

export async function registerAction(
  prevState: { error?: string; success?: boolean }, formData: FormData
): Promise<{ success: boolean, error: string }> {
  const password = formData.get('password')?.toString();
  const confirmPassword = formData.get('confirmPassword')?.toString();

  if (password !== confirmPassword) {
    return {error: 'Passwords do not match', success: false};
  }

  const role = formData.get('role')?.toString() as Role;

  if (!PUBLIC_ROLES.includes(role)) {
    return { error: 'Invalid role selected', success: false };
  }

  const username = formData.get('username')?.toString();
  const email = formData.get('email')?.toString();
  const bio = formData.get('bio')?.toString() || '';
  const location = formData.get('location')?.toString() || '';

  const userData: RegisterPayload = {
    username,
    email,
    password,
    role,
    profile: {
      bio,
      location,
    },
  };

  try {
    await authService.register(userData);
    redirect('/')
  } catch (err) {
    return { error: err.message || 'Registration failed', success: false };
  }
}