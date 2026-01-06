import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'completion' | 'focus' | 'special';
  threshold: number;
  unlocked: boolean;
  unlockedAt?: string;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function AchievementBadge({ achievement, size = 'md', showTooltip = true }: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-base',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className="relative group"
    >
      <div
        className={cn(
          "rounded-full flex items-center justify-center transition-all",
          sizeClasses[size],
          achievement.unlocked
            ? "bg-gradient-to-br from-amber-400/20 to-orange-500/20 border-2 border-amber-500/50"
            : "bg-muted/50 border-2 border-muted grayscale opacity-50"
        )}
      >
        <span className={cn(
          "transition-all",
          !achievement.unlocked && "grayscale"
        )}>
          {achievement.icon}
        </span>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg min-w-[150px]">
            <p className="text-sm font-medium text-center">{achievement.title}</p>
            <p className="text-xs text-muted-foreground text-center mt-0.5">
              {achievement.description}
            </p>
            {!achievement.unlocked && (
              <p className="text-xs text-primary text-center mt-1 font-medium">
                Keep going!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Glow effect for unlocked badges */}
      {achievement.unlocked && (
        <motion.div
          className="absolute inset-0 rounded-full bg-amber-500/20 blur-md -z-10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
}
