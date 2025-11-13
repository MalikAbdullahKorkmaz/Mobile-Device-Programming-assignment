import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Quizzes() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    totalQuestions: "5",
    timeLimit: "",
    passingScore: "70",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.subject) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description || undefined,
        subject: formData.subject,
        totalQuestions: Number(formData.totalQuestions),
        timeLimit: formData.timeLimit ? Number(formData.timeLimit) : undefined,
        passingScore: Number(formData.passingScore),
      });

      toast.success("Quiz created successfully!");
      setFormData({
        title: "",
        description: "",
        subject: "",
        totalQuestions: "5",
        timeLimit: "",
        passingScore: "70",
      });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to create quiz");
      console.error(error);
    }
  };

  const createMutation = trpc.quizzes.create.useMutation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quizzes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and take quizzes to test your knowledge
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Quiz
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <Input
                  placeholder="e.g., Chapter 5 Biology Quiz"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject *
                </label>
                <Input
                  placeholder="e.g., Biology"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <Textarea
                  placeholder="Add quiz details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Questions
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.totalQuestions}
                    onChange={(e) => setFormData({ ...formData, totalQuestions: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time (min)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Optional"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pass Score %
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Quiz
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Coming Soon */}
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz System Coming Soon</h2>
          <p className="text-gray-600 dark:text-gray-400">
            You can create quizzes, but the full quiz-taking interface is coming in the next update.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Features: Multiple choice, short answer, true/false questions, timed quizzes, and detailed results analysis.
          </p>
        </div>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quiz Types</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>✓ Multiple Choice Questions</li>
            <li>✓ Short Answer Questions</li>
            <li>✓ True/False Questions</li>
            <li>✓ Timed Quizzes</li>
            <li>✓ Instant Feedback</li>
          </ul>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Benefits</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>✓ Test your knowledge regularly</li>
            <li>✓ Identify weak areas</li>
            <li>✓ Track improvement over time</li>
            <li>✓ Prepare for exams</li>
            <li>✓ Share with study groups</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
