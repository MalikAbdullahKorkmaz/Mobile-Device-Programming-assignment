import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { leaderboardRouter } from "./routers/leaderboard";
import { surveysRouter } from "./routers/surveys";
import { materialsRouter } from "./routers/materials";
import { z } from "zod";
import {
  createStudySession,
  getUserStudySessions,
  getStudySessionStats,
  createAssignment,
  getUserAssignments,
  updateAssignmentStatus,
  createQuiz,
  getQuizById,
  getQuizQuestions,
  createQuizQuestion,
  createQuizAttempt,
  getUserQuizAttempts,
  createStressLog,
  getStressLogsByDate,
  getStressLogsRange,
  addFriend,
  acceptFriendRequest,
  getUserFriends,
  createFeedPost,
  getFeedPosts,
  likeFeedPost,
  unlikeFeedPost,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ Study Sessions ============
  studySessions: router({
    create: protectedProcedure
      .input(
        z.object({
          subject: z.string().min(1),
          startTime: z.date(),
          endTime: z.date().optional(),
          durationMinutes: z.number().positive(),
          pomodoroCount: z.number().nonnegative().default(0),
          focusLevel: z.number().int().min(1).max(10).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return createStudySession(ctx.user.id, input);
      }),

    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ ctx, input }) => {
        return getUserStudySessions(ctx.user.id, input.limit);
      }),

    stats: protectedProcedure
      .input(z.object({ days: z.number().default(30) }))
      .query(async ({ ctx, input }) => {
        const result = await getStudySessionStats(ctx.user.id, input.days);
        return result[0] || {};
      }),
  }),

  // ============ Assignments ============
  assignments: router({
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          subject: z.string().min(1),
          dueDate: z.date(),
          priority: z.enum(["low", "medium", "high"]).default("medium"),
          estimatedHours: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return createAssignment(ctx.user.id, {
          ...input,
          status: "pending",
        });
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserAssignments(ctx.user.id);
    }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          assignmentId: z.number(),
          status: z.enum(["pending", "in_progress", "completed", "overdue"]),
        })
      )
      .mutation(async ({ input }) => {
        return updateAssignmentStatus(input.assignmentId, input.status);
      }),
  }),

  // ============ Quizzes ============
  quizzes: router({
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          subject: z.string().min(1),
          totalQuestions: z.number().positive(),
          timeLimit: z.number().optional(),
          passingScore: z.number().default(70),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return createQuiz(ctx.user.id, input);
      }),

    getById: publicProcedure
      .input(z.object({ quizId: z.number() }))
      .query(async ({ input }) => {
        return getQuizById(input.quizId);
      }),

    getQuestions: publicProcedure
      .input(z.object({ quizId: z.number() }))
      .query(async ({ input }) => {
        return getQuizQuestions(input.quizId);
      }),

    addQuestion: protectedProcedure
      .input(
        z.object({
          quizId: z.number(),
          questionText: z.string().min(1),
          questionType: z.enum(["multiple_choice", "short_answer", "true_false"]),
          options: z.string().optional(),
          correctAnswer: z.string().min(1),
          explanation: z.string().optional(),
          order: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        return createQuizQuestion(input);
      }),

    submitAttempt: protectedProcedure
      .input(
        z.object({
          quizId: z.number(),
          score: z.number(),
          correctAnswers: z.number(),
          totalQuestions: z.number(),
          timeTaken: z.number().optional(),
          answers: z.string(),
          startedAt: z.date(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return createQuizAttempt({
          ...input,
          userId: ctx.user.id,
          passed: input.score >= 70,
          completedAt: new Date(),
        });
      }),

    getAttempts: protectedProcedure
      .input(z.object({ quizId: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return getUserQuizAttempts(ctx.user.id, input.quizId);
      }),
  }),

  // ============ Stress & Focus Logs ============
  stressLogs: router({
    create: protectedProcedure
      .input(
        z.object({
          date: z.date(),
          stressLevel: z.number().int().min(1).max(10),
          focusLevel: z.number().int().min(1).max(10),
          sleepHours: z.string().optional(),
          mood: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return createStressLog(ctx.user.id, input);
      }),

    getByDate: protectedProcedure
      .input(z.object({ date: z.date() }))
      .query(async ({ ctx, input }) => {
        return getStressLogsByDate(ctx.user.id, input.date);
      }),

    getRange: protectedProcedure
      .input(z.object({ days: z.number().default(30) }))
      .query(async ({ ctx, input }) => {
        return getStressLogsRange(ctx.user.id, input.days);
      }),
  }),

  // ============ Friends ============
  friends: router({
    add: protectedProcedure
      .input(z.object({ friendId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return addFriend(ctx.user.id, input.friendId);
      }),

    accept: protectedProcedure
      .input(z.object({ friendshipId: z.number() }))
      .mutation(async ({ input }) => {
        return acceptFriendRequest(input.friendshipId);
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserFriends(ctx.user.id);
    }),
  }),

  // ============ Leaderboard ============
  leaderboard: leaderboardRouter,

  // ============ Surveys ============
  surveys: surveysRouter,

  // ============ Materials ============
  materials: materialsRouter,

  // ============ Feed ============
  feed: router({
    create: protectedProcedure
      .input(
        z.object({
          postType: z.enum([
            "study_milestone",
            "assignment_completed",
            "quiz_passed",
            "streak_achievement",
            "general_update",
          ]),
          title: z.string().min(1),
          content: z.string().optional(),
          metadata: z.string().optional(),
          visibility: z.enum(["public", "friends_only", "private"]).default("friends_only"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return createFeedPost(ctx.user.id, input);
      }),

    getFeed: protectedProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ ctx, input }) => {
        return getFeedPosts(ctx.user.id, input.limit);
      }),

    like: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return likeFeedPost(input.postId, ctx.user.id);
      }),

    unlike: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return unlikeFeedPost(input.postId, ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
