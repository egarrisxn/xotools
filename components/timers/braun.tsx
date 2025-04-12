"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BraunTimer() {
  const [duration, setDuration] = useState(600); // 10 minutes default
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const setPresetDuration = (minutes: number) => {
    const newDuration = minutes * 60;
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center gap-8">
      <div className="relative size-64 rounded-full border-4 bg-gray-400 text-gray-600 shadow-md dark:bg-gray-600 dark:text-gray-400">
        {/* Timer face */}
        <svg className="size-full" viewBox="0 0 100 100">
          <circle
            className="stroke-current text-gray-600 dark:text-gray-400"
            strokeWidth="2"
            cx="50"
            cy="50"
            r="48"
            fill="transparent"
          />
          <circle
            className="stroke-current text-blue-500"
            strokeWidth="2"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="48"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * 48}`}
            strokeDashoffset={`${2 * Math.PI * 48 * (1 - progress / 100)}`}
            transform="rotate(-90 50 50)"
          />
        </svg>
        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-4xl font-bold text-gray-600 dark:text-gray-400">
            {formatTime(timeLeft)}
          </span>
        </div>
        {/* Bezel markers */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute h-4 w-1 bg-gray-600 dark:bg-gray-400"
            style={{
              top: "4px",
              left: "50%",
              transform: `translateX(-50%) rotate(${i * 90}deg)`,
              transformOrigin: "bottom",
            }}
          />
        ))}
      </div>
      {/* Control buttons */}
      <div className="flex flex-row gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={isRunning ? pauseTimer : startTimer}
          className="size-12 rounded-full"
        >
          {isRunning ? (
            <Pause className="size-6 text-red-500" />
          ) : (
            <Play className="size-6 text-blue-500" />
          )}
        </Button>
        <Button variant="outline" size="icon" onClick={resetTimer} className="size-12 rounded-full">
          <RotateCcw className="size-6 text-yellow-500" />
        </Button>
      </div>
      {/* Preset buttons */}
      <div className="flex flex-row gap-2">
        {[10, 15, 20, 30].map((minutes) => (
          <Button
            key={minutes}
            variant="outline"
            onClick={() => setPresetDuration(minutes)}
            className={`size-12 rounded-full ${
              duration === minutes * 60
                ? "bg-gray-600 text-gray-400 dark:bg-gray-400 dark:text-gray-600"
                : "bg-gray-400 text-gray-600 dark:bg-gray-600 dark:text-gray-400"
            } border-2 border-gray-500 hover:bg-gray-500 dark:hover:bg-gray-500`}
          >
            {minutes}
          </Button>
        ))}
      </div>
    </div>
  );
}
