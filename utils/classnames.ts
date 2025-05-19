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
  container: 'container mx-auto px-4',
  section: 'py-6 md:py-8',
  card: 'card',
  cardHeader: 'p-4 border-b border-border-color',
  cardBody: 'p-4',
  cardFooter: 'p-4 border-t border-border-color',
};

/**
 * Typography related class names
 */
export const typography = {
  h1: 'text-3xl font-bold text-primary mb-4',
  h2: 'text-2xl font-bold text-primary mb-3',
  h3: 'text-xl font-bold text-primary mb-2',
  h4: 'text-lg font-semibold text-primary mb-2',
  p: 'text-primary mb-4',
  small: 'text-sm text-secondary-foreground',
  link: 'text-accent hover:text-accent-hover underline',
};

/**
 * Form related class names
 */
export const form = {
  container: 'space-y-4',
  group: 'space-y-2',
  label: 'block text-sm font-medium text-primary',
  input: 'input w-full',
  textarea: 'input w-full min-h-[100px]',
  select: 'input w-full appearance-none pr-8',
  checkbox: 'h-4 w-4 rounded border-input-border text-accent focus:ring-accent',
  radio: 'h-4 w-4 border-input-border text-accent focus:ring-accent',
  error: 'text-sm text-red-500 mt-1',
  hint: 'text-xs text-secondary-foreground mt-1',
};

/**
 * Button related class names
 */
export const button = {
  base: 'btn',
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  danger: 'btn bg-red-600 hover:bg-red-700 text-white',
  ghost: 'btn bg-transparent hover:bg-secondary-background text-primary',
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
 * Flex layout class names
 */
export const flex = {
  row: 'flex flex-row',
  col: 'flex flex-col',
  center: 'items-center justify-center',
  between: 'items-center justify-between',
  start: 'items-start',
  end: 'items-end',
  wrap: 'flex-wrap',
  gap1: 'gap-1',
  gap2: 'gap-2',
  gap3: 'gap-3',
  gap4: 'gap-4',
  gap6: 'gap-6',
  gap8: 'gap-8',
};

/**
 * Grid layout class names
 */
export const grid = {
  base: 'grid',
  cols1: 'grid-cols-1',
  cols2: 'grid-cols-1 md:grid-cols-2',
  cols3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  cols4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  gap2: 'gap-2',
  gap4: 'gap-4',
  gap6: 'gap-6',
  gap8: 'gap-8',
};

/**
 * Navigation related class names
 */
export const nav = {
  link: 'p-2 rounded-md hover:bg-secondary-background hover:text-accent transition-colors',
  linkActive: 'bg-secondary-background text-accent',
  icon: 'h-5 w-5',
};

/**
 * User interface element class names
 */
export const ui = {
  avatar: {
    base: 'rounded-full flex items-center justify-center overflow-hidden bg-secondary-background text-accent',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
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
