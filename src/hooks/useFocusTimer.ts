import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Focus timer states
export type TimerState = 'idle' | 'running' | 'paused' | 'break';

interface FocusSession {
  id: string;
  duration_minutes: number;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
}

export function useFocusTimer(defaultMinutes = 25) {
  const { user } = useAuth();
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [seconds, setSeconds] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [todaySessions, setTodaySessions] = useState<FocusSession[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Total seconds remaining
  const totalSeconds = minutes * 60 + seconds;
  const progress = ((defaultMinutes * 60 - totalSeconds) / (defaultMinutes * 60)) * 100;

  // Fetch today's completed sessions
  const fetchTodaySessions = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true)
      .gte('started_at', `${today}T00:00:00`)
      .lte('started_at', `${today}T23:59:59`)
      .order('started_at', { ascending: false });

    setTodaySessions(data || []);
  }, [user]);

  useEffect(() => {
    fetchTodaySessions();
  }, [fetchTodaySessions]);

  // Timer tick logic
  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            if (minutes === 0) {
              // Timer complete
              clearInterval(intervalRef.current!);
              handleComplete();
              return 0;
            }
            setMinutes(m => m - 1);
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state, minutes]);

  // Handle timer completion
  const handleComplete = async () => {
    setState('idle');
    
    // Mark session as complete in database
    if (sessionId && user) {
      await supabase
        .from('focus_sessions')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      await fetchTodaySessions();
    }

    // Play notification sound (browser API)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Focus session complete! 🎉', {
        body: 'Great work! Take a short break.',
        icon: '/favicon.ico'
      });
    }

    setSessionId(null);
    setMinutes(defaultMinutes);
    setSeconds(0);
  };

  // Start the timer
  const start = async () => {
    if (state === 'idle') {
      // Create new session in database
      if (user) {
        const { data } = await supabase
          .from('focus_sessions')
          .insert({
            user_id: user.id,
            duration_minutes: defaultMinutes,
            completed: false
          })
          .select()
          .single();

        if (data) {
          setSessionId(data.id);
        }
      }
    }
    setState('running');
  };

  // Pause the timer
  const pause = () => {
    setState('paused');
  };

  // Resume the timer
  const resume = () => {
    setState('running');
  };

  // Reset the timer
  const reset = async () => {
    setState('idle');
    setMinutes(defaultMinutes);
    setSeconds(0);
    
    // Delete incomplete session
    if (sessionId && user) {
      await supabase
        .from('focus_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('completed', false);
    }
    setSessionId(null);
  };

  // Skip to break (marks session as incomplete)
  const skip = async () => {
    await reset();
  };

  // Format time display
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Calculate today's focus time
  const todayFocusMinutes = todaySessions.reduce((sum, s) => sum + s.duration_minutes, 0);

  return {
    minutes,
    seconds,
    state,
    progress,
    timeDisplay,
    todaySessions,
    todayFocusMinutes,
    start,
    pause,
    resume,
    reset,
    skip,
    setDuration: (mins: number) => {
      if (state === 'idle') {
        setMinutes(mins);
        setSeconds(0);
      }
    }
  };
}
