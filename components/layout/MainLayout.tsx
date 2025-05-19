"use client";

import {useState, useEffect, useCallback} from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {getCurrentUser} from "@/store/slices/authSlice";
import ThemeToggle from '../ui/ThemeToggle';
import { layout, flex, grid, nav, ui, button, typography, cn } from '@/utils/classnames';

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
  const {user, postCount, followerCount, followingCount, isAuthenticated, loading, error} = useAppSelector((state: any) => state.auth);

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

  // Fetch user on MainLayout
  useEffect(() => {
    dispatch(getCurrentUser())
  }, [isAuthenticated, pathname])

  // TODO: rethink how to checkAuth
  useEffect(() => {
    // public pages where unauthenticated user have access
    const publicRoutes = ['/', '/login', '/signup']; // add others if needed
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
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
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
          "bg-white border-b border-border-color fixed top-0 left-0 right-0 z-50",
          scrolled ? 'shadow-md' : ''
        )}>
        <div className={cn(layout.container, "max-w-6xl")}>
          <div className={cn(flex.row, flex.between, "h-16")}>
            {/* Logo */}
            <Link href="/" className={flex.row}>
              <span className="text-xl font-bold text-accent">CoCraft</span>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </button>
              </div>
            </form>

            {/* Auth Buttons and Dark Mode Toggle */}
            <div className={cn(flex.row, flex.center, "space-x-4")}>
              <ThemeToggle />
              
              {isAuthenticated ? (
                <div className={cn(flex.row, flex.center, "space-x-4")}>
                  <Link
                    href={`/profile/${user?.id}`}
                    className={flex.row}
                  >
                    <div className={ui.avatar.md}>
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
                <div className={cn(flex.row, flex.center, "space-x-4")}>
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

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border-color">
              <nav className={cn(flex.col, "space-y-4")}>
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
                <Link
                  href="/explore"
                  className={cn(isActive('/explore') ? nav.linkActive : nav.link)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explore
                </Link>
                <Link
                  href="/trending"
                  className={cn(isActive('/trending') ? nav.linkActive : nav.link)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trending
                </Link>
                <Link
                  href="/categories"
                  className={cn(isActive('/categories') ? nav.linkActive : nav.link)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      href="/feed"
                      className={cn(isActive('/feed') ? nav.linkActive : nav.link)}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Feed
                    </Link>
                    <Link
                      href="/create"
                      className={cn(button.primary, "w-full text-center")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create Post
                    </Link>
                  </>
                )}
                {!isAuthenticated && (
                  <Link
                    href="/register"
                    className={cn(button.primary, "w-full text-center")}
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
    <div className="max-w-6xl mx-auto">
      {/* Sidebar for desktop - Fixed left sidebar */}
      <div
        className="hidden md:block fixed top-16 h-screen w-64 bg-card-background border-r border-border-color z-40 overflow-y-auto">
        <div className="p-4">
          {/* User Profile Card */}
          {isAuthenticated ? (
            <div className={layout.card + " mb-4"}>
              <div className={cn(flex.row, "mb-3")}>
                <div className={cn(ui.avatar.lg, "mr-3")}>
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="font-medium">{user?.username.split('_').join(' ') || 'User'}</h3>
                  <p className="text-sm text-secondary-foreground">{user?.role || 'User'}</p>
                  <p className="text-xs text-secondary-foreground/70">{user?.profile?.location || 'No location'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={layout.card + " mb-4"}>
              <p className="text-center mb-3">Sign in to see your profile</p>
              <div className={cn(flex.row, "space-x-2")}>
                <Link
                  href="/login"
                  className={cn(button.secondary, "flex-1 text-center")}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={cn(button.primary, "flex-1 text-center")}
                >
                  Join
                </Link>
              </div>
            </div>
          )}

          {/* Stats Card */}
          {isAuthenticated && (
            <div className={layout.card + " mb-4"}>
              <div className={cn(flex.row, flex.between)}>
                <div className="text-center">
                  <p className="text-xs text-secondary-foreground">Followers</p>
                  <p className="text-lg font-semibold">{followerCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-secondary-foreground">Following</p>
                  <p className="text-lg font-semibold">{followingCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-secondary-foreground">Posts</p>
                  <p className="text-lg font-semibold">{postCount}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <Link
              href="/generate-image"
              className={cn(button.primary, "w-full", flex.row, flex.center)}
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
              className={cn(button.primary, "w-full", flex.row, flex.center)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={cn(nav.icon, "mr-2")} fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              New Post
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className={flex.col + " space-y-1"}>
            <Link
              href="/"
              className={cn(isActive('/') ? nav.linkActive : nav.link)}
            >
              <span>Home</span>
            </Link>
            <Link
              href="/explore"
              className={cn(isActive('/explore') ? nav.linkActive : nav.link)}
            >
              <span>Explore</span>
            </Link>
            <Link
              href="/trending"
              className={cn(isActive('/trending') ? nav.linkActive : nav.link)}
            >
              <span>Trending</span>
            </Link>
            <Link
              href="/categories"
              className={cn(isActive('/categories') ? nav.linkActive : nav.link)}
            >
              <span>Categories</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/feed"
                  className={cn(isActive('/feed') ? nav.linkActive : nav.link)}
                >
                  <span>My Feed</span>
                </Link>
                <Link
                  href={`/profile/${user?.id}`}
                  className={cn(isActive(`/profile/${user?.id}`) ? nav.linkActive : nav.link)}
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
        <div className={layout.container + " py-6"}>
          {children}
        </div>
      </main>
    </div>
      {/* Footer */}
      <footer className="bg-card-background border-t border-border-color py-8">
        <div className={layout.container}>
          <div className={grid.cols4 + " gap-8"}>
            <div>
              <h3 className={typography.h3}>CoCraft</h3>
              <p className="text-secondary-foreground">Connect with creators, share your work, and get inspired.</p>
            </div>
            <div>
              <h3 className={typography.h3}>Navigation</h3>
              <ul className="space-y-2">
                <li><Link href="/" className={typography.link}>Home</Link></li>
                <li><Link href="/explore" className={typography.link}>Explore</Link></li>
                <li><Link href="/trending" className={typography.link}>Trending</Link></li>
                <li><Link href="/categories" className={typography.link}>Categories</Link></li>
              </ul>
            </div>
            <div>
              <h3 className={typography.h3}>Account</h3>
              <ul className="space-y-2">
                {isAuthenticated ? (
                  <>
                    <li><Link href="/feed" className={typography.link}>My Feed</Link></li>
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
                <li><Link href="/terms" className={typography.link}>Terms of Service</Link></li>
                <li><Link href="/privacy" className={typography.link}>Privacy Policy</Link></li>
                <li><Link href="/cookies" className={typography.link}>Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border-color mt-8 pt-8 text-center text-secondary-foreground">
            <p>&copy; {new Date().getFullYear()} CoCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
