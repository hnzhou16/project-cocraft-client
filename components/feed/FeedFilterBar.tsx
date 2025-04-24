"use client";

import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { fetchPublicFeed, fetchUserFeed } from '../../store/slices/postSlice';
import { Role } from '@/types';

interface FeedFilterBarProps {
  className?: string;
}

export default function FeedFilterBar({ className = '' }: FeedFilterBarProps) {
  const dispatch = useAppDispatch();
  const [feedFilter, setFeedFilter] = useState<'all' | 'followed' | 'mentioned'>('all');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  // Handle feed filter change
  const handleFeedFilterChange = (filter: 'all' | 'followed' | 'mentioned') => {
    setFeedFilter(filter);
    
    if (filter === 'all') {
      dispatch(fetchPublicFeed());
    } else if (filter === 'followed') {
      dispatch(fetchUserFeed({ following: true }));
    } else if (filter === 'mentioned') {
      dispatch(fetchUserFeed({ mentioned: true }));
    }
  };

  // Handle role filter change
  const handleRoleFilterChange = (role: string | null) => {
    setRoleFilter(role);
    if (role) {
      dispatch(fetchUserFeed({ roles: [role as Role] }));
    } else {
      dispatch(fetchPublicFeed());
    }
  };

  return (
    <div className={`bg-white border-b border-gray-200 p-4 sticky top-16 z-30 ${className}`}>
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Feed Type Filter */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => handleFeedFilterChange('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                feedFilter === 'all'
                  ? 'bg-[#008247] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => handleFeedFilterChange('followed')}
              className={`px-4 py-2 text-sm font-medium ${
                feedFilter === 'followed'
                  ? 'bg-[#008247] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Followed
            </button>
            <button
              type="button"
              onClick={() => handleFeedFilterChange('mentioned')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                feedFilter === 'mentioned'
                  ? 'bg-[#008247] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Mentioned
            </button>
          </div>
          
          {/* Role Filter */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => handleRoleFilterChange(null)}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                roleFilter === null
                  ? 'bg-[#008247] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Roles
            </button>
            <button
              type="button"
              onClick={() => handleRoleFilterChange('contractor')}
              className={`px-4 py-2 text-sm font-medium ${
                roleFilter === 'contractor'
                  ? 'bg-[#008247] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Contractor
            </button>
            <button
              type="button"
              onClick={() => handleRoleFilterChange('manufacturer')}
              className={`px-4 py-2 text-sm font-medium ${
                roleFilter === 'manufacturer'
                  ? 'bg-[#008247] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Manufacturer
            </button>
            <button
              type="button"
              onClick={() => handleRoleFilterChange('designer')}
              className={`px-4 py-2 text-sm font-medium ${
                roleFilter === 'designer'
                  ? 'bg-[#008247] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Designer
            </button>
            <button
              type="button"
              onClick={() => handleRoleFilterChange('homeowner')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                roleFilter === 'homeowner'
                  ? 'bg-[#008247] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              HomeOwner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
