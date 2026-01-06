import { useState } from 'react';
import { Sparkles, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HabitCategory, HABIT_CATEGORIES } from './HabitCategories';
import { cn } from '@/lib/utils';

interface HabitTemplate {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  color: string;
}

const HABIT_TEMPLATES: HabitTemplate[] = [
  // Fitness
  { id: '1', title: 'Morning Exercise', description: '30 minutes of physical activity', category: 'fitness', color: '#4ADE80' },
  { id: '2', title: 'Take 10,000 Steps', description: 'Walk throughout the day', category: 'fitness', color: '#4ADE80' },
  { id: '3', title: 'Stretch Routine', description: '10 minutes of stretching', category: 'fitness', color: '#4ADE80' },
  
  // Mindfulness
  { id: '4', title: 'Meditation', description: '10 minutes of mindful breathing', category: 'mindfulness', color: '#38BDF8' },
  { id: '5', title: 'Gratitude Journal', description: 'Write 3 things you\'re grateful for', category: 'mindfulness', color: '#38BDF8' },
  { id: '6', title: 'No Phone Before Bed', description: 'Stop using phone 1 hour before sleep', category: 'mindfulness', color: '#38BDF8' },
  
  // Learning
  { id: '7', title: 'Read for 30 Minutes', description: 'Read books or articles daily', category: 'learning', color: '#FB923C' },
  { id: '8', title: 'Learn a New Word', description: 'Expand your vocabulary', category: 'learning', color: '#FB923C' },
  { id: '9', title: 'Practice a Skill', description: '30 minutes of deliberate practice', category: 'learning', color: '#FB923C' },
  
  // Health
  { id: '10', title: 'Drink 8 Glasses of Water', description: 'Stay hydrated throughout the day', category: 'health', color: '#F472B6' },
  { id: '11', title: 'Healthy Meal Prep', description: 'Prepare nutritious meals', category: 'health', color: '#F472B6' },
  { id: '12', title: 'Sleep 8 Hours', description: 'Get enough rest each night', category: 'health', color: '#F472B6' },
  
  // Work
  { id: '13', title: 'Plan Tomorrow', description: 'Review and plan next day tasks', category: 'work', color: '#8B5CF6' },
  { id: '14', title: 'Inbox Zero', description: 'Clear your email inbox', category: 'work', color: '#8B5CF6' },
  { id: '15', title: 'Deep Work Session', description: '2 hours of focused work', category: 'work', color: '#8B5CF6' },
  
  // Personal
  { id: '16', title: 'Call a Friend', description: 'Stay connected with loved ones', category: 'personal', color: '#A855F7' },
  { id: '17', title: 'Creative Time', description: '30 minutes on a hobby', category: 'personal', color: '#A855F7' },
  { id: '18', title: 'Digital Declutter', description: 'Organize files and apps', category: 'personal', color: '#A855F7' },
];

interface HabitTemplatesProps {
  onSelectTemplate: (template: { title: string; description: string; category: HabitCategory; color: string }) => void;
  existingHabitTitles: string[];
}

// Habit templates dialog
export function HabitTemplates({ onSelectTemplate, existingHabitTitles }: HabitTemplatesProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');

  const filteredTemplates = selectedCategory === 'all' 
    ? HABIT_TEMPLATES 
    : HABIT_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleSelect = (template: HabitTemplate) => {
    onSelectTemplate({
      title: template.title,
      description: template.description,
      category: template.category,
      color: template.color,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Sparkles className="h-4 w-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Habit Templates
          </DialogTitle>
        </DialogHeader>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium transition-all whitespace-nowrap',
              selectedCategory === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            All
          </button>
          {(Object.keys(HABIT_CATEGORIES) as HabitCategory[]).map((cat) => {
            const config = HABIT_CATEGORIES[cat];

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                  selectedCategory === cat 
                    ? cn(config.bgColor, config.color) 
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Templates grid */}
        <div className="grid gap-2 overflow-y-auto flex-1 pr-1">
          {filteredTemplates.map((template) => {
            const config = HABIT_CATEGORIES[template.category];
            const Icon = config.icon;
            const alreadyAdded = existingHabitTitles.includes(template.title);

            return (
              <Card
                key={template.id}
                className={cn(
                  'p-3 cursor-pointer transition-all hover:shadow-md',
                  alreadyAdded && 'opacity-50'
                )}
                onClick={() => !alreadyAdded && handleSelect(template)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-lg', config.bgColor)}>
                    <Icon className={cn('h-4 w-4', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">{template.title}</h4>
                      {alreadyAdded && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Check className="h-3 w-3" /> Added
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{template.description}</p>
                  </div>
                  {!alreadyAdded && (
                    <Plus className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
