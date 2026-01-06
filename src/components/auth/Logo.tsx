import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-lg' },
    md: { container: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-xl' },
    lg: { container: 'w-14 h-14', icon: 'w-7 h-7', text: 'text-2xl' },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <motion.div
        className={`${s.container} rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25`}
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* Abstract flow icon */}
        <svg
          className={`${s.icon} text-primary-foreground`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Stylized F with flow lines */}
          <path d="M6 4h12" />
          <path d="M6 4v16" />
          <path d="M6 12h8" />
          <motion.path
            d="M16 8c2 2 2 6 0 8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`${s.text} font-bold tracking-tight text-foreground`}>
            Focus<span className="text-primary">Flow</span>
          </span>
          {size === 'lg' && (
            <span className="text-xs text-muted-foreground font-medium tracking-wide">
              Build better habits
            </span>
          )}
        </div>
      )}
    </div>
  );
}
