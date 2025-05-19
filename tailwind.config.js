/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',  // Template files
    './app/**/*.css',                  // CSS files in app directory
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Uses class-based dark mode (triggered by adding dark class to HTML)
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'rgb(0, 130, 75)',
          hover: 'rgb(0, 109, 61)',
          dark: 'rgb(20, 160, 95)',
          'dark-hover': 'rgb(30, 180, 110)',
        },
        'background': 'var(--background)', // TODO: this is a static file, tailwind can not read raw colors
        'foreground': 'var(--foreground)',
        'primary': 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        'secondary-background': 'var(--secondary-background)',
        'secondary-foreground': 'var(--secondary-foreground)',
        'card-background': 'var(--card-background)',
        'border-color': 'var(--border-color)',
        'input-border': 'var(--input-border)',
      },
      borderColor: {
        DEFAULT: 'var(--border-color)',
      },
      backgroundColor: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary-background)',
      },
      textColor: {
        primary: 'var(--foreground)',
        secondary: 'var(--secondary-foreground)',
      },
    },
  },
  plugins: [],
};
