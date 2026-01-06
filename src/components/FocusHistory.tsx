import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { Clock, Calendar, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FocusSession {
  id: string;
  duration_minutes: number;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
}

// Focus session history component
export function FocusHistory() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;
      
      setLoading(true);
      const daysBack = period === 'week' ? 7 : 30;
      const startDate = subDays(new Date(), daysBack).toISOString();

      const { data } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('started_at', startDate)
        .order('started_at', { ascending: false });

      setSessions(data || []);
      setLoading(false);
    };

    fetchSessions();
  }, [user, period]);

  // Calculate stats
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  const totalSessions = sessions.length;
  const avgPerDay = period === 'week' 
    ? Math.round(totalMinutes / 7) 
    : Math.round(totalMinutes / 30);

  // Group sessions by day
  const sessionsByDay = sessions.reduce((acc, session) => {
    const date = format(new Date(session.started_at), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {} as Record<string, FocusSession[]>);

  return (
    <Card className="p-6 glass animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Focus History
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

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">{totalMinutes}</div>
          <div className="text-xs text-muted-foreground">Total mins</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">{totalSessions}</div>
          <div className="text-xs text-muted-foreground">Sessions</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">{avgPerDay}</div>
          <div className="text-xs text-muted-foreground">Avg/day</div>
        </div>
      </div>

      {/* Session list */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">Loading...</div>
        ) : Object.keys(sessionsByDay).length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No sessions yet. Start focusing!
          </div>
        ) : (
          Object.entries(sessionsByDay).map(([date, daySessions]) => (
            <div key={date} className="border-b border-border pb-2 last:border-0">
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(date), 'EEE, MMM d')}
              </div>
              <div className="flex flex-wrap gap-2">
                {daySessions.map((session) => (
                  <span
                    key={session.id}
                    className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    {session.duration_minutes}min @ {format(new Date(session.started_at), 'h:mm a')}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
