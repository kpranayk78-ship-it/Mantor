/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: { 
          900: '#ffffff', // Primary background (White)
          800: '#f9fafb', // Secondary surfaces (Very light gray)
          700: '#e5e7eb', // Borders
          600: '#d1d5db', // Darker borders
          500: '#9ca3af', // Icons
          400: '#6b7280', // Muted text (Medium gray)
          300: '#4b5563', 
          200: '#374151', 
          100: '#1f2937', // Text (Dark gray)
          50:  '#111827'  // Headings text
        },
        ai: { 
          core: '#2563eb', // Single professional blue
          glow: '#2563eb', // Mapped to core to remove glow
          accent: '#2563eb', // Mapped to core to simplify
          warning: '#f59e0b',
          success: '#10b981',
          danger: '#ef4444',
          info: '#3b82f6'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'], 
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'] 
      },
      boxShadow: { 
        'glow-blue': 'none', 
        'glow-purple': 'none', 
        'panel': '0 1px 2px 0 rgba(0, 0, 0, 0.05)' // Very subtle shadow
      },
    },
  },
  plugins: [],
}