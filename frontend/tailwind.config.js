/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: { 900: '#0a0f1c', 800: '#111827', 700: '#1f2937', 600: '#374151', 500: '#4b5563', 400: '#9ca3af', 300: '#d1d5db', 200: '#e5e7eb', 100: '#f3f4f6', 50: '#f9fafb' },
        ai: { core: '#0ea5e9', glow: '#38bdf8', accent: '#8b5cf6', warning: '#f59e0b', success: '#10b981', danger: '#ef4444' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], mono: ['Fira Code', 'Roboto Mono', 'monospace'] },
      boxShadow: { 'glow-blue': '0 0 20px rgba(14, 165, 233, 0.4)', 'glow-purple': '0 0 20px rgba(139, 92, 246, 0.4)', 'panel': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' },
    },
  },
  plugins: [],
}