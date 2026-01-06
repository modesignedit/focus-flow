import { cn } from '@/lib/utils';
import { 
  Heart, 
  Briefcase, 
  User, 
  Book, 
  Dumbbell, 
  Brain,
  LucideIcon 
} from 'lucide-react';

export type HabitCategory = 'health' | 'work' | 'personal' | 'learning' | 'fitness' | 'mindfulness';

interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const HABIT_CATEGORIES: Record<HabitCategory, CategoryConfig> = {
  health: { label: 'Health', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-500/10' },
  work: { label: 'Work', icon: Briefcase, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  personal: { label: 'Personal', icon: User, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  learning: { label: 'Learning', icon: Book, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  fitness: { label: 'Fitness', icon: Dumbbell, color: 'text-green-500', bgColor: 'bg-green-500/10' },
  mindfulness: { label: 'Mindfulness', icon: Brain, color: 'text-teal-500', bgColor: 'bg-teal-500/10' },
};

interface CategoryBadgeProps {
  category: HabitCategory;
  size?: 'sm' | 'md';
}

// Category badge component
export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const config = HABIT_CATEGORIES[category] || HABIT_CATEGORIES.personal;
  const Icon = config.icon;

  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full font-medium',
      config.bgColor,
      config.color,
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {config.label}
    </span>
  );
}

interface CategorySelectorProps {
  value: HabitCategory;
  onChange: (category: HabitCategory) => void;
}

// Category selector for forms
export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(HABIT_CATEGORIES) as HabitCategory[]).map((cat) => {
        const config = HABIT_CATEGORIES[cat];
        const Icon = config.icon;
        const isSelected = value === cat;

        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              config.bgColor,
              isSelected ? cn(config.color, 'ring-2 ring-offset-2 ring-offset-background', config.color.replace('text-', 'ring-')) : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {config.label}
          </button>
        );
      })}
    </div>
  );
}

interface CategoryFilterProps {
  selected: HabitCategory | 'all';
  onChange: (category: HabitCategory | 'all') => void;
}

// Category filter for habit list
export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onChange('all')}
        className={cn(
          'px-3 py-1 rounded-full text-sm font-medium transition-all whitespace-nowrap',
          selected === 'all' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground hover:text-foreground'
        )}
      >
        All
      </button>
      {(Object.keys(HABIT_CATEGORIES) as HabitCategory[]).map((cat) => {
        const config = HABIT_CATEGORIES[cat];
        const Icon = config.icon;

        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all whitespace-nowrap',
              selected === cat 
                ? cn(config.bgColor, config.color) 
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
