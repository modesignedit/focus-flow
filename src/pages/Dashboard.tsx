import { Header } from '@/components/Header';
import { FocusTimer } from '@/components/FocusTimer';
import { HabitList } from '@/components/HabitList';
import { WeeklyChart } from '@/components/WeeklyChart';
import { format } from 'date-fns';

// Main dashboard page with timer, habits, and stats
export default function Dashboard() {
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 space-y-6 pb-24">
        {/* Welcome section */}
        <section className="animate-fade-in">
          <p className="text-sm text-muted-foreground">{today}</p>
          <h1 className="text-2xl sm:text-3xl font-semibold mt-1">
            Ready to focus?
          </h1>
        </section>

        {/* Focus timer */}
        <section>
          <FocusTimer />
        </section>

        {/* Weekly progress chart */}
        <section>
          <WeeklyChart />
        </section>

        {/* Habits list */}
        <section>
          <HabitList />
        </section>
      </main>
    </div>
  );
}
