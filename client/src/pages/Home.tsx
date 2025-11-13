import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Clock, BarChart3, Users, Zap, Target } from "lucide-react";
import { Link } from "wouter";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={APP_LOGO} alt={APP_TITLE} className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{APP_TITLE}</h1>
            </div>
            <Button asChild className="bg-blue-500 hover:bg-blue-600">
              <a href={getLoginUrl()}>Sign In</a>
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white">
              Master Your Study Time
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              StudyPulse combines Pomodoro technique, assignment tracking, and stress monitoring to help you study smarter and achieve your academic goals.
            </p>
            <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
              <a href={getLoginUrl()}>Get Started Free</a>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pomodoro Timer</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Use the proven 25-minute work sessions with 5-minute breaks to maximize productivity.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assignment Planning</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Organize your assignments by subject, priority, and due date. Never miss a deadline.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Learning Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track your progress with detailed statistics, heatmaps, and performance trends.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stress Monitoring</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Log your daily stress and focus levels to understand your study patterns.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quiz & Testing</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create and take quizzes to test your knowledge and track your improvement.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Features</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with friends, share achievements, and stay motivated together.
                </p>
              </div>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Study Habits?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of students who are already using StudyPulse to achieve their academic goals.
            </p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <a href={getLoginUrl()}>Start Your Free Journey</a>
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 StudyPulse. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Authenticated view - Dashboard
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || "Student"}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here's your study dashboard. Keep up the great work!
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/study-sessions">
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white h-20 flex flex-col items-center justify-center gap-2">
            <Clock className="w-6 h-6" />
            <span>Start Study Session</span>
          </Button>
        </Link>

        <Link href="/assignments">
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white h-20 flex flex-col items-center justify-center gap-2">
            <Target className="w-6 h-6" />
            <span>View Assignments</span>
          </Button>
        </Link>

        <Link href="/statistics">
          <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white h-20 flex flex-col items-center justify-center gap-2">
            <BarChart3 className="w-6 h-6" />
            <span>View Statistics</span>
          </Button>
        </Link>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How StudyPulse Works</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>✓ Use Pomodoro timer for focused study sessions</li>
            <li>✓ Track your assignments and deadlines</li>
            <li>✓ Monitor your stress and focus levels daily</li>
            <li>✓ Review your progress with analytics</li>
            <li>✓ Connect with friends and share achievements</li>
          </ul>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Study Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>🎯 Use 25-minute Pomodoro sessions for best results</li>
            <li>📝 Break large assignments into smaller tasks</li>
            <li>🎓 Take quizzes regularly to test your knowledge</li>
            <li>😌 Monitor stress levels and take breaks</li>
            <li>👥 Study with friends for motivation</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
