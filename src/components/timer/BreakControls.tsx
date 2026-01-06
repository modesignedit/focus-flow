import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BreakControlsProps {
  breakDuration: number;
  onSetBreakDuration: (mins: number) => void;
  isBreakActive: boolean;
  onSkipBreak: () => void;
}

const BREAK_DURATIONS = [5, 10, 15, 20];

export function BreakControls({ 
  breakDuration, 
  onSetBreakDuration, 
  isBreakActive,
  onSkipBreak 
}: BreakControlsProps) {
  return (
    <div className="space-y-3">
      {/* Break duration selector */}
      <div className="flex items-center justify-center gap-1">
        <span className="text-xs text-muted-foreground mr-2">Break:</span>
        {BREAK_DURATIONS.map((mins) => (
          <Button
            key={mins}
            variant="ghost"
            size="sm"
            onClick={() => onSetBreakDuration(mins)}
            disabled={isBreakActive}
            className={cn(
              "text-xs h-7 px-2 font-medium transition-all",
              breakDuration === mins && "bg-secondary text-secondary-foreground"
            )}
          >
            {mins}m
          </Button>
        ))}
      </div>

      {/* Skip break button when break is active */}
      {isBreakActive && (
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSkipBreak}
            className="text-xs text-muted-foreground"
          >
            Skip break
          </Button>
        </div>
      )}
    </div>
  );
}
