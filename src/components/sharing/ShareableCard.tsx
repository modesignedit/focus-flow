import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, Copy, Check, Twitter, Facebook, Flame, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Achievement } from '@/components/achievements/AchievementBadge';

interface ShareableCardProps {
  type: 'achievement' | 'streak';
  achievement?: Achievement;
  streak?: number;
  userName?: string;
}

// The visual card that will be shared
function ShareCard({ type, achievement, streak, userName }: ShareableCardProps) {
  return (
    <div 
      className="w-full aspect-[1.91/1] bg-gradient-to-br from-primary/20 via-background to-primary/10 rounded-xl p-6 flex flex-col justify-between border border-border relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 text-8xl">
          {type === 'achievement' ? achievement?.icon : '🔥'}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground relative z-10">
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-bold">F</span>
        </div>
        <span className="font-medium">FocusFlow</span>
      </div>

      {/* Main content */}
      <div className="text-center relative z-10">
        {type === 'achievement' && achievement && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-6xl mb-3"
            >
              {achievement.icon}
            </motion.div>
            <h2 className="text-2xl font-bold mb-1">{achievement.title}</h2>
            <p className="text-muted-foreground">{achievement.description}</p>
          </>
        )}

        {type === 'streak' && streak !== undefined && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="flex items-center justify-center gap-2 mb-2"
            >
              <Flame className="h-12 w-12 text-orange-500" />
              <span className="text-6xl font-bold">{streak}</span>
            </motion.div>
            <h2 className="text-2xl font-bold mb-1">Day Streak!</h2>
            <p className="text-muted-foreground">Building habits one day at a time</p>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground relative z-10">
        <span>{userName ? `@${userName}` : 'Track your habits'}</span>
        <span className="flex items-center gap-1">
          <Trophy className="h-3 w-3" />
          focusflow.app
        </span>
      </div>
    </div>
  );
}

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'achievement' | 'streak';
  achievement?: Achievement;
  streak?: number;
  userName?: string;
}

export function ShareDialog({ 
  open, 
  onOpenChange, 
  type, 
  achievement, 
  streak,
  userName 
}: ShareDialogProps) {
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const shareText = type === 'achievement' && achievement
    ? `🏆 I just unlocked "${achievement.title}" on FocusFlow! ${achievement.description}`
    : `🔥 I'm on a ${streak} day streak on FocusFlow! Building habits one day at a time.`;

  const shareUrl = window.location.origin;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      toast({ title: 'Copied to clipboard!' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: type === 'achievement' ? achievement?.title : `${streak} Day Streak`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    }
  };

  const downloadCard = async () => {
    // Create a canvas from the card
    if (!cardRef.current) return;

    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `focusflow-${type}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({ title: 'Card downloaded!' });
    } catch (err) {
      toast({ title: 'Failed to download', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your {type === 'achievement' ? 'Achievement' : 'Streak'}
          </DialogTitle>
        </DialogHeader>

        {/* Preview card */}
        <div ref={cardRef} className="my-4">
          <ShareCard 
            type={type} 
            achievement={achievement} 
            streak={streak}
            userName={userName}
          />
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={shareToTwitter} variant="outline" className="gap-2">
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          <Button onClick={shareToFacebook} variant="outline" className="gap-2">
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
          <Button onClick={copyToClipboard} variant="outline" className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button onClick={downloadCard} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>

        {/* Native share (mobile) */}
        {navigator.share && (
          <Button onClick={nativeShare} className="w-full gap-2 mt-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Share button component
interface ShareButtonProps {
  type: 'achievement' | 'streak';
  achievement?: Achievement;
  streak?: number;
  userName?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
}

export function ShareButton({ 
  type, 
  achievement, 
  streak, 
  userName,
  variant = 'ghost',
  size = 'sm'
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)} className="gap-1.5">
        <Share2 className="h-4 w-4" />
        {size !== 'icon' && 'Share'}
      </Button>
      <ShareDialog
        open={open}
        onOpenChange={setOpen}
        type={type}
        achievement={achievement}
        streak={streak}
        userName={userName}
      />
    </>
  );
}
