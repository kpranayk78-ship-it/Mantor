import { Outlet, Link } from 'react-router-dom';
export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-industrial-900 flex flex-col">
      <header className="px-6 py-4 border-b border-industrial-800 flex justify-between items-center bg-industrial-900/80 backdrop-blur-sm sticky top-0 z-50">
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded bg-ai-core flex items-center justify-center shadow-glow-blue">AI</span>
          <span className="hidden sm:inline">Platform</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/login" className="text-industrial-100 hover:text-ai-core font-medium transition-colors">Log In</Link>
          <Link to="/signup" className="btn-primary">Sign Up</Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col relative z-10"><Outlet /></main>
      <footer className="py-6 text-center text-industrial-500 text-sm border-t border-industrial-800 bg-industrial-900">
        &copy; {new Date().getFullYear()} AI Industrial Knowledge Platform. All rights reserved.
      </footer>
    </div>
  );
}