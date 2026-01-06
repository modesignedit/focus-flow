import { Bell, BellOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReminders } from '@/hooks/useReminders';

// Daily reminder settings component
export function ReminderSettings() {
  const {
    isEnabled,
    reminderTime,
    permission,
    toggleReminders,
    updateReminderTime,
  } = useReminders();

  const notificationsBlocked = permission === 'denied';

  return (
    <Card className="p-4 glass animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isEnabled ? (
            <Bell className="h-5 w-5 text-primary" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <Label htmlFor="reminder-toggle" className="font-medium cursor-pointer">
              Daily Reminders
            </Label>
            <p className="text-xs text-muted-foreground">
              {notificationsBlocked 
                ? 'Notifications blocked in browser' 
                : 'Get reminded to focus daily'}
            </p>
          </div>
        </div>
        <Switch
          id="reminder-toggle"
          checked={isEnabled}
          onCheckedChange={toggleReminders}
          disabled={notificationsBlocked}
        />
      </div>

      {isEnabled && !notificationsBlocked && (
        <div className="mt-4 flex items-center gap-3">
          <Label htmlFor="reminder-time" className="text-sm whitespace-nowrap">
            Remind at:
          </Label>
          <Input
            id="reminder-time"
            type="time"
            value={reminderTime}
            onChange={(e) => updateReminderTime(e.target.value)}
            className="w-32"
          />
        </div>
      )}
    </Card>
  );
}
