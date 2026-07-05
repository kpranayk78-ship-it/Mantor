const fs = require('fs');
const path = require('path');

const files = {
  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
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
}`,
  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: smooth; }
  body { @apply bg-industrial-900 text-industrial-100 font-sans antialiased; }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { @apply bg-industrial-900; }
  ::-webkit-scrollbar-thumb { @apply bg-industrial-600 rounded-full; }
  ::-webkit-scrollbar-thumb:hover { @apply bg-ai-core; }
}

@layer components {
  .btn-primary { @apply px-4 py-2 bg-ai-core text-white font-medium rounded-lg shadow-md hover:bg-ai-glow hover:shadow-glow-blue transition-all duration-300; }
  .btn-secondary { @apply px-4 py-2 bg-industrial-700 text-industrial-100 font-medium rounded-lg shadow-md hover:bg-industrial-600 border border-industrial-600 transition-all duration-300; }
  .panel { @apply bg-industrial-800 border border-industrial-700 rounded-xl shadow-panel p-6; }
  .glass-panel { @apply bg-industrial-800/60 backdrop-blur-md border border-industrial-700/50 rounded-xl shadow-panel p-6; }
  .input-field { @apply w-full bg-industrial-900 border border-industrial-600 rounded-lg px-4 py-2 text-industrial-100 focus:outline-none focus:ring-2 focus:ring-ai-core focus:border-transparent transition-all; }
  .heading-1 { @apply text-4xl md:text-5xl font-bold tracking-tight text-white; }
  .heading-2 { @apply text-2xl md:text-3xl font-semibold text-industrial-50; }
}

@layer utilities {
  .text-glow { text-shadow: 0 0 10px rgba(14, 165, 233, 0.5); }
}`,
  'src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
  'src/App.jsx': `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import { ToastProvider } from './context/ToastContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Chat from './pages/Chat';
import Knowledge from './pages/Knowledge';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
export default App;`,
  'src/utils/cn.js': `import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) { return twMerge(clsx(inputs)); }`,
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join(__dirname, 'frontend', filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created:', filepath);
});
