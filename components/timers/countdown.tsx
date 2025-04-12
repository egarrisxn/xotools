"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface DigitReelProps {
  value: string;
  className?: string;
}

export function DigitReel({ value, className }: DigitReelProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setPrevValue(value);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  // Generate the digits that will appear in the reel
  // For a digit like "5", we'll show "3", "4", "5", "6", "7" in the reel
  const generateReelDigits = (currentDigit: string) => {
    const digit = Number.parseInt(currentDigit, 10);
    const digits = [];

    // Add digits before current
    for (let i = 2; i > 0; i--) {
      const prevDigit = (digit - i + 10) % 10;
      digits.push(prevDigit.toString());
    }

    // Add current digit
    digits.push(currentDigit);

    // Add digits after current
    for (let i = 1; i <= 2; i++) {
      const nextDigit = (digit + i) % 10;
      digits.push(nextDigit.toString());
    }

    return digits;
  };

  const reelDigits = generateReelDigits(value);

  return (
    <div className={cn("relative h-28 w-20 overflow-hidden", className)}>
      {/* Top gradient overlay */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-12 bg-gradient-to-b from-black to-transparent"></div>

      <div className="relative flex h-full items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute"
          >
            <div className="flex flex-col items-center">
              {reelDigits.map((digit, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-7xl font-normal transition-all duration-300",
                    index === 2 ? "text-white" : "text-gray-600",
                    index < 2 ? "-mb-4" : "",
                    index > 2 ? "-mt-4" : "",
                  )}
                >
                  {digit}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom gradient overlay */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-12 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
}

interface CountdownTimerProps {
  initialMinutes: number;
  initialSeconds: number;
}

export function Countdown({ initialMinutes = 0, initialSeconds = 0 }: CountdownTimerProps) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          clearInterval(interval as NodeJS.Timeout);
          setIsActive(false);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  // Format numbers to always have two digits
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center">
        <div className="-mr-2">
          <DigitReel value={formattedMinutes[0]} />
        </div>
        <div className="-mx-2">
          <DigitReel value={formattedMinutes[1]} />
        </div>
        <div className="mx-1 text-7xl font-normal text-white">:</div>
        <div className="-mx-2">
          <DigitReel value={formattedSeconds[0]} />
        </div>
        <div className="-ml-2">
          <DigitReel value={formattedSeconds[1]} />
        </div>
      </div>
    </div>
  );
}

export default function CountdownTimer() {
  const [initialTime, setInitialTime] = useState({ minutes: 15, seconds: 42 });

  return (
    <div className="flex items-center justify-center gap-4 rounded-md border-4 bg-black px-16 py-20 text-white shadow-md">
      <div className="text-2xl">Timer ends in:</div>
      <Countdown initialMinutes={initialTime.minutes} initialSeconds={initialTime.seconds} />
    </div>
  );
}
