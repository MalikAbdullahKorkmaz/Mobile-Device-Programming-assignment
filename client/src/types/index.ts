// User related types
export interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

// Study Session types
export interface StudySession {
  id: number;
  userId: number;
  subject: string;
  startTime: Date;
  endTime: Date | null;
  durationMinutes: number;
  pomodoroCount: number;
  focusLevel: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Assignment types
export interface Assignment {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  subject: string;
  dueDate: Date;
  status: "pending" | "in_progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  estimatedHours: string | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Quiz types
export interface Quiz {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  subject: string;
  totalQuestions: number;
  timeLimit: number | null;
  passingScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: number;
  quizId: number;
  questionText: string;
  questionType: "multiple_choice" | "short_answer" | "true_false";
  options: string | null;
  correctAnswer: string;
  explanation: string | null;
  order: number;
  createdAt: Date;
}

export interface QuizAttempt {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number | null;
  passed: boolean;
  answers: string;
  startedAt: Date;
  completedAt: Date;
  createdAt: Date;
}

// Stress Log types
export interface StressLog {
  id: number;
  userId: number;
  date: Date;
  stressLevel: number;
  focusLevel: number;
  sleepHours: string | null;
  mood: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Friendship types
export interface Friendship {
  id: number;
  userId: number;
  friendId: number;
  status: "pending" | "accepted" | "blocked";
  createdAt: Date;
  updatedAt: Date;
}

export interface FriendInfo {
  id: number;
  friendId: number;
  status: "pending" | "accepted" | "blocked";
  friendName: string | null;
  friendEmail: string | null;
}

// Feed types
export interface FeedPost {
  id: number;
  userId: number;
  userName: string | null;
  postType: "study_milestone" | "assignment_completed" | "quiz_passed" | "streak_achievement" | "general_update";
  title: string;
  content: string | null;
  metadata: string | null;
  likes: number;
  visibility: "public" | "friends_only" | "private";
  createdAt: Date;
}

export interface FeedLike {
  id: number;
  postId: number;
  userId: number;
  createdAt: Date;
}
