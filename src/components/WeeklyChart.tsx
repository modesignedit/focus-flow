import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { useHabits } from '@/hooks/useHabits';
import { format } from 'date-fns';

// Weekly progress chart showing habit completion
export function WeeklyChart() {
  const { getWeeklyStats, habits } = useHabits();
  const stats = getWeeklyStats();
  const today = format(new Date(), 'yyyy-MM-dd');

  if (habits.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">This Week</h2>
        <span className="text-sm text-muted-foreground">
          {stats.reduce((sum, d) => sum + d.completed, 0)} completed
        </span>
      </div>

      <div className="h-32 sm:h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats} barCategoryGap="20%">
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis hide />
            <Bar
              dataKey="completed"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            >
              {stats.map((entry) => (
                <Cell
                  key={entry.date}
                  fill={entry.date === today 
                    ? 'hsl(var(--primary))' 
                    : 'hsl(var(--muted-foreground) / 0.3)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Day indicators */}
      <div className="flex justify-between mt-2 px-2">
        {stats.map(stat => (
          <div
            key={stat.date}
            className="text-center"
          >
            <div
              className={`text-xs font-medium ${
                stat.date === today ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {stat.percentage}%
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
