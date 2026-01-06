import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Wind, Waves, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

type SoundType = 'rain' | 'wind' | 'ocean' | 'lofi' | null;

interface AmbientSound {
  id: SoundType;
  label: string;
  icon: React.ElementType;
  url: string;
}

// Free ambient sound URLs (royalty-free)
const SOUNDS: AmbientSound[] = [
  { 
    id: 'rain', 
    label: 'Rain', 
    icon: CloudRain,
    url: 'https://cdn.freesound.org/previews/531/531947_5828667-lq.mp3'
  },
  { 
    id: 'wind', 
    label: 'Wind', 
    icon: Wind,
    url: 'https://cdn.freesound.org/previews/659/659691_9497060-lq.mp3'
  },
  { 
    id: 'ocean', 
    label: 'Ocean', 
    icon: Waves,
    url: 'https://cdn.freesound.org/previews/527/527409_2193266-lq.mp3'
  },
  { 
    id: 'lofi', 
    label: 'Lo-Fi', 
    icon: Music,
    url: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3'
  },
];

interface AmbientSoundButtonProps {
  isTimerRunning: boolean;
}

export function AmbientSoundButton({ isTimerRunning }: AmbientSoundButtonProps) {
  const [activeSound, setActiveSound] = useState<SoundType>(null);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle sound playback
  useEffect(() => {
    if (activeSound && isTimerRunning) {
      const sound = SOUNDS.find(s => s.id === activeSound);
      if (sound) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(sound.url);
        audioRef.current.loop = true;
        audioRef.current.volume = volume / 100;
        audioRef.current.play().catch(console.error);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [activeSound, isTimerRunning]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const toggleSound = (soundId: SoundType) => {
    setActiveSound(prev => prev === soundId ? null : soundId);
  };

  const ActiveIcon = activeSound 
    ? SOUNDS.find(s => s.id === activeSound)?.icon || Volume2
    : Volume2;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-8 w-8 transition-colors",
            activeSound && isTimerRunning && "text-primary bg-primary/10"
          )}
        >
          {activeSound && isTimerRunning ? (
            <ActiveIcon className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Ambient Sounds
        </DropdownMenuLabel>
        {SOUNDS.map((sound) => (
          <DropdownMenuItem
            key={sound.id}
            onClick={() => toggleSound(sound.id)}
            className={cn(
              "gap-2 cursor-pointer",
              activeSound === sound.id && "bg-primary/10 text-primary"
            )}
          >
            <sound.icon className="h-4 w-4" />
            {sound.label}
            {activeSound === sound.id && (
              <span className="ml-auto text-xs">●</span>
            )}
          </DropdownMenuItem>
        ))}
        
        {activeSound && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-2">
              <div className="flex items-center gap-2">
                <VolumeX className="h-3 w-3 text-muted-foreground" />
                <Slider
                  value={[volume]}
                  onValueChange={([v]) => setVolume(v)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <Volume2 className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
