import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HabitCard } from './HabitCard';
import { HabitDialog } from './HabitDialog';
import { useHabits, Habit } from '@/hooks/useHabits';
import { useToast } from '@/hooks/use-toast';

// Main habit list component with create/edit functionality
export function HabitList() {
  const { habits, loading, createHabit, updateHabit, deleteHabit, toggleCompletion } = useHabits();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleCreate = async (data: { title: string; description?: string; color: string }) => {
    const { error } = await createHabit(data.title, data.description, data.color);
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Habit created', description: 'Good luck with your new goal!' });
      setDialogOpen(false);
    }
  };

  const handleUpdate = async (data: { title: string; description?: string; color: string }) => {
    if (!editingHabit) return;
    const { error } = await updateHabit(editingHabit.id, data);
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
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingHabit(null);
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Today's Habits</h2>
          {habits.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {todayStats.completed} of {todayStats.total} complete
            </p>
          )}
        </div>
        <Button onClick={() => setDialogOpen(true)} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

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
          <Button onClick={() => setDialogOpen(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create your first habit
          </Button>
        </div>
      )}

      {/* Habit cards */}
      <div className="space-y-3">
        {habits.map(habit => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onToggle={() => handleToggle(habit.id)}
            onEdit={() => openEditDialog(habit)}
            onDelete={() => handleDelete(habit.id)}
          />
        ))}
      </div>

      {/* Create/Edit dialog */}
      <HabitDialog
        open={dialogOpen}
        onOpenChange={closeDialog}
        habit={editingHabit}
        onSubmit={editingHabit ? handleUpdate : handleCreate}
      />
    </div>
  );
}
