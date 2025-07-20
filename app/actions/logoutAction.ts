'use server';

import { cookies } from 'next/headers';

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'token',
    value: '',
    maxAge: 0,
    path: '/',});
}