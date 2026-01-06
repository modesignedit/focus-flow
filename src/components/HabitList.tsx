import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HabitCard } from './HabitCard';
import { HabitDialog } from './HabitDialog';
import { CategoryFilter, HabitCategory } from './habits/HabitCategories';
import { HabitTemplates } from './habits/HabitTemplates';
import { useHabits, Habit } from '@/hooks/useHabits';
import { useStreak } from '@/hooks/useStreak';
import { useCelebration } from '@/hooks/useCelebration';
import { useToast } from '@/hooks/use-toast';

// Main habit list component with create/edit functionality
export function HabitList() {
  const { habits, loading, createHabit, updateHabit, deleteHabit, toggleCompletion } = useHabits();
  const { getHabitStreak } = useStreak(habits);
  const { showConfetti, celebrate, soundEnabled } = useCelebration();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [templateDefaults, setTemplateDefaults] = useState<{ title: string; description: string; category: HabitCategory; color: string } | null>(null);

  const handleCreate = async (data: { title: string; description?: string; color: string; category?: string }) => {
    const { error } = await createHabit(data.title, data.description, data.color, data.category as HabitCategory);
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Habit created', description: 'Good luck with your new goal!' });
      setDialogOpen(false);
      setTemplateDefaults(null);
    }
  };

  const handleUpdate = async (data: { title: string; description?: string; color: string; category?: string }) => {
    if (!editingHabit) return;
    const { error } = await updateHabit(editingHabit.id, { ...data, category: data.category as HabitCategory });
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Habit updated' });
      setEditingHabit(null);
      setDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteHabit(id);
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Habit deleted' });
    }
  };

  const handleToggle = async (id: string) => {
    const { error } = await toggleCompletion(id);
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    }
  };

  const openEditDialog = (habit: Habit) => {
    setEditingHabit(habit);
    setTemplateDefaults(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingHabit(null);
    setTemplateDefaults(null);
  };

  const handleSelectTemplate = (template: { title: string; description: string; category: HabitCategory; color: string }) => {
    setTemplateDefaults(template);
    setEditingHabit(null);
    setDialogOpen(true);
  };

  // Filter habits by category
  const filteredHabits = selectedCategory === 'all' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory);

  // Calculate today's completion stats
  const todayStats = habits.reduce(
    (acc, h) => ({
      completed: acc.completed + (h.todayCount >= h.target_per_day ? 1 : 0),
      total: acc.total + 1
    }),
    { completed: 0, total: 0 }
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-semibold">Today's Habits</h2>
          {habits.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {todayStats.completed} of {todayStats.total} complete
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <HabitTemplates 
            onSelectTemplate={handleSelectTemplate}
            existingHabitTitles={habits.map(h => h.title)}
          />
          <Button onClick={() => { setTemplateDefaults(null); setDialogOpen(true); }} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Category filter */}
      {habits.length > 0 && (
        <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
      )}

      {/* Empty state */}
      {habits.length === 0 && (
        <div className="py-12 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-medium mb-2">No habits yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start building your daily routine
          </p>
          <div className="flex gap-2 justify-center">
            <HabitTemplates 
              onSelectTemplate={handleSelectTemplate}
              existingHabitTitles={[]}
            />
            <Button onClick={() => setDialogOpen(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create custom
            </Button>
          </div>
        </div>
      )}

      {/* No habits in category */}
      {habits.length > 0 && filteredHabits.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          No habits in this category
        </div>
      )}

      {/* Habit cards with smart scroll */}
      {filteredHabits.length > 0 && (
        filteredHabits.length > 4 ? (
          <div className="relative">
            <ScrollArea className="h-[400px] pr-3">
              <div className="space-y-3 pb-6">
                {filteredHabits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    streak={getHabitStreak(habit.id)}
                    onToggle={() => handleToggle(habit.id)}
                    onEdit={() => openEditDialog(habit)}
                    onDelete={() => handleDelete(habit.id)}
                    onCelebrate={() => celebrate({ sound: 'complete' })}
                  />
                ))}
              </div>
            </ScrollArea>
            {/* Fade gradient indicator */}
            <div className="absolute bottom-0 left-0 right-3 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                streak={getHabitStreak(habit.id)}
                onToggle={() => handleToggle(habit.id)}
                onEdit={() => openEditDialog(habit)}
                onDelete={() => handleDelete(habit.id)}
                onCelebrate={() => celebrate({ sound: 'complete' })}
              />
            ))}
          </div>
        )
      )}

      {/* Create/Edit dialog */}
      <HabitDialog
        open={dialogOpen}
        onOpenChange={closeDialog}
        habit={editingHabit}
        onSubmit={editingHabit ? handleUpdate : handleCreate}
        defaultValues={templateDefaults || undefined}
      />
    </div>
  );
}
