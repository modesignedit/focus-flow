import { Flame, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useHabits } from '@/hooks/useHabits';
import { useStreak } from '@/hooks/useStreak';
import { ShareButton } from '@/components/sharing/ShareableCard';

// Display overall streak and individual habit streaks
export function StreakDisplay() {
  const { habits } = useHabits();
  const { overallStreak, getHabitStreak } = useStreak(habits);

  if (habits.length === 0) return null;

  return (
    <Card className="p-4 glass animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-orange-500/10">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <div className="text-2xl font-bold flex items-center gap-1">
              {overallStreak}
              <span className="text-sm font-normal text-muted-foreground">day streak</span>
            </div>
            <p className="text-xs text-muted-foreground">All habits completed</p>
          </div>
        </div>
        {overallStreak > 0 && (
          <ShareButton type="streak" streak={overallStreak} variant="outline" size="sm" />
        )}
      </div>

      {/* Individual habit streaks */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Habit Streaks
        </div>
        <div className="grid gap-2">
          {habits.map((habit) => {
            const streak = getHabitStreak(habit.id);
            return (
              <div
                key={habit.id}
                className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="truncate max-w-[150px]">{habit.title}</span>
                </div>
                <span className="font-medium flex items-center gap-1">
                  {streak > 0 && <Flame className="h-3 w-3 text-orange-500" />}
                  {streak} {streak === 1 ? 'day' : 'days'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
