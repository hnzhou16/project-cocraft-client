"use client";

import {useState, useEffect, useCallback} from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {getCurrentUser} from "@/store/slices/authSlice";
import ThemeToggle from '../ui/ThemeToggle';
import { layout, nav, ui, button, typography, cn } from '@/utils/classnames';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({children}: MainLayoutProps) {
  const dispatch = useAppDispatch()
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {user, postCount, followerCount, followingCount, isAuthenticated, loading, error} = useAppSelector(state => state.auth);

  // Handle scroll event
  // useCallback memorizes the function — it returns the same function instance unless its dependencies change.
  // If deps is [], the function is only created once (on initial render).
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

  // Fetch user on MainLayout
  useEffect(() => {
      dispatch(getCurrentUser())
  }, [dispatch, isAuthenticated, pathname])

  useEffect(() => {
    // public pages where unauthenticated user have access
    const publicRoutes = ['/', '/login', '/register']; // add others if needed
    const isPublic = publicRoutes.includes(pathname);

    if (!loading && !isAuthenticated && error && !isPublic) {
      if (pathname !== '/') {
        router.push('/')
      }
    }
  }, [isAuthenticated, loading, error, router, pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery?.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/');
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header - Fixed top navigation bar */}
      <header
        className={cn(
          "bg-background border-b fixed top-0 left-0 right-0 z-50",
          scrolled ? 'shadow-md' : ''
        )}>
        <div className="container mx-auto px-4 max-w-full-layout">
          <div className="flex flex-row items-center justify-center h-header">
            {/* Logo */}
            <Link href="/" className="flex flex-row">
              <span className={typography.logo}>CoCraft</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input w-full rounded-full"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-secondary-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={nav.icon} fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    {/* currentColor is a CSS keyword, inherits color from parent element's text color*/}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </button>
              </div>
            </form>

            {/* Auth Buttons and Dark Mode Toggle */}
            <div className="flex flex-row items-center justify-between space-x-4">
              <ThemeToggle />
              
              {/* Desktop Auth Buttons */}
              {isAuthenticated ? (
                <div className="hidden md:flex flex-row items-center justify-between space-x-4">
                  <Link
                    href={`/profile/${user?.id}`}
                    className="flex flex-row"
                  >
                    <div className={cn(ui.avatar.base, ui.avatar.sm)}>
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </Link>
                  <Link
                    href="/logout"
                    className={typography.link}
                  >
                    Sign Out
                  </Link>
                </div>
              ) : (
                <div className="hidden md:flex flex-row items-center justify-between space-x-4">
                  <Link
                    href="/login"
                    className={typography.link}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className={button.primary}
                  >
                    Join Now
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className={cn(button.icon, "md:hidden")}
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4">
              <nav className="flex flex-col space-y-4">
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input w-full rounded-full"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-secondary-foreground"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={nav.icon} fill="none" viewBox="0 0 24 24"
                           stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </button>
                  </div>
                </form>

                <Link
                  href="/"
                  className={cn(isActive('/') ? nav.linkActive : nav.link)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>

                {isAuthenticated && (
                  <>
                    <Link
                      href={`/profile/${user?.id}`}
                      className={cn(isActive(`/profile/${user?.id}`) ? nav.linkActive : nav.link)}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/create"
                      className={cn(button.primary, "w-full")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create Post
                    </Link>
                    <Link
                      href="/logout"
                      className={cn(button.secondary, "w-full")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Out
                    </Link>
                  </>
                )}

                {!isAuthenticated && (
                  <>
                    <Link
                      href="/login"
                      className={cn(button.secondary, "w-full")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className={cn(button.primary, "w-full")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Join Now
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-full-layout mx-auto">
        {/* Sidebar for desktop - Fixed left sidebar */}
        <div
          className="hidden md:block fixed top-header h-screen w-sidebar bg-card-background border-r z-40 overflow-y-auto">
          <div className="p-4">
            {/* User Profile Card */}
            {isAuthenticated ? (
              <div className="card flex flex-row gap-2 p-2 mb-4">
                <div className={cn(ui.avatar.base, ui.avatar.md, "h-10 w-10 mr-3")}>
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className={cn(typography.h4, "mt-1 mb-1")}>{user?.username.split('_').join(' ') || 'User'}</p>
                  <p className={cn(ui.badge, "-ml-1 mb-1")}>{user?.role.charAt(0).toUpperCase()+ user?.role.slice(1) || 'User'}</p>
                  <p className={typography.p3}>{user?.profile?.location || ''}</p>
                </div>
              </div>
            ) : (
              <div className="card p-4 mb-4">
                <p className={cn(typography.p2, "text-center mb-4")}>Sign in to see your profile</p>
                <div className="flex flex-row space-x-2">
                  <Link
                    href="/login"
                    className={cn(button.secondary, "flex-1")}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className={cn(button.primary, "flex-1")}
                  >
                    Join
                  </Link>
                </div>
              </div>
            )}

            {/* Stats Card */}
            {isAuthenticated && (
              <div className="card text-center px-4 pt-2 mb-4">
                <div className="flex flex-row items-start justify-between">
                  <div>
                    <p className={typography.p3}>Followers</p>
                    <p className={typography.h4}>{followerCount}</p>
                  </div>
                  <div>
                    <p className={typography.p3}>Following</p>
                    <p className={typography.h4}>{followingCount}</p>
                  </div>
                  <div>
                    <p className={typography.p3}>Posts</p>
                    <p className={typography.h4}>{postCount}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <Link
                href="/generate-image"
                className={cn(button.primary, "w-full flex flex-row items-center justify-between")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={cn(nav.icon, "mr-2")} fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Image Ideas
              </Link>
              <Link
                href="/create"
                className={cn(button.primary, "w-full flex flex-row items-center justify-between")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={cn(nav.icon, "mr-2")} fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                New Post
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-1">
              <Link
                href="/"
                className={cn(isActive('/') ? nav.linkActive : nav.link)}
              >
                <span>Home</span>
              </Link>

              {isAuthenticated && (
                  <Link
                    href={`/profile/${user?.id}`}
                    className={cn(isActive(`/profile/${user?.id}`) ? nav.linkActive : nav.link)}
                  >
                    <span>My Profile</span>
                  </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-grow pt-16 md:pl-64">
          <div className={layout.container}>
            {children}
          </div>
        </main>

        {/* Footer */}
        <div className="ml-sidebar">
          <footer className="w-full bg-background border-t py-8 mx-4">
            <div className={layout.container}>
              <div>
                <p className={typography.logo}>CoCraft</p>
                <p className={cn(typography.p1, "text-secondary-foreground")}>Connect with creators, share your work,
                  and get inspired.</p>
              </div>

              <div className="flex flex-row items-start justify-between">
                <div>
                  <h3 className={typography.h3}>Navigation</h3>
                  <ul className="space-y-2">
                    <li><Link href="/" className={typography.link}>Home</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className={typography.h3}>Account</h3>
                  <ul className="space-y-2">
                    {isAuthenticated ? (
                      <>
                        <li><Link href={`/profile/${user?.id}`} className={typography.link}>Profile</Link></li>
                        <li><Link href="/create" className={typography.link}>Create Post</Link></li>
                        <li><Link href="/logout" className={typography.link}>Logout</Link></li>
                      </>
                    ) : (
                      <>
                        <li><Link href="/login" className={typography.link}>Sign In</Link></li>
                        <li><Link href="/register" className={typography.link}>Join Now</Link></li>
                      </>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className={typography.h3}>Legal</h3>
                  <ul className="space-y-2">
                    <li><p className={typography.link}>Terms of Service</p></li>
                    <li><p className={typography.link}>Privacy Policy</p></li>
                    <li><p className={typography.link}>Cookie Policy</p></li>
                  </ul>
                </div>
              </div>
              <div className="border-t mt-8 pt-8 text-center text-secondary-foreground">
                <p>&copy; {new Date().getFullYear()} CoCraft. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>

      </div>
    </div>
  );
}
