import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Target, Clock, Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Target,
    title: 'Track Your Habits',
    description: 'Create habits you want to build and track your daily progress. Small steps lead to big changes.',
    color: 'text-green-500',
  },
  {
    icon: Clock,
    title: 'Stay Focused',
    description: 'Use the Pomodoro timer to maintain deep focus. Take breaks to recharge and sustain productivity.',
    color: 'text-blue-500',
  },
  {
    icon: Flame,
    title: 'Build Streaks',
    description: 'Complete habits daily to build streaks. The longer your streak, the stronger your momentum.',
    color: 'text-orange-500',
  },
  {
    icon: Sparkles,
    title: 'Earn Achievements',
    description: 'Unlock badges as you reach milestones. Celebrate your wins and keep pushing forward!',
    color: 'text-purple-500',
  },
];

// Onboarding flow for new users
export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('onboarding_complete', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_complete', 'true');
    onComplete();
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 glass">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto mb-6"
            >
              <div className={`inline-flex p-4 rounded-full bg-muted ${step.color}`}>
                <Icon className="h-12 w-12" />
              </div>
            </motion.div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-3">{step.title}</h2>

            {/* Description */}
            <p className="text-muted-foreground mb-8">{step.description}</p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-6 bg-primary'
                      : index < currentStep
                      ? 'w-2 bg-primary/50'
                      : 'w-2 bg-muted'
                  }`}
                  animate={{ scale: index === currentStep ? 1.2 : 1 }}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              {currentStep < steps.length - 1 && (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip
                </Button>
              )}
              <Button onClick={handleNext} className="gap-2">
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
