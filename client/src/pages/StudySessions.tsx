import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Clock, BookOpen } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PomodoroTimer from "@/components/PomodoroTimer";
import { format } from "date-fns";

export default function StudySessions() {
  const [selectedSubject, setSelectedSubject] = useState("General");
  const [showTimer, setShowTimer] = useState(true);

  const sessionsQuery = trpc.studySessions.list.useQuery({ limit: 50 });
  const statsQuery = trpc.studySessions.stats.useQuery({ days: 30 });

  const sessions = sessionsQuery.data || [];
  const stats = statsQuery.data || {
    totalSessions: 0,
    totalPomodoros: 0,
    totalMinutes: 0,
    avgDuration: 0,
  };

  const subjects = Array.from(new Set(sessions.map((s) => s.subject)));

  const handleSessionComplete = () => {
    sessionsQuery.refetch();
    statsQuery.refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Sessions</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track your study time with Pomodoro technique</p>
      </div>

      {/* Stats */}
      {statsQuery.isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Sessions</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {(stats as any).totalSessions || 0}
              </p>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Pomodoros</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {(stats as any).totalPomodoros || 0}
              </p>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Minutes</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {Math.floor(((stats as any).totalMinutes as number) || 0)}
              </p>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Duration</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {Math.floor(((stats as any).avgDuration as number) || 0)}m
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Pomodoro Timer */}
      {showTimer && (
        <div className="flex justify-center">
          <PomodoroTimer
            subject={selectedSubject}
            onSessionComplete={handleSessionComplete}
          />
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Sessions</h2>

        {sessionsQuery.isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : sessions.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No study sessions yet. Start your first session!</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {sessions.map((session) => (
              <Card key={session.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{session.subject}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.durationMinutes} minutes
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {session.pomodoroCount} pomodoros
                      </span>
                      {session.focusLevel && (
                        <span>Focus: {session.focusLevel}/10</span>
                      )}
                    </div>
                    {session.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{session.notes}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(session.startTime), "MMM d, HH:mm")}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
