import { Link, useLocation } from 'react-router-dom';
export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  return (
    <nav className="flex text-sm text-industrial-400" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center"><Link to="/dashboard" className="hover:text-ai-core">Home</Link></li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
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
}