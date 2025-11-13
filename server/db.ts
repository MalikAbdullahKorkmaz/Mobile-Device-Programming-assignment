import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  studySessions,
  assignments,
  quizzes,
  quizQuestions,
  quizAttempts,
  stressLogs,
  friendships,
  feedPosts,
  feedLikes,
  dailySurveys,
  studyMaterials,
  StudySession,
  Assignment,
  StressLog,
  FeedPost,
  LeaderboardEntry,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ Study Sessions ============

export async function createStudySession(
  userId: number,
  data: Omit<typeof studySessions.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(studySessions).values({
    userId,
    ...data,
  });

  return result;
}

export async function getUserStudySessions(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(studySessions)
    .where(eq(studySessions.userId, userId))
    .orderBy(desc(studySessions.createdAt))
    .limit(limit);
}

export async function getStudySessionStats(userId: number, days = 30) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return db
    .select({
      totalSessions: sql<number>`COUNT(*)`,
      totalMinutes: sql<number>`SUM(${studySessions.durationMinutes})`,
      totalPomodoros: sql<number>`SUM(${studySessions.pomodoroCount})`,
      avgDuration: sql<number>`AVG(${studySessions.durationMinutes})`,
    })
    .from(studySessions)
    .where(
      and(
        eq(studySessions.userId, userId),
        gte(studySessions.createdAt, startDate)
      )
    );
}

// ============ Assignments ============

export async function createAssignment(
  userId: number,
  data: Omit<typeof assignments.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(assignments).values({
    userId,
    ...data,
  });
}

export async function getUserAssignments(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(assignments)
    .where(eq(assignments.userId, userId))
    .orderBy(asc(assignments.dueDate));
}

export async function updateAssignmentStatus(
  assignmentId: number,
  status: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Record<string, unknown> = { status };
  if (status === "completed") {
    updateData.completedAt = new Date();
  }

  return db
    .update(assignments)
    .set(updateData)
    .where(eq(assignments.id, assignmentId));
}

// ============ Quizzes ============

export async function createQuiz(
  userId: number,
  data: Omit<typeof quizzes.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(quizzes).values({
    userId,
    ...data,
  });
}

export async function getQuizById(quizId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.id, quizId))
    .limit(1);

  return result[0];
}

export async function getQuizQuestions(quizId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId))
    .orderBy(asc(quizQuestions.order));
}

export async function createQuizQuestion(
  data: typeof quizQuestions.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(quizQuestions).values(data);
}

export async function createQuizAttempt(
  data: typeof quizAttempts.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(quizAttempts).values(data);
}

export async function getUserQuizAttempts(userId: number, quizId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions = [eq(quizAttempts.userId, userId)];
  if (quizId) {
    conditions.push(eq(quizAttempts.quizId, quizId));
  }

  return db
    .select()
    .from(quizAttempts)
    .where(and(...conditions))
    .orderBy(desc(quizAttempts.completedAt));
}

// ============ Stress Logs ============

export async function createStressLog(
  userId: number,
  data: Omit<typeof stressLogs.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(stressLogs).values({
    userId,
    ...data,
  });
}

export async function getStressLogsByDate(userId: number, date: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await db
    .select()
    .from(stressLogs)
    .where(
      and(
        eq(stressLogs.userId, userId),
        gte(stressLogs.date, startOfDay),
        lte(stressLogs.date, endOfDay)
      )
    )
    .limit(1);

  return result[0];
}

export async function getStressLogsRange(userId: number, days = 30) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return db
    .select()
    .from(stressLogs)
    .where(
      and(
        eq(stressLogs.userId, userId),
        gte(stressLogs.date, startDate)
      )
    )
    .orderBy(desc(stressLogs.date));
}

// ============ Friendships ============

export async function addFriend(userId: number, friendId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(friendships).values({
    userId,
    friendId,
    status: "pending",
  });
}

export async function acceptFriendRequest(friendshipId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(friendships)
    .set({ status: "accepted" })
    .where(eq(friendships.id, friendshipId));
}

export async function getUserFriends(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select({
      id: friendships.id,
      friendId: friendships.friendId,
      status: friendships.status,
      friendName: users.name,
      friendEmail: users.email,
    })
    .from(friendships)
    .innerJoin(users, eq(friendships.friendId, users.id))
    .where(
      and(
        eq(friendships.userId, userId),
        eq(friendships.status, "accepted")
      )
    );
}

// ============ Feed Posts ============

export async function createFeedPost(
  userId: number,
  data: Omit<typeof feedPosts.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(feedPosts).values({
    userId,
    ...data,
  });
}

export async function getFeedPosts(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get user's friends
  const userFriends = await db
    .select({ friendId: friendships.friendId })
    .from(friendships)
    .where(
      and(
        eq(friendships.userId, userId),
        eq(friendships.status, "accepted")
      )
    );

  const friendIds = userFriends.map((f) => f.friendId);
  friendIds.push(userId); // Include own posts

  return db
    .select({
      id: feedPosts.id,
      userId: feedPosts.userId,
      userName: users.name,
      postType: feedPosts.postType,
      title: feedPosts.title,
      content: feedPosts.content,
      metadata: feedPosts.metadata,
      likes: feedPosts.likes,
      visibility: feedPosts.visibility,
      createdAt: feedPosts.createdAt,
    })
    .from(feedPosts)
    .innerJoin(users, eq(feedPosts.userId, users.id))
    .where(
      and(
        sql`${feedPosts.userId} IN (${sql.raw(friendIds.join(","))})`,
        sql`${feedPosts.visibility} IN ('public', 'friends_only')`
      )
    )
    .orderBy(desc(feedPosts.createdAt))
    .limit(limit);
}

export async function likeFeedPost(postId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.insert(feedLikes).values({
      postId,
      userId,
    });

    // Update likes count
    return db
      .update(feedPosts)
      .set({ likes: sql`${feedPosts.likes} + 1` })
      .where(eq(feedPosts.id, postId));
  } catch (error) {
    // Like already exists, ignore
    console.log("Like already exists");
  }
}

export async function unlikeFeedPost(postId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(feedLikes)
    .where(
      and(eq(feedLikes.postId, postId), eq(feedLikes.userId, userId))
    );

  // Update likes count
  return db
    .update(feedPosts)
    .set({ likes: sql`${feedPosts.likes} - 1` })
    .where(eq(feedPosts.id, postId));
}

// ============ Daily Surveys ============

export async function createDailySurvey(
  userId: number,
  data: Omit<typeof dailySurveys.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(dailySurveys).values({
    userId,
    ...data,
  });
}

export async function getDailySurveyByDate(userId: number, date: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await db
    .select()
    .from(dailySurveys)
    .where(
      and(
        eq(dailySurveys.userId, userId),
        gte(dailySurveys.date, startOfDay),
        lte(dailySurveys.date, endOfDay)
      )
    )
    .limit(1);

  return result[0];
}

// ============ Study Materials ============

export async function uploadStudyMaterial(
  userId: number,
  data: Omit<typeof studyMaterials.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(studyMaterials).values({
    userId,
    ...data,
  });
}

export async function getUserStudyMaterials(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(studyMaterials)
    .where(eq(studyMaterials.userId, userId))
    .orderBy(desc(studyMaterials.createdAt));
}

export async function deleteStudyMaterial(materialId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .delete(studyMaterials)
    .where(
      and(
        eq(studyMaterials.id, materialId),
        eq(studyMaterials.userId, userId)
      )
    );
}

// ============ Leaderboard ============

export async function getLeaderboard(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get user's friends
  const userFriends = await db
    .select({ friendId: friendships.friendId })
    .from(friendships)
    .where(
      and(
        eq(friendships.userId, userId),
        eq(friendships.status, "accepted")
      )
    );

  const friendIds = userFriends.map((f) => f.friendId);
  friendIds.push(userId); // Include self

  if (friendIds.length === 0) {
    return [];
  }

  // Get aggregated stats for friends
  const results = await db
    .select({
      userId: users.id,
      userName: users.name,
      totalStudyMinutes: sql<number>`COALESCE(SUM(${studySessions.durationMinutes}), 0)`,
      completedAssignments: sql<number>`COALESCE(COUNT(DISTINCT CASE WHEN ${assignments.status} = 'completed' THEN ${assignments.id} END), 0)`,
      averageQuizScore: sql<number>`COALESCE(AVG(${quizAttempts.score}), 0)`,
      totalPomodoros: sql<number>`COALESCE(SUM(${studySessions.pomodoroCount}), 0)`,
    })
    .from(users)
    .leftJoin(studySessions, eq(users.id, studySessions.userId))
    .leftJoin(assignments, eq(users.id, assignments.userId))
    .leftJoin(quizAttempts, eq(users.id, quizAttempts.userId))
    .where(sql`${users.id} IN (${sql.raw(friendIds.join(","))})`)
    .groupBy(users.id)
    .orderBy(sql`COALESCE(SUM(${studySessions.durationMinutes}), 0) DESC`)
    .limit(limit);

  // Add rank
  return results.map((result, index) => ({
    ...(result as any),
    rank: index + 1,
  }));
}
