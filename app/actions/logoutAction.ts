'use server';

import { cookies } from 'next/headers';

export async function logoutAction() {
  cookies().set('token', '', { maxAge: 0 });
}