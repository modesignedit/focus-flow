import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/components/achievements/AchievementBadge';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export function AchievementNotification({ achievement, onDismiss }: AchievementNotificationProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          onClick={onDismiss}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 cursor-pointer"
        >
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl px-6 py-4 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-4">
              {/* Badge icon */}
              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                className="text-4xl"
              >
                {achievement.icon}
              </motion.div>

              {/* Text content */}
              <div>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide"
                >
                  Achievement Unlocked!
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-semibold mt-0.5"
                >
                  {achievement.title}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-muted-foreground mt-0.5"
                >
                  {achievement.description}
                </motion.p>
              </div>
            </div>

            {/* Sparkle effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-amber-400 rounded-full"
                initial={{ 
                  x: '50%', 
                  y: '50%',
                  opacity: 0,
                  scale: 0 
                }}
                animate={{ 
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 + (Math.random() - 0.5) * 200}%`,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 1,
                  delay: 0.3 + i * 0.1,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
