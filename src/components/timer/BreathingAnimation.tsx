import { motion } from 'framer-motion';

interface BreathingAnimationProps {
  isActive: boolean;
}

// Calming breathing animation for break time
export function BreathingAnimation({ isActive }: BreathingAnimationProps) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Outer breathing ring */}
      <motion.div
        className="absolute rounded-full bg-primary/5"
        animate={{
          width: ['60%', '90%', '60%'],
          height: ['60%', '90%', '60%'],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Inner breathing ring */}
      <motion.div
        className="absolute rounded-full bg-primary/10"
        animate={{
          width: ['50%', '75%', '50%'],
          height: ['50%', '75%', '50%'],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2,
        }}
      />

      {/* Breathing text guide */}
      <motion.div
        className="absolute bottom-4 left-0 right-0 text-center"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.span
          className="text-xs text-primary/70 uppercase tracking-widest"
          animate={{
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            times: [0, 0.25, 0.75, 1],
          }}
        >
          Breathe
        </motion.span>
      </motion.div>
    </div>
  );
}
