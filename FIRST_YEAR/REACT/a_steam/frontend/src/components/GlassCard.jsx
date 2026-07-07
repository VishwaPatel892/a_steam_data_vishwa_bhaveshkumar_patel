import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const GlassCard = ({ children, className, noPadding = false, hover = false, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        "glass-card rounded-2xl overflow-hidden relative group",
        !noPadding && "p-6",
        className
      )}
      {...props}
    >
      {/* Subtle top highlight for 3D effect in dark mode */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 dark:opacity-100" />
      {children}
    </motion.div>
  );
};

export default GlassCard;
