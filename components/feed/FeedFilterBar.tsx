"use client";

import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from "next/navigation";
import {
  CursorPaginationQuery,
  FeedFilterKey,
  INITIAL_FEED_FILTER_STATE,
  PUBLIC_ROLES,
  Role
} from "@/types";
import {fetchPublicFeed, fetchSearchFeed, fetchUserFeed} from "@/store/slices/postSlice";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {button} from "@/utils/classnames";

interface FeedFilterBarProps {
  feedType: "public" | "user" | "trending" | "search" | "userPosts";
  query?: string;
  className?: string;
}

export default function FeedFilterBar({feedType, query, className = ''}: FeedFilterBarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // useSearchParams is a static function, can not use it in useEffect, roles in useEffect won't change even if url changes
  const searchParams = useSearchParams();

  const {isAuthenticated} = useAppSelector(state => state.auth);
  const {limit, cursor} = useAppSelector(state => state.post);

  const [feedFilter, setFeedFilter] = useState(INITIAL_FEED_FILTER_STATE);
  const [rolesFilter, setRolesFilter] = useState<Role[]>([]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const hasParams = Array.from(searchParams.entries()).length > 0;

    // !!! clear query parameters if any ONLY for homepage
    // !!! otherwise it'll clear all searching results on the searching page
    if (hasParams && currentPath === '/') {
      // replace the current URL with no query string (no reload)
      router.replace(window.location.pathname);
    }
  }, [router, searchParams]);

  useEffect(() => {
    const payload: CursorPaginationQuery = {
      limit,
      cursor,
      sort: 'desc',
      following: feedFilter[FeedFilterKey.Following],
      mentioned: feedFilter[FeedFilterKey.Mentioned],
      ...(rolesFilter && rolesFilter.length > 0 ? {roles: rolesFilter} : {}), // avoid roles being 'undefined'
      ...(query ? {search: query} : {}),
    reset: true, // !!! reset the posts if filter changes
    };

    // !!! fetch feed here is NOT dependent on cursor, this is only for filter criteria changes
    switch (feedType) {
      case "public":
        dispatch(fetchPublicFeed(payload));
        break;
      case "user":
        dispatch(fetchUserFeed(payload));
        break;
      case "search":
        dispatch(fetchSearchFeed(payload));
        break;
    }
  }, [dispatch, searchParams, limit, cursor, isAuthenticated, feedFilter, rolesFilter, feedType, query]);

  const updateParams = (params: Record<string, string | null | undefined>) => {
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    });

    router.push(`?${current.toString()}`)
  }

  const handleFeedFilterToggle = (filter: FeedFilterKey) => {
    const updated = {...feedFilter, [filter]: !feedFilter[filter]};
    setFeedFilter(updated);

    updateParams({
      [FeedFilterKey.Mentioned]: updated[FeedFilterKey.Mentioned]? "true" : null,
      [FeedFilterKey.Following]: updated[FeedFilterKey.Following]? "true" : null,
    });
  };

  const handleRoleFilterToggle = (role: Role) => {
    let updatedRoles: Role[];
    if (rolesFilter.includes(role)) {
      // only remove the role toggled
      updatedRoles = rolesFilter.filter(r => r !== role)
    } else {
      updatedRoles = [...rolesFilter, role];
    }
    setRolesFilter(updatedRoles)
    updateParams({roles: updatedRoles.length ? updatedRoles.join(',') : undefined}) // 'undefined' removes the key while 'null' make the 'key=undefined'
  }

  const resetAllFilters = () => {
    setFeedFilter(INITIAL_FEED_FILTER_STATE);
    setRolesFilter([]);
    updateParams({[FeedFilterKey.Following]: null, [FeedFilterKey.Mentioned]: null, role: null});
  };

  return (
    <div className={`bg-background border-b p-4 sticky top-16 z-30 ${className}`}>
      <div className="container mx-auto">
        <div className= "flex flex-row items-center justify-between flex-wrap gap-4 overflow-hidden">
          {/* Feed Type Filter */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={resetAllFilters}
              className={`rounded-l-lg ${
                !feedFilter[FeedFilterKey.Following] && !feedFilter[FeedFilterKey.Mentioned] && rolesFilter.length === 0
                  ? button.filterActive : button.filter
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => handleFeedFilterToggle(FeedFilterKey.Following)}
              className={
                feedFilter[FeedFilterKey.Following]
                  ? button.filterActive : button.filter
              }
            >
              Following
            </button>
            <button
              type="button"
              onClick={() => handleFeedFilterToggle(FeedFilterKey.Mentioned)}
              className={`rounded-r-lg ${
                feedFilter[FeedFilterKey.Mentioned]
                  ? button.filterActive : button.filter
              }`}
            >
              Mentioned
            </button>
          </div>

          {/* Role Filter */}
          <div className="inline-flex flex-wrap rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => {
                setRolesFilter([]);
                updateParams({role: null});
              }}
              className={`rounded-l-lg ${
                rolesFilter.length === 0
                  ? button.filterActive : button.filter 
              }`
              }
            >
              All Roles
            </button>

            {PUBLIC_ROLES.map((role, i) => {
              const isSelected = rolesFilter.includes(role);
              const isLast = i === PUBLIC_ROLES.length - 1;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleFilterToggle(role)}
                  className={`${isLast ? 'rounded-r-lg' : ''} ${
                    isSelected
                      ? button.filterActive : button.filter
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
