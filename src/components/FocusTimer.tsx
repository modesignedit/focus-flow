import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useFocusTimer } from '@/hooks/useFocusTimer';
import { cn } from '@/lib/utils';
import { BreathingAnimation } from './timer/BreathingAnimation';
import { AmbientSoundButton } from './timer/AmbientSoundButton';
import { BreakControls } from './timer/BreakControls';

// Pomodoro-style focus timer with circular progress
export function FocusTimer() {
  const {
    state,
    progress,
    timeDisplay,
    todayFocusMinutes,
    focusDuration,
    breakDuration,
    start,
    pause,
    resume,
    reset,
    skipBreak,
    setDuration,
    setBreakDuration
  } = useFocusTimer(25);

  const durations = [15, 25, 45, 60];

  // Request notification permission on mount
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  const isBreak = state === 'break';

  return (
    <Card className={cn(
      "p-6 sm:p-8 glass animate-fade-in relative overflow-hidden transition-colors duration-500",
      isBreak && "bg-primary/5 border-primary/20"
    )}>
      {/* Ambient sound button in top right */}
      <div className="absolute top-4 right-4 z-10">
        <AmbientSoundButton isTimerRunning={state === 'running' || state === 'break'} />
      </div>

      {/* Duration selector (only when idle) */}
      {state === 'idle' && (
        <div className="space-y-2 mb-6">
          <div className="flex justify-center gap-2">
            {durations.map((mins) => (
              <Button
                key={mins}
                variant="ghost"
                size="sm"
                onClick={() => setDuration(mins)}
                className={cn(
                  "text-xs font-medium transition-all",
                  focusDuration === mins && "bg-primary text-primary-foreground"
                )}
              >
                {mins}m
              </Button>
            ))}
          </div>
          
          {/* Break duration controls */}
          <BreakControls
            breakDuration={breakDuration}
            onSetBreakDuration={setBreakDuration}
            isBreakActive={false}
            onSkipBreak={skipBreak}
          />
        </div>
      )}

      {/* Break mode header */}
      {isBreak && (
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 text-sm text-primary font-medium px-3 py-1 bg-primary/10 rounded-full">
            <Coffee className="h-4 w-4" />
            Break Time
          </span>
        </div>
      )}

      {/* Circular timer display */}
      <div className="relative mx-auto w-48 h-48 sm:w-64 sm:h-64 mb-6">
        {/* Breathing animation for break state */}
        <BreathingAnimation isActive={isBreak} />
        
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
            stroke={isBreak ? 'hsl(var(--primary))' : state === 'running' ? 'hsl(var(--timer-active))' : 'hsl(var(--muted-foreground))'}
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
              (state === 'running' || state === 'break') && "animate-timer-tick"
            )}
          >
            {timeDisplay}
          </span>
          <span className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">
            {state === 'idle' ? 'Ready' : state === 'paused' ? 'Paused' : state === 'break' ? 'Breathe' : 'Focus'}
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

        {state === 'break' && (
          <Button onClick={skipBreak} variant="outline" size="lg" className="gap-2">
            Skip Break
          </Button>
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
