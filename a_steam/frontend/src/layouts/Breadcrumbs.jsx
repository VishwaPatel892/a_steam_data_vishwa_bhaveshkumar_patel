import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const routeLabels = {
  '': 'Dashboard',
  'users': 'Users',
  'analytics': 'Analytics',
  'profile': 'Profile',
  'settings': 'Settings',
  'games': 'Games',
  'reviews': 'Reviews',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  const crumbs = [
    { label: 'Dashboard', path: '/' },
    ...pathnames.map((segment, index) => ({
      label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      path: '/' + pathnames.slice(0, index + 1).join('/'),
    })),
  ];

  // Don't show breadcrumbs on dashboard root
  if (pathnames.length === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm mb-6"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <div key={crumb.path} className="flex items-center gap-1.5">
            {index === 0 && (
              <Home className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            )}
            {isLast ? (
              <span className="font-medium text-gray-900 dark:text-white">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
            {!isLast && (
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
            )}
          </div>
        );
      })}
    </motion.nav>
  );
};

export default Breadcrumbs;
