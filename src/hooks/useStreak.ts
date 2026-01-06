import { useMemo } from 'react';
import { format, subDays, parseISO } from 'date-fns';
import { HabitWithCompletions } from './useHabits';

// Calculate streak for a specific habit or overall
export function useStreak(habits: HabitWithCompletions[]) {
  // Calculate overall streak (days where all habits were completed)
  const overallStreak = useMemo(() => {
    if (habits.length === 0) return 0;

    let streak = 0;
    const today = new Date();

    // Check each day going backwards
    for (let i = 0; i < 365; i++) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      
      // Check if all habits were completed on this day
      const allCompleted = habits.every(habit => {
        const completion = habit.completions.find(c => c.completed_at === date);
        return completion && completion.count >= habit.target_per_day;
      });

      if (allCompleted) {
        streak++;
      } else if (i > 0) {
        // Allow today to be incomplete (still building streak)
        break;
      }
    }

    return streak;
  }, [habits]);

  // Calculate streak for a specific habit
  const getHabitStreak = useMemo(() => {
    return (habitId: string): number => {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return 0;

      let streak = 0;
      const today = new Date();

      for (let i = 0; i < 365; i++) {
        const date = format(subDays(today, i), 'yyyy-MM-dd');
        const completion = habit.completions.find(c => c.completed_at === date);
        
        if (completion && completion.count >= habit.target_per_day) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }

      return streak;
    };
  }, [habits]);

  return {
    overallStreak,
    getHabitStreak,
  };
}
