import { useState, useEffect, useMemo } from 'react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, startOfMonth, endOfMonth, eachWeekOfInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CompletionData {
  habit_id: string;
  completed_at: string;
  count: number;
}

interface HabitData {
  id: string;
  title: string;
  target_per_day: number;
  color: string;
  category: string;
}

// Progress reports component with weekly/monthly views
export function ProgressReports() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [completions, setCompletions] = useState<CompletionData[]>([]);
  const [habits, setHabits] = useState<HabitData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      const daysBack = period === 'week' ? 7 : 30;
      const startDate = format(subDays(new Date(), daysBack), 'yyyy-MM-dd');

      const [habitsRes, completionsRes] = await Promise.all([
        supabase.from('habits').select('id, title, target_per_day, color, category').eq('user_id', user.id),
        supabase.from('habit_completions').select('habit_id, completed_at, count').eq('user_id', user.id).gte('completed_at', startDate),
      ]);

      setHabits(habitsRes.data || []);
      setCompletions(completionsRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, [user, period]);

  // Calculate daily completion rates
  const chartData = useMemo(() => {
    if (habits.length === 0) return [];

    const days = period === 'week' 
      ? eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() })
      : eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() });

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayCompletions = completions.filter(c => c.completed_at === dateStr);
      
      let completed = 0;
      let total = 0;

      habits.forEach(habit => {
        total += habit.target_per_day;
        const habitCompletion = dayCompletions.find(c => c.habit_id === habit.id);
        completed += Math.min(habitCompletion?.count || 0, habit.target_per_day);
      });

      return {
        date: period === 'week' ? format(day, 'EEE') : format(day, 'MMM d'),
        fullDate: dateStr,
        completed,
        total,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  }, [completions, habits, period]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalPossible = chartData.reduce((sum, d) => sum + d.total, 0);
    const totalCompleted = chartData.reduce((sum, d) => sum + d.completed, 0);
    const avgRate = chartData.length > 0 
      ? Math.round(chartData.reduce((sum, d) => sum + d.rate, 0) / chartData.length)
      : 0;
    
    const perfectDays = chartData.filter(d => d.rate === 100).length;

    // Calculate trend (compare first half to second half)
    const midpoint = Math.floor(chartData.length / 2);
    const firstHalf = chartData.slice(0, midpoint);
    const secondHalf = chartData.slice(midpoint);
    const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, d) => sum + d.rate, 0) / firstHalf.length : 0;
    const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, d) => sum + d.rate, 0) / secondHalf.length : 0;
    const trend = secondAvg - firstAvg;

    return { totalPossible, totalCompleted, avgRate, perfectDays, trend };
  }, [chartData]);

  if (loading) {
    return <Card className="p-6 glass animate-pulse h-64" />;
  }

  return (
    <Card className="p-6 glass animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Progress Report
        </h3>
        <div className="flex gap-1">
          <Button
            variant={period === 'week' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPeriod('week')}
          >
            Week
          </Button>
          <Button
            variant={period === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPeriod('month')}
          >
            Month
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <Target className="h-4 w-4 mx-auto mb-1 text-primary" />
          <div className="text-xl font-bold">{stats.avgRate}%</div>
          <div className="text-xs text-muted-foreground">Avg Rate</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <Calendar className="h-4 w-4 mx-auto mb-1 text-green-500" />
          <div className="text-xl font-bold">{stats.perfectDays}</div>
          <div className="text-xs text-muted-foreground">Perfect Days</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <Award className="h-4 w-4 mx-auto mb-1 text-amber-500" />
          <div className="text-xl font-bold">{stats.totalCompleted}</div>
          <div className="text-xs text-muted-foreground">Completions</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <TrendingUp className={`h-4 w-4 mx-auto mb-1 ${stats.trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          <div className="text-xl font-bold">
            {stats.trend >= 0 ? '+' : ''}{Math.round(stats.trend)}%
          </div>
          <div className="text-xs text-muted-foreground">Trend</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {period === 'week' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Completion']}
                />
                <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval={4} />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Completion']}
                />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No data yet. Start tracking habits!
          </div>
        )}
      </div>
    </Card>
  );
}
