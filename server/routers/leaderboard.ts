import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getLeaderboard } from "../db";

export const leaderboardRouter = router({
  getFriendLeaderboard: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      return getLeaderboard(ctx.user.id, input.limit);
    }),
});
