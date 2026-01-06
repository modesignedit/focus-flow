import { useState, useCallback, useRef } from 'react';

// Sound effect URLs (short, royalty-free achievement sounds)
const SOUNDS = {
  complete: 'https://cdn.freesound.org/previews/341/341695_5858296-lq.mp3',
  streak: 'https://cdn.freesound.org/previews/270/270402_5123851-lq.mp3',
  levelUp: 'https://cdn.freesound.org/previews/341/341695_5858296-lq.mp3',
};

interface CelebrationState {
  showConfetti: boolean;
  soundEnabled: boolean;
}

export function useCelebration() {
  const [state, setState] = useState<CelebrationState>({
    showConfetti: false,
    soundEnabled: true,
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((type: keyof typeof SOUNDS) => {
    if (!state.soundEnabled) return;
    
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(SOUNDS[type]);
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    } catch (e) {
      // Ignore audio errors
    }
  }, [state.soundEnabled]);

  const celebrate = useCallback((options?: { sound?: keyof typeof SOUNDS }) => {
    // Trigger confetti
    setState(prev => ({ ...prev, showConfetti: true }));
    
    // Play sound
    playSound(options?.sound || 'complete');

    // Auto-clear confetti
    setTimeout(() => {
      setState(prev => ({ ...prev, showConfetti: false }));
    }, 2000);
  }, [playSound]);

  const toggleSound = useCallback(() => {
    setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  return {
    showConfetti: state.showConfetti,
    soundEnabled: state.soundEnabled,
    celebrate,
    toggleSound,
    clearConfetti: () => setState(prev => ({ ...prev, showConfetti: false })),
  };
}
