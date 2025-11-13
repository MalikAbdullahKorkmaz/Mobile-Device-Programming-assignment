import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Smile, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";

const MOODS = [
  { id: "very_bad", emoji: "😭", label: "Very Bad" },
  { id: "bad", emoji: "😞", label: "Bad" },
  { id: "neutral", emoji: "😐", label: "Neutral" },
  { id: "good", emoji: "😊", label: "Good" },
  { id: "very_good", emoji: "😄", label: "Very Good" },
];

export default function DailySurvey() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [mood, setMood] = useState("neutral");
  const [focusRating, setFocusRating] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [notes, setNotes] = useState("");

  const submitMutation = trpc.surveys.submitDailySurvey.useMutation();
  const getTodayQuery = trpc.surveys.getTodaySurvey.useQuery({
    date: new Date(date),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitMutation.mutateAsync({
        date: new Date(date),
        mood,
        focusRating,
        energyLevel,
        notes: notes || undefined,
      });

      toast.success("Daily survey submitted successfully!");
      getTodayQuery.refetch();
      setNotes("");
    } catch (error) {
      toast.error("Failed to submit survey");
      console.error(error);
    }
  };

  const todaySurvey = getTodayQuery.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Survey</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          How are you feeling today? Help us understand your study patterns.
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

          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How are you feeling?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    mood === m.id
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  title={m.label}
                >
                  <div className="text-3xl mb-1">{m.emoji}</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {m.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Focus Rating Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Focus Level
              </label>
              <span className="text-2xl font-bold text-blue-500">{focusRating}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={focusRating}
              onChange={(e) => setFocusRating(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Very Distracted</span>
              <span>Very Focused</span>
            </div>
          </div>

          {/* Energy Level Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Energy Level
              </label>
              <span className="text-2xl font-bold text-green-500">{energyLevel}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Very Tired</span>
              <span>Very Energetic</span>
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
              placeholder="Any additional thoughts about your day..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit Daily Survey
          </Button>
        </form>
      </Card>

      {/* Today's Survey */}
      {todaySurvey && (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
          <div className="flex items-start gap-3">
            <Smile className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Today's Survey Recorded</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                Mood: {todaySurvey.mood} • Focus: {todaySurvey.focusRating}/10 • Energy: {todaySurvey.energyLevel}/10
              </p>
              {todaySurvey.notes && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">
                  "{todaySurvey.notes}"
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Tips */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Daily Survey Tips</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1">
              <li>✓ Fill out your daily survey at the same time each day for consistency</li>
              <li>✓ Be honest about your mood and energy levels</li>
              <li>✓ Use notes to track what affects your focus and energy</li>
              <li>✓ Review your patterns weekly to identify trends</li>
              <li>✓ Low energy? Consider taking breaks or adjusting your study schedule</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
