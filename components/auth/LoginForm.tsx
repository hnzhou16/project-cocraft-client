"use client"

import React, {useActionState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {loginAction} from "@/app/actions/loginAction";

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter();
  const {loading} = useAppSelector((state: any) => state.auth);
  const [state, formAction] = useActionState(loginAction, {error: '', success: false});

  // userEffect ensures the navigation happens after render completion
  useEffect(() => {
    if (state.success) {
      router.push('/')
    }
  }, [state.success, dispatch, router])

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{state.error}</span>
        </div>
      )}

      <form action={formAction}>
        <div className="mb-4">
          <label htmlFor="email" className="block bg-whilte text-sm font-bold mb-2">
            Email
          </label>
          <input
            name="email"
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-bold mb-2">
            Password
          </label>
          <input
            name="password"
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-500 hover:text-blue-700">
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
