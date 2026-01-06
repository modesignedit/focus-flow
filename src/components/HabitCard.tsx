import { Check, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HabitWithCompletions } from '@/hooks/useHabits';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: HabitWithCompletions;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// Individual habit card with completion toggle and progress
export function HabitCard({ habit, onToggle, onEdit, onDelete }: HabitCardProps) {
  const isComplete = habit.todayCount >= habit.target_per_day;
  const progress = (habit.todayCount / habit.target_per_day) * 100;

  return (
    <Card
      className={cn(
        "p-4 transition-all duration-300 animate-fade-in",
        "hover:shadow-md",
        isComplete && "bg-secondary/50"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Completion button */}
        <button
          onClick={onToggle}
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full border-2 transition-all duration-300",
            "flex items-center justify-center",
            isComplete
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground/30 hover:border-primary/50"
          )}
          style={{
            borderColor: isComplete ? undefined : habit.color,
            backgroundColor: isComplete ? habit.color : undefined
          }}
          aria-label={isComplete ? 'Mark incomplete' : 'Mark complete'}
        >
          {isComplete && <Check className="h-4 w-4" />}
          {!isComplete && habit.target_per_day > 1 && (
            <span className="text-xs font-medium" style={{ color: habit.color }}>
              {habit.todayCount}
            </span>
          )}
        </button>

        {/* Habit info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={cn(
                "font-medium transition-all",
                isComplete && "line-through text-muted-foreground"
              )}>
                {habit.title}
              </h3>
              {habit.description && (
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                  {habit.description}
                </p>
              )}
            </div>

            {/* Actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Progress bar for multi-target habits */}
          {habit.target_per_day > 1 && (
            <div className="mt-2">
              <Progress 
                value={progress} 
                className="h-1.5"
                style={{ 
                  '--progress-color': habit.color 
                } as React.CSSProperties}
              />
              <span className="text-xs text-muted-foreground mt-1">
                {habit.todayCount} / {habit.target_per_day} today
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
