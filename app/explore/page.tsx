"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllUsers } from '../../store/slices/userSlice';
import { User, Role } from '../../types';

export default function ExplorePage() {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state: any) => state.user);
  
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);
  
  // Filter and search users
  const filteredUsers = users?.filter((user: User) => {
    // Filter by role
    if (filter !== 'all' && user.role !== filter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !user.username.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }) || [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Filters</h2>
            
            <div className="mb-6">
              <label htmlFor="search" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Search by username"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Role
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="all"
                    name="role"
                    value="all"
                    checked={filter === 'all'}
                    onChange={() => setFilter('all')}
                    className="mr-2"
                  />
                  <label htmlFor="all" className="text-gray-700 dark:text-gray-300">
                    All
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="user"
                    name="role"
                    value={Role.User}
                    checked={filter === Role.User}
                    onChange={() => setFilter(Role.User)}
                    className="mr-2"
                  />
                  <label htmlFor="user" className="text-gray-700 dark:text-gray-300">
                    Users
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="creator"
                    name="role"
                    value={Role.Creator}
                    checked={filter === Role.Creator}
                    onChange={() => setFilter(Role.Creator)}
                    className="mr-2"
                  />
                  <label htmlFor="creator" className="text-gray-700 dark:text-gray-300">
                    Creators
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Discover Creators</h1>
            
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {!loading && !error && filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No users found matching your criteria.</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user: User) => (
                <Link key={user.id} href={`/profile/${user.id}`}>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                        {user.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{user.username}</h3>
                        <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                          {user.role}
                        </span>
                      </div>
                    </div>
                    
                    {user.profile?.bio && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">
                        {user.profile.bio}
                      </p>
                    )}
                    
                    {user.profile?.location && (
                      <p className="text-gray-500 dark:text-gray-500 text-xs">
                        <span className="inline-block mr-1">📍</span> {user.profile.location}
                      </p>
                    )}
                    
                    {user.rating && user.rating.rating_count && user.rating.rating_count > 0 && user.rating.total_rating && (
                      <div className="flex items-center mt-2 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-gray-700 dark:text-gray-300">
                          {(user.rating.total_rating / user.rating.rating_count).toFixed(1)} ({user.rating.rating_count})
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
