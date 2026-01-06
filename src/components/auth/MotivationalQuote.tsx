import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  { text: "Small steps every day lead to big changes.", author: "Unknown" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Progress, not perfection.", author: "Unknown" },
  { text: "Habits are the compound interest of self-improvement.", author: "James Clear" },
];

export function MotivationalQuote() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-16 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center px-4"
        >
          <p className="text-sm text-muted-foreground italic">"{quotes[currentIndex].text}"</p>
          <p className="text-xs text-muted-foreground/70 mt-1">— {quotes[currentIndex].author}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
