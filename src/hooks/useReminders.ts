import { useState, useEffect, useCallback } from 'react';

// Hook for managing daily reminder notifications
export function useReminders() {
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem('reminders_enabled') === 'true';
  });
  const [reminderTime, setReminderTime] = useState(() => {
    return localStorage.getItem('reminder_time') || '09:00';
  });
  const [permission, setPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, []);

  // Enable/disable reminders
  const toggleReminders = useCallback(async (enabled: boolean) => {
    if (enabled && permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }
    
    setIsEnabled(enabled);
    localStorage.setItem('reminders_enabled', String(enabled));
  }, [permission, requestPermission]);

  // Update reminder time
  const updateReminderTime = useCallback((time: string) => {
    setReminderTime(time);
    localStorage.setItem('reminder_time', time);
  }, []);

  // Check and show reminder if it's time
  useEffect(() => {
    if (!isEnabled || permission !== 'granted') return;

    const checkReminder = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const lastShown = localStorage.getItem('last_reminder_date');
      const today = now.toISOString().split('T')[0];

      if (currentTime === reminderTime && lastShown !== today) {
        new Notification('Time to build habits! 🌟', {
          body: 'Start your day with a focus session and complete your habits.',
          icon: '/favicon.ico',
          tag: 'daily-reminder'
        });
        localStorage.setItem('last_reminder_date', today);
      }
    };

    // Check every minute
    const interval = setInterval(checkReminder, 60000);
    checkReminder(); // Check immediately

    return () => clearInterval(interval);
  }, [isEnabled, reminderTime, permission]);

  return {
    isEnabled,
    reminderTime,
    permission,
    toggleReminders,
    updateReminderTime,
    requestPermission,
  };
}
