import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

export default function Statistics() {
  const [days, setDays] = useState(30);

  const sessionsQuery = trpc.studySessions.stats.useQuery({ days });
  const stressLogsQuery = trpc.stressLogs.getRange.useQuery({ days });

  const stats = sessionsQuery.data || {
    totalSessions: 0,
    totalPomodoros: 0,
    totalMinutes: 0,
    avgDuration: 0,
  };

  const stressLogs = stressLogsQuery.data || [];

  // Prepare stress/focus chart data
  const chartData = stressLogs
    .reverse()
    .map((log) => ({
      date: format(new Date(log.date), "MMM d"),
      stress: log.stressLevel,
      focus: log.focusLevel,
      sleep: log.sleepHours ? parseFloat(log.sleepHours) : 0,
    }));

  // Calculate averages
  const avgStress = stressLogs.length > 0
    ? Math.round(stressLogs.reduce((sum, log) => sum + log.stressLevel, 0) / stressLogs.length)
    : 0;

  const avgFocus = stressLogs.length > 0
    ? Math.round(stressLogs.reduce((sum, log) => sum + log.focusLevel, 0) / stressLogs.length)
    : 0;

  const avgSleep = stressLogs.length > 0
    ? parseFloat((stressLogs.reduce((sum, log) => sum + (log.sleepHours ? parseFloat(log.sleepHours) : 0), 0) / stressLogs.length).toFixed(1))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Statistics & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track your progress and study patterns</p>
      </div>

      {/* Time Period Selector */}
      <div className="flex gap-2">
        {[7, 14, 30, 90].map((period) => (
          <button
            key={period}
            onClick={() => setDays(period)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              days === period
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {period}d
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      {sessionsQuery.isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Study Time</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {Math.floor(((stats as any).totalMinutes as number) / 60)}h
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {Math.floor(((stats as any).totalMinutes as number) % 60)}m
              </p>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Focus Level</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{avgFocus}/10</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Based on {stressLogs.length} logs</p>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Stress Level</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{avgStress}/10</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {avgStress > 7 ? "High" : avgStress > 4 ? "Moderate" : "Low"}
              </p>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Sleep</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{avgSleep}h</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Per night</p>
            </div>
          </Card>
        </div>
      )}

      {/* Charts */}
      {stressLogsQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : chartData.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No data available. Start logging your stress and focus levels!</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Stress & Focus Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stress & Focus Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="stress"
                  stroke="#ef4444"
                  name="Stress Level"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="focus"
                  stroke="#3b82f6"
                  name="Focus Level"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Sleep Pattern */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sleep Pattern</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sleep" fill="#8b5cf6" name="Sleep (hours)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Insights */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Insights
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {avgStress > 7 && (
                <li>
                  💡 Your stress levels are high. Try taking more breaks and practicing relaxation techniques.
                </li>
              )}
              {avgFocus < 5 && (
                <li>
                  💡 Your focus levels could be improved. Consider studying in shorter, more focused sessions.
                </li>
              )}
              {Number(avgSleep) < 6 && (
                <li>
                  💡 You're getting less than 6 hours of sleep. Adequate sleep is crucial for learning and memory.
                </li>
              )}
              {Number(avgSleep) > 8 && (
                <li>
                  💡 Great sleep schedule! This is ideal for cognitive performance and memory retention.
                </li>
              )}
              {stressLogs.length >= 7 && (
                <li>
                  💡 You've been consistently logging your stress and focus levels. Keep up the self-awareness!
                </li>
              )}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
