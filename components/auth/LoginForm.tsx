"use client"

import React, {useActionState, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {loginAction} from "@/app/actions/loginAction";
import {button, cn, form, nav, typography} from "@/utils/classnames";

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
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
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              id="password"
              className={form.input}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute bottom-1/2 right-2 translate-y-1/2"
            >
              {showPassword
                ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                       stroke="currentColor" className={nav.icon}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
                </svg>
                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                       stroke="currentColor" className={nav.icon}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
              }
            </button>
          </div>

        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            type="submit"
            disabled={loading}
            className={cn(button.primary, `focus:outline-none focus:shadow-outline w-full ${
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
