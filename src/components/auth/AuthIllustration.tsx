import { motion } from 'framer-motion';

export function AuthIllustration() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-6">
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Middle ring */}
      <motion.div
        className="absolute inset-3 rounded-full bg-primary/15"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />
      
      {/* Center circle with icon */}
      <motion.div
        className="absolute inset-6 rounded-full bg-primary/20 flex items-center justify-center"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      >
        {/* Habit checkmarks floating */}
        <div className="relative w-full h-full">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-primary flex items-center justify-center"
              style={{
                left: `${30 + i * 15}%`,
                top: `${25 + (i % 2) * 30}%`,
              }}
              animate={{
                y: [0, -4, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Floating particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/40"
          style={{
            left: `${20 + i * 20}%`,
            top: `${10 + (i % 2) * 80}%`,
          }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}
