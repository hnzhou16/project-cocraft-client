"use client";

import { useTheme } from '../../providers/ThemeProvider';
import DarkModeToggle from './DarkModeToggle';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`flex items-center ${className}`}>
      {showLabel && (
        <span className="mr-2 text-gray-700 dark:text-gray-300">
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
      <DarkModeToggle />
    </div>
  );
}
