import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { trpc } from "@/lib/trpc";

const WORK_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes

interface PomodoroTimerProps {
  subject?: string;
  onSessionComplete?: (durationMinutes: number, pomodoroCount: number) => void;
}

export default function PomodoroTimer({ subject = "General", onSessionComplete }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  const createSessionMutation = trpc.studySessions.create.useMutation();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Session ended
      if (isWorkSession) {
        setSessionsCompleted((prev) => prev + 1);
        setIsWorkSession(false);
        setTimeLeft(BREAK_DURATION);
      } else {
        setIsWorkSession(true);
        setTimeLeft(WORK_DURATION);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isWorkSession]);

  const handleStart = () => {
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = async () => {
    setIsRunning(false);
    setTimeLeft(isWorkSession ? WORK_DURATION : BREAK_DURATION);

    // Save session if work session was completed
    if (sessionStartTime && sessionsCompleted > 0) {
      const endTime = new Date();
      const durationMinutes = Math.floor((endTime.getTime() - sessionStartTime.getTime()) / 60000);

      try {
        await createSessionMutation.mutateAsync({
          subject,
          startTime: sessionStartTime,
          endTime,
          durationMinutes,
          pomodoroCount: sessionsCompleted,
        });

        if (onSessionComplete) {
          onSessionComplete(durationMinutes, sessionsCompleted);
        }
      } catch (error) {
        console.error("Failed to save session:", error);
      }
    }

    setSessionStartTime(null);
    setSessionsCompleted(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = isWorkSession
    ? ((WORK_DURATION - timeLeft) / WORK_DURATION) * 100
    : ((BREAK_DURATION - timeLeft) / BREAK_DURATION) * 100;

  return (
    <Card className="w-full max-w-md mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center space-y-6">
        {/* Subject */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Subject</h3>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{subject}</p>
        </div>

        {/* Session Type */}
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {isWorkSession ? "Work Session" : "Break Time"}
          </p>
        </div>

        {/* Timer Display */}
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${(progressPercentage / 100) * 282.7} 282.7`}
              className={isWorkSession ? "text-blue-500" : "text-green-500"}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white font-mono">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {sessionsCompleted} pomodoros
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              size="lg"
            >
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              size="lg"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p>Complete {isWorkSession ? "25 minutes" : "5 minutes"} to advance</p>
        </div>
      </div>
    </Card>
  );
}
