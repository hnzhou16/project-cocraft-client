"use client"

import React, {useActionState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {loginAction} from "@/app/actions/loginAction";
import {button, cn, form, typography} from "@/utils/classnames";

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter();
  const {loading} = useAppSelector(state => state.auth);
  const [state, formAction] = useActionState(loginAction, {error: '', success: false});

  // userEffect ensures the navigation happens after render completion
  useEffect(() => {
    if (state.success) {
      router.push('/')
    }
  }, [state.success, dispatch, router])

  return (
    <div className="bg-primary-background rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{state.error}</span>
        </div>
      )}

      <form action={formAction} className={form.container}>
        <div>
          <label htmlFor="email" className={form.label}>
            Email
          </label>
          <input
            name="email"
            type="email"
            id="email"
            className={form.input}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className={form.label}>
            Password
          </label>
          <input
            name="password"
            type="password"
            id="password"
            className={form.input}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            type="submit"
            disabled={loading}
            className={cn(button.primary,`focus:outline-none focus:shadow-outline w-full ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`)}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className="text-center">
          <p className={typography.p2}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className={typography.link}>
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
