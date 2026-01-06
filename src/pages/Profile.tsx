import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Logo } from '@/components/auth/Logo';
import { format } from 'date-fns';

// User profile page with avatar and display name editing
export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile, loading, updateProfile, uploadAvatar, removeAvatar } = useProfile();

  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize display name when profile loads
  if (profile && !hasChanges && displayName !== (profile.display_name || '')) {
    setDisplayName(profile.display_name || '');
  }

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({ display_name: displayName || null });
    setSaving(false);

    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
      setHasChanges(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    const { error } = await uploadAvatar(file);
    if (error) {
      toast({ title: 'Upload failed', description: error, variant: 'destructive' });
      return { error };
    }
    toast({ title: 'Avatar updated' });
    return { error: null };
  };

  const handleAvatarRemove = async () => {
    const { error } = await removeAvatar();
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
      return { error };
    }
    toast({ title: 'Avatar removed' });
    return { error: null };
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Logo size="sm" />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-2xl py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Avatar Card */}
            <Card>
              <CardHeader>
                <CardTitle>Avatar</CardTitle>
                <CardDescription>
                  Upload a profile picture (max 2MB)
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <AvatarUpload
                  avatarUrl={profile?.avatar_url || null}
                  displayName={profile?.display_name || null}
                  email={user.email || ''}
                  onUpload={handleAvatarUpload}
                  onRemove={handleAvatarRemove}
                />
              </CardContent>
            </Card>

            {/* Profile Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your display name
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    placeholder="Enter your name"
                    value={displayName}
                    onChange={(e) => handleDisplayNameChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input value={user.email || ''} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Member since
                  </Label>
                  <Input
                    value={user.created_at ? format(new Date(user.created_at), 'MMMM d, yyyy') : ''}
                    disabled
                    className="bg-muted"
                  />
                </div>

                {hasChanges && (
                  <Button onClick={handleSave} disabled={saving} className="w-full">
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
