/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',  // Template files
    './app/**/*.css',                  // CSS files in app directory
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}', // MUST include the classname.ts file
  ],
  darkMode: 'class', // Uses class-based dark mode (triggered by adding dark class to HTML)
  theme: {
    extend: {
      spacing: {
        'sidebar': 'var(--sidebar-width)',
        'header': 'var(--header-height)',
      },
      maxWidth: {
        'full-layout': 'var(--full-width)',
      },
      colors: {
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'primary-background': 'var(--primary-background)',
        'primary-foreground': 'var(--primary-foreground)',
        'secondary-background': 'var(--secondary-background)',
        'secondary-foreground': 'var(--secondary-foreground)',
        'transparent-background': 'var(--transparent-background)',
        'card-background': 'var(--card-background)',
        'input-background': 'var(--input-background)',
        'input-border': 'var(--input-border)',
        'input-text': 'var(--input-text)',
      },
      borderColor: {
        DEFAULT: 'var(--border-color)',
      },
      boxShadow: {
        soft: '0 1px 3px 0 var(--shadow-color)',
        md: '0 4px 6px -1px var(--shadow-color), 0 2px 4px -2px var(--shadow-color)',
      },
    },
  },
  plugins: [],
};
