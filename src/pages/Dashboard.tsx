import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { FocusTimer } from '@/components/FocusTimer';
import { HabitList } from '@/components/HabitList';
import { WeeklyChart } from '@/components/WeeklyChart';
import { FocusHistory } from '@/components/FocusHistory';
import { StreakDisplay } from '@/components/StreakDisplay';
import { ReminderSettings } from '@/components/ReminderSettings';
import { ProgressReports } from '@/components/reports/ProgressReports';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { AchievementsButton, AchievementsPanel } from '@/components/achievements/AchievementsPanel';
import { AchievementNotification } from '@/components/achievements/AchievementNotification';
import { useHabits } from '@/hooks/useHabits';
import { useStreak } from '@/hooks/useStreak';
import { useAchievements } from '@/hooks/useAchievements';
import { useFocusTimer } from '@/hooks/useFocusTimer';
import { format } from 'date-fns';

// Main dashboard page with timer, habits, and stats
export default function Dashboard() {
  const today = format(new Date(), 'EEEE, MMMM d');
  const [showAchievements, setShowAchievements] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Check if user needs onboarding
  useEffect(() => {
    const completed = localStorage.getItem('onboarding_complete');
    if (!completed) {
      setShowOnboarding(true);
    }
  }, []);
  
  // Get data for achievements
  const { habits } = useHabits();
  const { overallStreak } = useStreak(habits);
  const { todayFocusMinutes } = useFocusTimer(25);
  
  const { 
    achievements, 
    unlockedCount, 
    newAchievement, 
    hasNewAchievement,
    dismissNotification,
    markAsSeen 
  } = useAchievements(habits, todayFocusMinutes, overallStreak);

  const handleOpenAchievements = () => {
    setShowAchievements(true);
    markAsSeen();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Onboarding for new users */}
      {showOnboarding && (
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
      )}
      
      {/* Achievement notification */}
      <AchievementNotification 
        achievement={newAchievement} 
        onDismiss={dismissNotification} 
      />
      
      <main className="container py-6 space-y-6 pb-24">
        {/* Welcome section with achievements button */}
        <section className="animate-fade-in flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{today}</p>
            <h1 className="text-2xl sm:text-3xl font-semibold mt-1">
              Ready to focus?
            </h1>
          </div>
          <AchievementsButton 
            unlockedCount={unlockedCount} 
            onClick={handleOpenAchievements}
            hasNew={hasNewAchievement}
          />
        </section>

        {/* Focus timer */}
        <section>
          <FocusTimer />
        </section>

        {/* Streak and reminders row */}
        <section className="grid sm:grid-cols-2 gap-4">
          <StreakDisplay />
          <ReminderSettings />
        </section>

        {/* Progress Reports */}
        <section>
          <ProgressReports />
        </section>

        {/* Weekly progress chart */}
        <section>
          <WeeklyChart />
        </section>

        {/* Focus session history */}
        <section>
          <FocusHistory />
        </section>

        {/* Habits list */}
        <section>
          <HabitList />
        </section>
      </main>

      {/* Achievements panel */}
      <AchievementsPanel
        achievements={achievements}
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
    </div>
  );
}
