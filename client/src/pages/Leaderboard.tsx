import { Card } from "@/components/ui/card";
import { Loader2, Trophy, Medal } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Leaderboard() {
  const leaderboardQuery = trpc.leaderboard.getFriendLeaderboard.useQuery({
    limit: 50,
  });

  const entries = leaderboardQuery.data || [];

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          See how you compare with your friends
        </p>
      </div>

      {/* Leaderboard */}
      {leaderboardQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : entries.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No friends yet. Add friends to see the leaderboard!
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card
              key={entry.userId}
              className={`p-4 flex items-center justify-between transition-all ${
                entry.rank <= 3
                  ? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900 dark:to-amber-900 border-yellow-200 dark:border-yellow-700"
                  : "hover:shadow-lg"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg">
                  {getMedalIcon(entry.rank) || entry.rank}
                </div>

                {/* User Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {entry.userName || "Anonymous"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    #{entry.rank} • {Math.floor((entry.totalStudyMinutes as number) / 60)}h study time
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-right">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Study Time</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {Math.floor((entry.totalStudyMinutes as number) / 60)}h
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Assignments</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {entry.completedAssignments}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Avg Quiz</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {Math.round((entry.averageQuizScore as number) * 10) / 10}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Pomodoros</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {entry.totalPomodoros}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Leaderboard Metrics</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>
            <strong>Study Time:</strong> Total hours spent in study sessions
          </li>
          <li>
            <strong>Assignments:</strong> Number of completed assignments
          </li>
          <li>
            <strong>Avg Quiz Score:</strong> Average score across all quiz attempts
          </li>
          <li>
            <strong>Pomodoros:</strong> Total Pomodoro cycles completed
          </li>
        </ul>
      </Card>
    </div>
  );
}
