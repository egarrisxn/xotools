"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function BeautifulTimer() {
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
    <div className="w-full max-w-md space-y-12">
      {/* Timer display */}
      <div className="relative aspect-square w-full rounded-full bg-white/80 shadow-lg backdrop-blur-sm">
        <svg className="size-full" viewBox="0 0 100 100">
          <circle
            className="stroke-current text-black/5"
            strokeWidth="1"
            cx="50"
            cy="50"
            r="48"
            fill="transparent"
          />
          <circle
            className="stroke-current text-cyan-300"
            strokeWidth="1"
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
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-6xl font-light tracking-tight text-gray-800">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Preset options */}
      <div className="grid grid-cols-4 gap-4">
        {[10, 15, 20, 30].map((minutes) => (
          <button
            key={minutes}
            onClick={() => setPresetDuration(minutes)}
            className={`py-4 text-lg font-light tracking-wide ${
              duration === minutes * 60
                ? "border-b-2 border-cyan-300 text-gray-800"
                : "border-b-2 border-transparent text-gray-500"
            } transition-colors hover:text-gray-800`}
          >
            {minutes}m
          </button>
        ))}
      </div>

      {/* Control buttons */}
      <div className="flex justify-center space-x-8">
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="rounded-full bg-white/80 p-4 backdrop-blur-sm transition-colors hover:bg-white/90"
        >
          {isRunning ? <Pause className="size-6" /> : <Play className="size-6" />}
        </button>
        <button
          onClick={resetTimer}
          className="rounded-full bg-white/80 p-4 backdrop-blur-sm transition-colors hover:bg-white/90"
        >
          <RotateCcw className="size-6" />
        </button>
      </div>
    </div>
  );
}
