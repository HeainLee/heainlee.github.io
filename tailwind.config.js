/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'blog-accent': '#0066cc',
        'blog-accent-dark': '#4da6ff',
        // Light theme colors
        'blog-bg-light': '#ffffff',
        'blog-surface-light': '#f8f9fa',
        'blog-text-light': '#333333',
        'blog-text-muted-light': '#6c757d',
        'blog-border-light': '#e9ecef',
        // Dark theme colors
        'blog-bg-dark': '#0d1117',
        'blog-surface-dark': '#161b22',
        'blog-text-dark': '#f0f6fc',
        'blog-text-muted-dark': '#8b949e',
        'blog-border-dark': '#30363d',
      },
      fontFamily: {
        'sans': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
