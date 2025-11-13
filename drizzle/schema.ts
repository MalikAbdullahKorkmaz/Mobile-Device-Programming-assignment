import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  unique,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Study sessions table - tracks Pomodoro sessions and study time
 */
export const studySessions = mysqlTable("study_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(), // e.g., "Mathematics", "English"
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  durationMinutes: int("durationMinutes").notNull(), // Total duration in minutes
  pomodoroCount: int("pomodoroCount").notNull().default(0), // Number of pomodoros completed
  focusLevel: int("focusLevel"), // 1-10 scale, optional
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = typeof studySessions.$inferInsert;

/**
 * Assignments table - tracks homework and assignments
 */
export const assignments = mysqlTable("assignments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  subject: varchar("subject", { length: 255 }).notNull(),
  dueDate: timestamp("dueDate").notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "overdue"]).default("pending").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  estimatedHours: decimal("estimatedHours", { precision: 5, scale: 2 }),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = typeof assignments.$inferInsert;

/**
 * Quizzes table - stores quiz information
 */
export const quizzes = mysqlTable("quizzes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Creator of the quiz
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  subject: varchar("subject", { length: 255 }).notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  timeLimit: int("timeLimit"), // Time limit in minutes, optional
  passingScore: int("passingScore").default(70).notNull(), // Passing score percentage
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;

/**
 * Quiz questions table - individual questions in a quiz
 */
export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quizId").notNull(),
  questionText: text("questionText").notNull(),
  questionType: mysqlEnum("questionType", ["multiple_choice", "short_answer", "true_false"]).notNull(),
  options: text("options"), // JSON array for multiple choice options
  correctAnswer: text("correctAnswer").notNull(),
  explanation: text("explanation"), // Explanation for the correct answer
  order: int("order").notNull(), // Question order in the quiz
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

/**
 * Quiz attempts table - tracks user quiz attempts and scores
 */
export const quizAttempts = mysqlTable("quizAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  quizId: int("quizId").notNull(),
  score: int("score").notNull(), // Score as percentage
  correctAnswers: int("correctAnswers").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  timeTaken: int("timeTaken"), // Time taken in seconds
  passed: boolean("passed").notNull(),
  answers: text("answers"), // JSON object storing user answers
  startedAt: timestamp("startedAt").notNull(),
  completedAt: timestamp("completedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;

/**
 * Stress logs table - daily stress and focus level tracking
 */
export const stressLogs = mysqlTable("stress_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: timestamp("date").notNull(), // Date of the log
  stressLevel: int("stressLevel").notNull(), // 1-10 scale
  focusLevel: int("focusLevel").notNull(), // 1-10 scale
  sleepHours: decimal("sleepHours", { precision: 3, scale: 1 }), // Hours of sleep
  mood: varchar("mood", { length: 50 }), // e.g., "happy", "stressed", "neutral"
  notes: text("notes"), // Additional notes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StressLog = typeof stressLogs.$inferSelect;
export type InsertStressLog = typeof stressLogs.$inferInsert;

/**
 * Friendships table - manages friend relationships
 */
export const friendships = mysqlTable(
  "friendships",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(), // User initiating the friendship
    friendId: int("friendId").notNull(), // Friend being added
    status: mysqlEnum("status", ["pending", "accepted", "blocked"]).default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    uniqueFriendship: unique().on(table.userId, table.friendId),
  })
);

export type Friendship = typeof friendships.$inferSelect;
export type InsertFriendship = typeof friendships.$inferInsert;

/**
 * Feed posts table - social feed for sharing achievements and updates
 */
export const feedPosts = mysqlTable("feed_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  postType: mysqlEnum("postType", [
    "study_milestone",
    "assignment_completed",
    "quiz_passed",
    "streak_achievement",
    "general_update",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  metadata: text("metadata"), // JSON object for additional data (e.g., subject, score)
  likes: int("likes").default(0).notNull(),
  visibility: mysqlEnum("visibility", ["public", "friends_only", "private"]).default("friends_only").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FeedPost = typeof feedPosts.$inferSelect;
export type InsertFeedPost = typeof feedPosts.$inferInsert;

/**
 * Feed likes table - tracks who liked which posts
 */
export const feedLikes = mysqlTable(
  "feed_likes",
  {
    id: int("id").autoincrement().primaryKey(),
    postId: int("postId").notNull(),
    userId: int("userId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    uniqueLike: unique().on(table.postId, table.userId),
  })
);

export type FeedLike = typeof feedLikes.$inferSelect;
export type InsertFeedLike = typeof feedLikes.$inferInsert;

/**
 * Leaderboard view - aggregated user statistics for ranking
 * This is a computed view based on study sessions, assignments, and quiz attempts
 */
export interface LeaderboardEntry {
  userId: number;
  userName: string | null;
  totalStudyMinutes: number;
  completedAssignments: number;
  averageQuizScore: number;
  totalPomodoros: number;
  rank: number;
}

/**
 * Daily survey table - tracks daily mood and focus surveys
 */
export const dailySurveys = mysqlTable("daily_surveys", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: timestamp("date").notNull(),
  mood: varchar("mood", { length: 50 }).notNull(), // e.g., "happy", "stressed", "neutral"
  focusRating: int("focusRating").notNull(), // 1-10 scale
  energyLevel: int("energyLevel").notNull(), // 1-10 scale
  notes: text("notes"),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailySurvey = typeof dailySurveys.$inferSelect;
export type InsertDailySurvey = typeof dailySurveys.$inferInsert;

/**
 * Study materials table - stores uploaded notes and study materials
 */
export const studyMaterials = mysqlTable("study_materials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  subject: varchar("subject", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(), // S3 URL
  fileKey: text("fileKey").notNull(), // S3 file key
  fileType: varchar("fileType", { length: 50 }).notNull(), // pdf, doc, image, etc.
  fileSize: int("fileSize").notNull(), // in bytes
  tags: text("tags"), // JSON array of tags
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudyMaterial = typeof studyMaterials.$inferSelect;
export type InsertStudyMaterial = typeof studyMaterials.$inferInsert;
