import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register } from '../../store/slices/authSlice';
import { RegisterPayload, Role } from '../../types';

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state: any) => state.auth);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.User);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    
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
      await dispatch(register(userData)).unwrap();
      router.push('/login');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Create an Account</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Choose a username"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Create a password"
            required
            minLength={8}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              passwordError ? 'border-red-500' : ''
            }`}
            placeholder="Confirm your password"
            required
          />
          {passwordError && (
            <p className="text-red-500 text-xs italic mt-1">{passwordError}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value={Role.User}>User</option>
            <option value={Role.Creator}>Creator</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="bio" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Bio (Optional)
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Tell us about yourself"
            rows={3}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="location" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Location (Optional)
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="City, Country"
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:text-blue-700">
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
