"use client";

import { useState, useEffect } from 'react';
import { flex, cn, button } from '../../utils/classnames';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
    } else {
      const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(darkModePreference);
    }
  }, []);

  // Update document class and localStorage when dark mode changes
  useEffect(() => {
    if (!mounted) return;
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark'); // add 'dark' to root <html>
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode, mounted]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Prevent flash of wrong theme while loading
  if (!mounted) {
    return null;
  }

  return (
    <div className={cn(flex.row, flex.center, className)}>
      {showLabel && (
        <span className="mr-2 text-primary">
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
      <button 
        onClick={toggleDarkMode}
        className={cn(
          button.icon,
          'text-primary dark:text-secondary-foreground',
          className
        )}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    </div>
  );
}
