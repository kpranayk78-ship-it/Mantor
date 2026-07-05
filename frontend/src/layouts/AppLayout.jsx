import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaSearch, FaComments, FaBook, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import Breadcrumbs from '../components/common/Breadcrumbs';

export default function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaChartBar },
    { path: '/search', label: 'Search', icon: FaSearch },
    { path: '/chat', label: 'AI Chat', icon: FaComments },
    { path: '/knowledge', label: 'Knowledge Base', icon: FaBook },
  ];
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <div className="min-h-screen bg-industrial-900 flex overflow-hidden">
      {isMobileOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity" onClick={toggleMobile} />}
      <aside className={`fixed inset-y-0 left-0 z-40 bg-industrial-800 border-r border-industrial-700 flex flex-col transition-all duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}>
        <div className="h-16 border-b border-industrial-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 rounded bg-ai-core flex-shrink-0 flex items-center justify-center text-white font-bold shadow-glow-blue">AI</div>
            <span className={`text-lg font-semibold text-white transition-opacity duration-300 ${isSidebarCollapsed ? 'lg:opacity-0' : 'opacity-100'}`}>Platform</span>
          </div>
          <button onClick={toggleMobile} className="lg:hidden text-industrial-400 hover:text-white"><FaTimes size={20} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2 overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link key={item.path} to={item.path} title={isSidebarCollapsed ? item.label : undefined} className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-industrial-700 text-white font-medium shadow-md border border-industrial-600' : 'text-industrial-400 hover:bg-industrial-700 hover:text-industrial-100 border border-transparent'}`}>
                <item.icon size={20} className={`flex-shrink-0 ${isActive ? 'text-ai-core' : ''}`} />
                <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-industrial-700">
          <Link to="/profile" title={isSidebarCollapsed ? 'Profile' : undefined} className="flex items-center gap-4 px-3 py-3 rounded-lg text-industrial-400 hover:bg-industrial-700 hover:text-industrial-100 transition-colors">
            <FaUser size={20} className="flex-shrink-0" /><span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>Profile</span>
          </Link>
        </div>
      </aside>
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out lg:pl-0 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <header className="h-16 border-b border-industrial-700 bg-industrial-800/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={toggleMobile} className="lg:hidden text-industrial-400 hover:text-white p-2 rounded-md hover:bg-industrial-700 transition-colors"><FaBars size={20} /></button>
            <button onClick={toggleSidebar} className="hidden lg:block text-industrial-400 hover:text-white p-2 rounded-md hover:bg-industrial-700 transition-colors"><FaBars size={20} /></button>
            <div className="hidden sm:block pl-2"><Breadcrumbs /></div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-industrial-900 scroll-smooth relative flex flex-col">
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="sm:hidden mb-4"><Breadcrumbs /></div>
            <Outlet />
          </div>
          <footer className="mt-auto py-6 px-4 sm:px-6 border-t border-industrial-800 bg-industrial-800/30 text-center text-sm text-industrial-500 flex flex-col sm:flex-row justify-between items-center">
            <span>&copy; {new Date().getFullYear()} AI Industrial Knowledge Platform.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}