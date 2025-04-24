"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/hooks';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user } = useAppSelector((state: any) => state.auth);

  // Handle scroll event
  const handleScroll = useCallback(() => {
    if (window.scrollY > 10) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, []);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header - Fixed top navigation bar */}
      <header className={`bg-white shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-[#008247]">CoCraft</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#008247] focus:border-transparent"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    href={`/profile/${user?.id}`} 
                    className="flex items-center"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-[#008247]">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/login" 
                    className="text-gray-700 hover:text-[#008247]"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-[#008247] hover:bg-[#006d3d] text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Join Now
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#008247] focus:border-transparent"
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </form>
                <Link 
                  href="/" 
                  className={`${isActive('/') ? 'text-[#008247]' : 'text-gray-700'} hover:text-[#008247]`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/explore" 
                  className={`${isActive('/explore') ? 'text-[#008247]' : 'text-gray-700'} hover:text-[#008247]`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explore
                </Link>
                <Link 
                  href="/trending" 
                  className={`${isActive('/trending') ? 'text-[#008247]' : 'text-gray-700'} hover:text-[#008247]`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trending
                </Link>
                <Link 
                  href="/categories" 
                  className={`${isActive('/categories') ? 'text-[#008247]' : 'text-gray-700'} hover:text-[#008247]`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                {isAuthenticated && (
                  <>
                    <Link 
                      href="/feed" 
                      className={`${isActive('/feed') ? 'text-[#008247]' : 'text-gray-700'} hover:text-[#008247]`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Feed
                    </Link>
                    <Link 
                      href="/create" 
                      className="bg-[#008247] hover:bg-[#006d3d] text-white px-4 py-2 rounded-md text-sm font-medium w-full text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create Post
                    </Link>
                  </>
                )}
                {!isAuthenticated && (
                  <Link 
                    href="/register" 
                    className="bg-[#008247] hover:bg-[#006d3d] text-white px-4 py-2 rounded-md text-sm font-medium w-full text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join Now
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar for desktop - Fixed left sidebar */}
      <div className="hidden md:block fixed left-0 top-16 h-screen w-64 bg-white shadow-sm border-r border-gray-200 z-40 transition-all duration-300 overflow-y-auto">
        <div className="p-4">
          {/* User Profile Card */}
          {isAuthenticated ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-3">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-[#008247] text-xl font-bold mr-3">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="font-medium">{user?.username || 'User'}</h3>
                  <p className="text-sm text-gray-500">{user?.role || 'User'}</p>
                  <p className="text-xs text-gray-400">{user?.profile?.location || 'No location'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-center mb-3">Sign in to see your profile</p>
              <div className="flex space-x-2">
                <Link 
                  href="/login" 
                  className="flex-1 text-center py-2 text-[#008247] border border-[#008247] rounded-md text-sm"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="flex-1 text-center py-2 bg-[#008247] text-white rounded-md text-sm"
                >
                  Join
                </Link>
              </div>
            </div>
          )}
          
          {/* Stats Card */}
          {isAuthenticated && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between">
                <div className="text-center">
                  <p className="text-lg font-semibold">120</p>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">45</p>
                  <p className="text-xs text-gray-500">Posts</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <Link 
              href="/generate-image"
              className="w-full py-2 px-4 bg-[#008247] hover:bg-[#006d3d] text-white rounded-md flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Image Ideas
            </Link>
            <Link 
              href="/create"
              className="w-full py-2 px-4 bg-[#008247] hover:bg-[#006d3d] text-white rounded-md flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </Link>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1">
            <Link 
              href="/" 
              className={`p-2 rounded-md ${isActive('/') ? 'bg-gray-100 text-[#008247]' : 'text-gray-700 hover:text-[#008247] hover:bg-gray-50'}`}
            >
              <span>Home</span>
            </Link>
            <Link 
              href="/explore" 
              className={`p-2 rounded-md ${isActive('/explore') ? 'bg-gray-100 text-[#008247]' : 'text-gray-700 hover:text-[#008247] hover:bg-gray-50'}`}
            >
              <span>Explore</span>
            </Link>
            <Link 
              href="/trending" 
              className={`p-2 rounded-md ${isActive('/trending') ? 'bg-gray-100 text-[#008247]' : 'text-gray-700 hover:text-[#008247] hover:bg-gray-50'}`}
            >
              <span>Trending</span>
            </Link>
            <Link 
              href="/categories" 
              className={`p-2 rounded-md ${isActive('/categories') ? 'bg-gray-100 text-[#008247]' : 'text-gray-700 hover:text-[#008247] hover:bg-gray-50'}`}
            >
              <span>Categories</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  href="/feed" 
                  className={`p-2 rounded-md ${isActive('/feed') ? 'bg-gray-100 text-[#008247]' : 'text-gray-700 hover:text-[#008247] hover:bg-gray-50'}`}
                >
                  <span>My Feed</span>
                </Link>
                <Link 
                  href={`/profile/${user?.id}`} 
                  className={`p-2 rounded-md ${isActive(`/profile/${user?.id}`) ? 'bg-gray-100 text-[#008247]' : 'text-gray-700 hover:text-[#008247] hover:bg-gray-50'}`}
                >
                  <span>My Profile</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow pt-16 md:pl-64">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CoCraft</h3>
              <p className="text-gray-600">Connect with creators, share your work, and get inspired.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-600 hover:text-[#008247]">Home</Link></li>
                <li><Link href="/explore" className="text-gray-600 hover:text-[#008247]">Explore</Link></li>
                <li><Link href="/trending" className="text-gray-600 hover:text-[#008247]">Trending</Link></li>
                <li><Link href="/categories" className="text-gray-600 hover:text-[#008247]">Categories</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                {isAuthenticated ? (
                  <>
                    <li><Link href="/feed" className="text-gray-600 hover:text-[#008247]">My Feed</Link></li>
                    <li><Link href={`/profile/${user?.id}`} className="text-gray-600 hover:text-[#008247]">Profile</Link></li>
                    <li><Link href="/create" className="text-gray-600 hover:text-[#008247]">Create Post</Link></li>
                    <li><Link href="/logout" className="text-gray-600 hover:text-[#008247]">Logout</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link href="/login" className="text-gray-600 hover:text-[#008247]">Sign In</Link></li>
                    <li><Link href="/register" className="text-gray-600 hover:text-[#008247]">Join Now</Link></li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-600 hover:text-[#008247]">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-[#008247]">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="text-gray-600 hover:text-[#008247]">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} CoCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
