import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

// Habit type definitions
export interface Habit {
  id: string;
  title: string;
  description: string | null;
  color: string;
  target_per_day: number;
  created_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_at: string;
  count: number;
}

export interface HabitWithCompletions extends Habit {
  completions: HabitCompletion[];
  todayCount: number;
  weeklyCount: number;
}

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<HabitWithCompletions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all habits with their completions
  const fetchHabits = useCallback(async () => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');
      const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');

      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;

      // Fetch completions for this week
      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', weekStart)
        .lte('completed_at', weekEnd);

      if (completionsError) throw completionsError;

      // Combine habits with their completions
      const habitsWithCompletions: HabitWithCompletions[] = (habitsData || []).map(habit => {
        const habitCompletions = (completionsData || []).filter(c => c.habit_id === habit.id);
        const todayCompletion = habitCompletions.find(c => c.completed_at === today);
        const weeklyCount = habitCompletions.reduce((sum, c) => sum + c.count, 0);

        return {
          ...habit,
          completions: habitCompletions,
          todayCount: todayCompletion?.count || 0,
          weeklyCount
        };
      });

      setHabits(habitsWithCompletions);
      setError(null);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError('Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Create a new habit
  const createHabit = async (title: string, description?: string, color?: string) => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        title,
        description: description || null,
        color: color || '#8B5CF6'
      });

    if (error) {
      console.error('Error creating habit:', error);
      return { error: error.message };
    }

    await fetchHabits();
    return { error: null };
  };

  // Update a habit
  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating habit:', error);
      return { error: error.message };
    }

    await fetchHabits();
    return { error: null };
  };

  // Delete a habit
  const deleteHabit = async (id: string) => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting habit:', error);
      return { error: error.message };
    }

    await fetchHabits();
    return { error: null };
  };

  // Toggle habit completion for today
  const toggleCompletion = async (habitId: string) => {
    if (!user) return { error: 'Not authenticated' };

    const today = format(new Date(), 'yyyy-MM-dd');
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return { error: 'Habit not found' };

    const existingCompletion = habit.completions.find(c => c.completed_at === today);

    if (existingCompletion) {
      // Increment count or remove if at target
      if (existingCompletion.count >= habit.target_per_day) {
        // Reset to 0
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('id', existingCompletion.id);

        if (error) return { error: error.message };
      } else {
        // Increment
        const { error } = await supabase
          .from('habit_completions')
          .update({ count: existingCompletion.count + 1 })
          .eq('id', existingCompletion.id);

        if (error) return { error: error.message };
      }
    } else {
      // Create new completion
      const { error } = await supabase
        .from('habit_completions')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          completed_at: today,
          count: 1
        });

      if (error) return { error: error.message };
    }

    await fetchHabits();
    return { error: null };
  };

  // Get weekly stats for charts
  const getWeeklyStats = () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayName = format(day, 'EEE');
      
      let completed = 0;
      let total = 0;

      habits.forEach(habit => {
        total += habit.target_per_day;
        const completion = habit.completions.find(c => c.completed_at === dateStr);
        completed += completion?.count || 0;
      });

      return {
        day: dayName,
        date: dateStr,
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    });
  };

  return {
    habits,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    getWeeklyStats,
    refetch: fetchHabits
  };
}
