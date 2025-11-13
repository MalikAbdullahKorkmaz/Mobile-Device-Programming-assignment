import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Smile, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";

const MOODS = ["happy", "neutral", "stressed", "tired", "anxious", "focused"];
const MOOD_EMOJIS: Record<string, string> = {
  happy: "😊",
  neutral: "😐",
  stressed: "😰",
  tired: "😴",
  anxious: "😟",
  focused: "🎯",
};

export default function StressLogging() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [stressLevel, setStressLevel] = useState(5);
  const [focusLevel, setFocusLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState("7");
  const [mood, setMood] = useState("neutral");
  const [notes, setNotes] = useState("");

  const createMutation = trpc.stressLogs.create.useMutation();
  const getTodayQuery = trpc.stressLogs.getByDate.useQuery({
    date: new Date(date),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMutation.mutateAsync({
        date: new Date(date),
        stressLevel,
        focusLevel,
        sleepHours,
        mood,
        notes: notes || undefined,
      });

      toast.success("Stress log saved successfully!");
      getTodayQuery.refetch();
    } catch (error) {
      toast.error("Failed to save stress log");
      console.error(error);
    }
  };

  const todayLog = getTodayQuery.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Check-in</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your stress, focus, and mood to understand your study patterns
        </p>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                getTodayQuery.refetch();
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          {/* Stress Level Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Stress Level
              </label>
              <span className="text-2xl font-bold text-red-500">{stressLevel}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Very Calm</span>
              <span>Very Stressed</span>
            </div>
          </div>

          {/* Focus Level Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Focus Level
              </label>
              <span className="text-2xl font-bold text-blue-500">{focusLevel}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={focusLevel}
              onChange={(e) => setFocusLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Very Distracted</span>
              <span>Very Focused</span>
            </div>
          </div>

          {/* Sleep Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sleep Hours
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="7"
            />
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How are you feeling?
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`p-3 rounded-lg text-2xl transition-all ${
                    mood === m
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  title={m}
                >
                  {MOOD_EMOJIS[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional thoughts or observations..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Daily Check-in
          </Button>
        </form>
      </Card>

      {/* Today's Log */}
      {todayLog && (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
          <div className="flex items-start gap-3">
            <Smile className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Today's Check-in Recorded</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                Stress: {todayLog.stressLevel}/10 • Focus: {todayLog.focusLevel}/10 • Sleep: {todayLog.sleepHours}h
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Tips */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Tips for Better Study Sessions</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1">
              <li>✓ Aim for 7-9 hours of sleep for optimal cognitive function</li>
              <li>✓ If stress is high, take a break and practice deep breathing</li>
              <li>✓ Low focus? Try the Pomodoro technique for 25-minute focused sessions</li>
              <li>✓ Track patterns over time to identify what helps you study best</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
