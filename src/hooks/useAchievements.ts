import { useState, useEffect, useCallback, useMemo } from 'react';
import { Achievement } from '@/components/achievements/AchievementBadge';
import { HabitWithCompletions } from './useHabits';

// Achievement definitions
const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  // Streak achievements
  { id: 'streak_3', title: 'Getting Started', description: '3 day streak', icon: '🌱', type: 'streak', threshold: 3 },
  { id: 'streak_7', title: 'Week Warrior', description: '7 day streak', icon: '🔥', type: 'streak', threshold: 7 },
  { id: 'streak_14', title: 'Fortnight Fighter', description: '14 day streak', icon: '💪', type: 'streak', threshold: 14 },
  { id: 'streak_30', title: 'Monthly Master', description: '30 day streak', icon: '⭐', type: 'streak', threshold: 30 },
  { id: 'streak_60', title: 'Two Month Titan', description: '60 day streak', icon: '🏆', type: 'streak', threshold: 60 },
  { id: 'streak_100', title: 'Century Club', description: '100 day streak', icon: '💎', type: 'streak', threshold: 100 },
  { id: 'streak_365', title: 'Year of Growth', description: '365 day streak', icon: '👑', type: 'streak', threshold: 365 },
  
  // Completion achievements
  { id: 'complete_10', title: 'First Steps', description: '10 habits completed', icon: '✨', type: 'completion', threshold: 10 },
  { id: 'complete_50', title: 'Habit Builder', description: '50 habits completed', icon: '🎯', type: 'completion', threshold: 50 },
  { id: 'complete_100', title: 'Century Maker', description: '100 habits completed', icon: '💯', type: 'completion', threshold: 100 },
  { id: 'complete_500', title: 'Habit Hero', description: '500 habits completed', icon: '🦸', type: 'completion', threshold: 500 },
  { id: 'complete_1000', title: 'Legendary', description: '1000 habits completed', icon: '🌟', type: 'completion', threshold: 1000 },
  
  // Focus achievements
  { id: 'focus_60', title: 'First Hour', description: '60 min focused', icon: '⏰', type: 'focus', threshold: 60 },
  { id: 'focus_300', title: 'Deep Worker', description: '5 hours focused', icon: '🧠', type: 'focus', threshold: 300 },
  { id: 'focus_600', title: 'Flow State', description: '10 hours focused', icon: '🌊', type: 'focus', threshold: 600 },
  { id: 'focus_1500', title: 'Focus Master', description: '25 hours focused', icon: '🎖️', type: 'focus', threshold: 1500 },
  
  // Special achievements
  { id: 'first_habit', title: 'New Journey', description: 'Create first habit', icon: '🚀', type: 'special', threshold: 1 },
  { id: 'five_habits', title: 'Multi-Tasker', description: '5 active habits', icon: '📋', type: 'special', threshold: 5 },
  { id: 'perfect_day', title: 'Perfect Day', description: 'Complete all habits', icon: '🎉', type: 'special', threshold: 1 },
];

const STORAGE_KEY = 'focusflow_achievements';

interface AchievementProgress {
  overallStreak: number;
  totalCompletions: number;
  totalFocusMinutes: number;
  habitCount: number;
  hadPerfectDay: boolean;
}

export function useAchievements(
  habits: HabitWithCompletions[],
  focusMinutes: number,
  overallStreak: number
) {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [hasNewAchievement, setHasNewAchievement] = useState(false);

  // Load unlocked achievements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUnlockedIds(new Set(parsed.unlockedIds || []));
      } catch (e) {
        console.error('Failed to parse achievements:', e);
      }
    }
  }, []);

  // Save unlocked achievements to localStorage
  const saveUnlocked = useCallback((ids: Set<string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      unlockedIds: Array.from(ids),
      savedAt: new Date().toISOString()
    }));
  }, []);

  // Calculate progress
  const progress: AchievementProgress = useMemo(() => {
    const totalCompletions = habits.reduce((sum, h) => sum + h.weeklyCount, 0);
    const habitCount = habits.length;
    const allComplete = habits.length > 0 && habits.every(h => h.todayCount >= h.target_per_day);

    return {
      overallStreak,
      totalCompletions,
      totalFocusMinutes: focusMinutes,
      habitCount,
      hadPerfectDay: allComplete,
    };
  }, [habits, focusMinutes, overallStreak]);

  // Check and unlock achievements
  const checkAchievements = useCallback(() => {
    const newUnlocked = new Set(unlockedIds);
    let justUnlocked: Achievement | null = null;

    ACHIEVEMENT_DEFINITIONS.forEach((def) => {
      if (newUnlocked.has(def.id)) return;

      let shouldUnlock = false;

      switch (def.type) {
        case 'streak':
          shouldUnlock = progress.overallStreak >= def.threshold;
          break;
        case 'completion':
          shouldUnlock = progress.totalCompletions >= def.threshold;
          break;
        case 'focus':
          shouldUnlock = progress.totalFocusMinutes >= def.threshold;
          break;
        case 'special':
          if (def.id === 'first_habit') {
            shouldUnlock = progress.habitCount >= 1;
          } else if (def.id === 'five_habits') {
            shouldUnlock = progress.habitCount >= 5;
          } else if (def.id === 'perfect_day') {
            shouldUnlock = progress.hadPerfectDay;
          }
          break;
      }

      if (shouldUnlock) {
        newUnlocked.add(def.id);
        justUnlocked = { ...def, unlocked: true, unlockedAt: new Date().toISOString() };
      }
    });

    if (newUnlocked.size > unlockedIds.size) {
      setUnlockedIds(newUnlocked);
      saveUnlocked(newUnlocked);
      
      if (justUnlocked) {
        setNewAchievement(justUnlocked);
        setHasNewAchievement(true);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setNewAchievement(null);
        }, 5000);
      }
    }
  }, [progress, unlockedIds, saveUnlocked]);

  // Check achievements when progress changes
  useEffect(() => {
    checkAchievements();
  }, [progress]);

  // Build full achievements list with unlock status
  const achievements: Achievement[] = useMemo(() => {
    return ACHIEVEMENT_DEFINITIONS.map((def) => ({
      ...def,
      unlocked: unlockedIds.has(def.id),
    }));
  }, [unlockedIds]);

  const dismissNotification = useCallback(() => {
    setNewAchievement(null);
  }, []);

  const markAsSeen = useCallback(() => {
    setHasNewAchievement(false);
  }, []);

  return {
    achievements,
    unlockedCount: unlockedIds.size,
    newAchievement,
    hasNewAchievement,
    dismissNotification,
    markAsSeen,
    progress,
  };
}
