import { motion } from 'framer-motion';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-[#27272a] text-xs text-gray-400 dark:text-gray-500"
    >
      <span>
        &copy; {year}{' '}
        <span className="font-semibold text-gray-600 dark:text-gray-400">
          A-Steam Admin
        </span>
        . All rights reserved.
      </span>

      <div className="flex items-center gap-4">
        <a
          href="#"
          className="hover:text-primary-500 transition-colors"
        >
          Privacy
        </a>
        <a
          href="#"
          className="hover:text-primary-500 transition-colors"
        >
          Terms
        </a>
        <a
          href="#"
          className="hover:text-primary-500 transition-colors"
        >
          Support
        </a>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          All systems operational
        </span>
      </div>
    </motion.footer>
  );
};

export default Footer;
