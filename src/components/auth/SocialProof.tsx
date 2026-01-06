import { motion } from 'framer-motion';
import { Users, CheckCircle2, Flame } from 'lucide-react';

const stats = [
  { icon: Users, value: "2,500+", label: "Active users" },
  { icon: CheckCircle2, value: "50K+", label: "Habits tracked" },
  { icon: Flame, value: "1M+", label: "Streaks achieved" },
];

export function SocialProof() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-8 pt-6 border-t border-border/50"
    >
      {/* Stats row */}
      <div className="flex justify-center gap-6 sm:gap-8 mb-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-1 text-primary">
              <stat.icon className="w-3.5 h-3.5" />
              <span className="text-sm font-semibold">{stat.value}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Avatar stack with text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        className="flex items-center justify-center gap-2"
      >
        <div className="flex -space-x-2">
          {['🧑‍💻', '👩‍🎨', '👨‍🔬', '👩‍💼'].map((emoji, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs"
            >
              {emoji}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Join thousands building better habits
        </p>
      </motion.div>
    </motion.div>
  );
}
