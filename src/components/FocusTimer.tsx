import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useFocusTimer } from '@/hooks/useFocusTimer';
import { cn } from '@/lib/utils';

// Pomodoro-style focus timer with circular progress
export function FocusTimer() {
  const {
    state,
    progress,
    timeDisplay,
    todayFocusMinutes,
    start,
    pause,
    resume,
    reset,
    setDuration
  } = useFocusTimer(25);

  const durations = [15, 25, 45, 60];

  // Request notification permission on mount
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  return (
    <Card className="p-6 sm:p-8 glass animate-fade-in">
      {/* Duration selector (only when idle) */}
      {state === 'idle' && (
        <div className="flex justify-center gap-2 mb-6">
          {durations.map((mins) => (
            <Button
              key={mins}
              variant="ghost"
              size="sm"
              onClick={() => setDuration(mins)}
              className={cn(
                "text-xs font-medium transition-all",
                timeDisplay === `${String(mins).padStart(2, '0')}:00` && "bg-primary text-primary-foreground"
              )}
            >
              {mins}m
            </Button>
          ))}
        </div>
      )}

      {/* Circular timer display */}
      <div className="relative mx-auto w-48 h-48 sm:w-64 sm:h-64 mb-6">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="hsl(var(--timer-bg))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke={state === 'running' ? 'hsl(var(--timer-active))' : 'hsl(var(--muted-foreground))'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        
        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className={cn(
              "text-4xl sm:text-5xl font-light tracking-wider transition-all",
              state === 'running' && "animate-timer-tick"
            )}
          >
            {timeDisplay}
          </span>
          <span className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">
            {state === 'idle' ? 'Ready' : state === 'paused' ? 'Paused' : 'Focus'}
          </span>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex justify-center gap-3">
        {state === 'idle' && (
          <Button onClick={start} size="lg" className="gap-2 px-8">
            <Play className="h-4 w-4" />
            Start
          </Button>
        )}
        
        {state === 'running' && (
          <>
            <Button onClick={pause} variant="outline" size="lg" className="gap-2">
              <Pause className="h-4 w-4" />
              Pause
            </Button>
            <Button onClick={reset} variant="ghost" size="lg">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {state === 'paused' && (
          <>
            <Button onClick={resume} size="lg" className="gap-2 px-8">
              <Play className="h-4 w-4" />
              Resume
            </Button>
            <Button onClick={reset} variant="ghost" size="lg">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Today's stats */}
      <div className="mt-6 pt-4 border-t border-border flex justify-center gap-6 text-sm">
        <div className="text-center">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Coffee className="h-3 w-3" />
            <span>Today</span>
          </div>
          <span className="font-semibold">{todayFocusMinutes} min</span>
        </div>
      </div>
    </Card>
  );
}
