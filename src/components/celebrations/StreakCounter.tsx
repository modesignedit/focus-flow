import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  streak: number;
  className?: string;
}

export function StreakCounter({ streak, className }: StreakCounterProps) {
  if (streak <= 0) return null;

  const isHotStreak = streak >= 7;
  const isOnFire = streak >= 14;
  const isLegendary = streak >= 30;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        isLegendary 
          ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400"
          : isOnFire
            ? "bg-orange-500/15 text-orange-600 dark:text-orange-400"
            : isHotStreak
              ? "bg-red-500/10 text-red-500"
              : "bg-muted text-muted-foreground",
        className
      )}
    >
      <motion.span
        animate={isOnFire ? {
          scale: [1, 1.2, 1],
          rotate: [0, -5, 5, 0],
        } : undefined}
        transition={{
          duration: 0.5,
          repeat: isOnFire ? Infinity : 0,
          repeatDelay: 1,
        }}
      >
        {isLegendary ? '🔥✨' : isOnFire ? '🔥🔥' : isHotStreak ? '🔥' : ''}
        {!isHotStreak && <Flame className="h-3 w-3" />}
      </motion.span>
      <span>{streak} day{streak !== 1 ? 's' : ''}</span>
    </motion.div>
  );
}
