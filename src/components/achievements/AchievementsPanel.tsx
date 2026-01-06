import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AchievementBadge, Achievement } from './AchievementBadge';
import { ShareButton } from '@/components/sharing/ShareableCard';
import { cn } from '@/lib/utils';

interface AchievementsPanelProps {
  achievements: Achievement[];
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementsPanel({ achievements, isOpen, onClose }: AchievementsPanelProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  // Group achievements by type
  const groupedAchievements = {
    streak: achievements.filter(a => a.type === 'streak'),
    completion: achievements.filter(a => a.type === 'completion'),
    focus: achievements.filter(a => a.type === 'focus'),
    special: achievements.filter(a => a.type === 'special'),
  };

  const typeLabels = {
    streak: '🔥 Streak Milestones',
    completion: '✅ Completion Goals',
    focus: '⏱️ Focus Time',
    special: '⭐ Special',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed inset-x-4 bottom-4 top-auto max-h-[70vh] z-50 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md"
          >
            <Card className="p-4 overflow-hidden flex flex-col max-h-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <h2 className="font-semibold">Achievements</h2>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {unlockedCount}/{totalCount}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Achievement groups */}
              <div className="overflow-y-auto space-y-6 flex-1 pr-2">
                {(Object.entries(groupedAchievements) as [keyof typeof groupedAchievements, Achievement[]][]).map(
                  ([type, items]) => items.length > 0 && (
                    <div key={type}>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        {typeLabels[type]}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {items.map((achievement) => (
                          <div key={achievement.id} className="relative group">
                            <AchievementBadge
                              achievement={achievement}
                              size="md"
                            />
                            {achievement.unlocked && (
                              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ShareButton 
                                  type="achievement" 
                                  achievement={achievement}
                                  variant="outline"
                                  size="icon"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Button to open achievements panel
export function AchievementsButton({ 
  unlockedCount, 
  onClick,
  hasNew 
}: { 
  unlockedCount: number; 
  onClick: () => void;
  hasNew?: boolean;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        "gap-2 relative",
        hasNew && "border-amber-500/50"
      )}
    >
      <Trophy className="h-4 w-4 text-amber-500" />
      <span>{unlockedCount}</span>
      
      {hasNew && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full"
        />
      )}
    </Button>
  );
}
