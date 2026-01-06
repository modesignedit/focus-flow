import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Habit } from '@/hooks/useHabits';
import { cn } from '@/lib/utils';
import { CategorySelector, HabitCategory } from './habits/HabitCategories';

// Habit colors matching design system
const HABIT_COLORS = [
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Sage', value: '#4ADE80' },
  { name: 'Peach', value: '#FB923C' },
  { name: 'Sky', value: '#38BDF8' },
  { name: 'Rose', value: '#F472B6' },
];

// Form validation schema
const habitSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  color: z.string(),
  category: z.string(),
});

type HabitFormData = z.infer<typeof habitSchema>;

interface HabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit | null;
  onSubmit: (data: HabitFormData) => void;
  defaultValues?: Partial<HabitFormData>;
}

// Dialog for creating/editing habits
export function HabitDialog({ open, onOpenChange, habit, onSubmit, defaultValues }: HabitDialogProps) {
  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: '',
      description: '',
      color: HABIT_COLORS[0].value,
      category: 'personal',
    },
  });

  // Reset form when dialog opens/closes or habit changes
  useEffect(() => {
    if (open) {
      form.reset({
        title: defaultValues?.title || habit?.title || '',
        description: defaultValues?.description || habit?.description || '',
        color: defaultValues?.color || habit?.color || HABIT_COLORS[0].value,
        category: defaultValues?.category || habit?.category || 'personal',
      });
    }
  }, [open, habit, form, defaultValues]);

  const handleSubmit = (data: HabitFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{habit ? 'Edit Habit' : 'New Habit'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Morning meditation"
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add notes or reminders..."
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategorySelector
                      value={field.value as HabitCategory}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {HABIT_COLORS.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => field.onChange(color.value)}
                          className={cn(
                            "w-8 h-8 rounded-full transition-all duration-200",
                            "ring-offset-2 ring-offset-background",
                            field.value === color.value && "ring-2 ring-ring"
                          )}
                          style={{ backgroundColor: color.value }}
                          aria-label={color.name}
                        />
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {habit ? 'Save' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
