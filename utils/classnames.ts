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
  container: 'container mx-auto px-4',
  section: 'py-6 md:py-8',
  card: 'card',
  cardHeader: 'p-4 border-b',
  cardBody: 'p-4',
  cardFooter: 'p-4 border-t',
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
  group: 'space-y-2',
  label: 'block text-sm font-medium text-primary mb-2',
  input: 'input w-full',
  error: 'input w-full border border-red-500',
  textarea: 'input w-full min-h-[50px]',
  select: 'input w-full appearance-none pr-8',
  option: 'input w-full hover:hover:bg-secondary-background',
  checkbox: 'h-4 w-4 rounded border-input-border text-accent focus:ring-accent',
  radio: 'h-4 w-4 border-input-border text-accent focus:ring-accent',
  hint: 'text-xs text-secondary-foreground mt-1',
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
  danger: 'btn bg-red-600 hover:bg-red-700 text-white',
  ghost: 'btn bg-transparent hover:bg-secondary-background text-accent',
  link: 'btn bg-transparent p-0 h-auto text-accent hover:text-accent-hover underline',
  icon: 'p-2 rounded-full hover:bg-secondary-background',
  sizes: {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
    xl: 'text-lg px-6 py-3',
  },
};

/**
 * Navigation related class names
 */
export const nav = {
  link: 'p-2 rounded-md hover:bg-secondary-background hover:text-accent transition-colors',
  linkActive: 'p-2 rounded-md bg-secondary-background text-accent font-bold',
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
  badge: {
    base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    primary: 'bg-accent text-white',
    secondary: 'bg-secondary-background text-secondary-foreground',
    outline: 'bg-transparent border border-accent text-accent',
  },
  divider: 'border-t border-border-color my-4',
  tag: 'bg-secondary-background hover:bg-secondary-background/80 text-accent px-3 py-1 rounded-full text-xs font-medium',
};


