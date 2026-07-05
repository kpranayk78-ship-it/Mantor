const fs = require('fs');
const path = require('path');

const files = {
  'src/layouts/PublicLayout.jsx': `import { Outlet, Link } from 'react-router-dom';
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
}`,
  'src/layouts/AppLayout.jsx': `import { useState } from 'react';
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
      <aside className={\`fixed inset-y-0 left-0 z-40 bg-industrial-800 border-r border-industrial-700 flex flex-col transition-all duration-300 ease-in-out \${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} \${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64\`}>
        <div className="h-16 border-b border-industrial-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 rounded bg-ai-core flex-shrink-0 flex items-center justify-center text-white font-bold shadow-glow-blue">AI</div>
            <span className={\`text-lg font-semibold text-white transition-opacity duration-300 \${isSidebarCollapsed ? 'lg:opacity-0' : 'opacity-100'}\`}>Platform</span>
          </div>
          <button onClick={toggleMobile} className="lg:hidden text-industrial-400 hover:text-white"><FaTimes size={20} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2 overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link key={item.path} to={item.path} title={isSidebarCollapsed ? item.label : undefined} className={\`flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 \${isActive ? 'bg-industrial-700 text-white font-medium shadow-md border border-industrial-600' : 'text-industrial-400 hover:bg-industrial-700 hover:text-industrial-100 border border-transparent'}\`}>
                <item.icon size={20} className={\`flex-shrink-0 \${isActive ? 'text-ai-core' : ''}\`} />
                <span className={\`whitespace-nowrap transition-opacity duration-300 \${isSidebarCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}\`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-industrial-700">
          <Link to="/profile" title={isSidebarCollapsed ? 'Profile' : undefined} className="flex items-center gap-4 px-3 py-3 rounded-lg text-industrial-400 hover:bg-industrial-700 hover:text-industrial-100 transition-colors">
            <FaUser size={20} className="flex-shrink-0" /><span className={\`whitespace-nowrap transition-opacity duration-300 \${isSidebarCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}\`}>Profile</span>
          </Link>
        </div>
      </aside>
      <div className={\`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out lg:pl-0 \${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}\`}>
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
}`,
  'src/components/common/Breadcrumbs.jsx': `import { Link, useLocation } from 'react-router-dom';
export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  return (
    <nav className="flex text-sm text-industrial-400" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center"><Link to="/dashboard" className="hover:text-ai-core">Home</Link></li>
        {pathnames.map((name, index) => {
          const routeTo = \`/\${pathnames.slice(0, index + 1).join('/')}\`;
          const isLast = index === pathnames.length - 1;
          const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
          return (
            <li key={name}>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                {isLast ? <span className="text-industrial-100">{formattedName}</span> : <Link to={routeTo} className="hover:text-ai-core">{formattedName}</Link>}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`,
  'src/components/common/Button.jsx': `import React from 'react';
import { cn } from '../../utils/cn';
import Spinner from './Spinner';
const variantStyles = { primary: 'bg-ai-core text-white hover:bg-ai-glow border-transparent', secondary: 'bg-industrial-700 text-industrial-100 hover:bg-industrial-600 border-industrial-600', danger: 'bg-ai-danger text-white hover:bg-red-400', ghost: 'bg-transparent text-industrial-300 hover:text-white hover:bg-industrial-800' };
const sizeStyles = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-base', lg: 'px-6 py-3 text-lg' };
export default function Button({ children, className, variant = 'primary', size = 'md', isLoading = false, icon, disabled, ...props }) {
  return (
    <button className={cn('inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-300', variantStyles[variant], sizeStyles[size], (disabled || isLoading) && 'opacity-50 cursor-not-allowed hover:shadow-none', className)} disabled={disabled || isLoading} {...props}>
      {isLoading && <Spinner className="mr-2 h-4 w-4" />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}`,
  'src/components/common/Spinner.jsx': `import React from 'react';
import { cn } from '../../utils/cn';
export default function Spinner({ className, size = 'md', colorClass }) {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' };
  return (
    <svg className={cn('animate-spin', sizeClasses[size], colorClass || 'text-current', className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}`,
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join(__dirname, 'frontend', filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created:', filepath);
});
