/**
 * Utility functions for managing class names
 */

/**
 * Combines multiple class names, filtering out falsy values
 * @param classes - Array of class names or conditional class objects
 * @returns Combined class string
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Layout related class names
 */
export const layout = {
  main: 'bg-card-background rounded-lg shadow-md p-6 mb-6',
  container: 'container mx-auto px-4 py-6', // container sets the max-width oto match the min-width of the current breakpoint
};

/**
 * Typography related class names
 */
export const typography = {
  logo: "text-xl font-bold text-accent",
  h1: 'text-3xl font-bold text-primary-foreground mb-4',
  h2: 'text-2xl font-bold text-primary-foreground mb-3',
  h3: 'text-xl font-bold text-primary-foreground mb-2',
  h4: 'text-lg font-semibold text-primary-foreground mb-1',
  p1: 'text-primary text-primary-foreground mb-4',
  p2: 'text-sm text-secondary-foreground',
  p3: 'text-xs text-secondary-foreground',
  link: 'text-accent hover:text-accent-hover underline hover:cursor-pointer',
  error: 'text-sm text-red-500 italic',
};

/**
 * Form related class names
 */
export const form = {
  container: 'space-y-4',
  label: 'block text-sm font-medium text-primary mb-2',
  input: 'input w-full',
  error: 'input w-full border border-red-500',
  textarea: 'input w-full min-h-[50px]',
};

/**
 * Button related class names
 */
export const button = {
  base: 'btn',
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  filter: 'px-4 py-2 text-sm font-medium bg-background text-secondary-foreground border ' +
    'hover:bg-primary-background hover:text-primary-foreground hover:scale-110 transition-all duration-300',
  filterActive: 'px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-hover text-white transition-all duration-300',
  sort: 'px-4 py-2 text-sm font-medium bg-primary-background text-secondary-foreground border  rounded-md shadow-sm ' +
    'hover:bg-secondary-background hover:text-primary-foreground' +
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent',
  sortDropDown: 'text-primary-foreground block px-4 py-2 text-sm w-full text-left hover:bg-secondary-background',
  sortDropDownActive: 'bg-primary-background text-accent font-bold block block px-4 py-2 text-sm w-full text-left hover:bg-secondary-background',
  ghost: 'btn bg-transparent hover:bg-secondary-background text-accent',
  icon: 'p-2 rounded-full hover:bg-secondary-background',
};

/**
 * Navigation related class names
 */
export const nav = {
  link: 'p-2 rounded-md hover:bg-primary-background transition-colors',
  linkActive: 'p-2 rounded-md bg-primary-background text-accent font-bold',
  tag: 'bg-secondary-background hover:bg-secondary-background/80 text-accent px-3 py-1 rounded-full text-xs font-medium',
  icon: 'h-5 w-5',
};

/**
 * User interface element class names
 */
export const ui = {
  avatar: {
    // "rounded-full" need to pair with "aspect-square"
    base: 'rounded-full aspect-square flex items-center justify-center border-2 bg-secondary-background text-accent font-medium overflow-hidden hover:cursor-pointer',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-base',
    lg: 'h-20 w-20 text-3xl',
  },
  badge: 'inline-flex items-center rounded-full px-2.5 py-0.5 border border-accent text-accent text-xs font-medium',
  busy: 'animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4',
};


