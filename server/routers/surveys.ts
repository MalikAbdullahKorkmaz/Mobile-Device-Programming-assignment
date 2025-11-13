import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { createDailySurvey, getDailySurveyByDate } from "../db";

export const surveysRouter = router({
  submitDailySurvey: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        mood: z.string().min(1),
        focusRating: z.number().int().min(1).max(10),
        energyLevel: z.number().int().min(1).max(10),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createDailySurvey(ctx.user.id, {
        date: input.date,
        mood: input.mood,
        focusRating: input.focusRating,
        energyLevel: input.energyLevel,
        notes: input.notes,
      });
    }),

  getTodaySurvey: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      return getDailySurveyByDate(ctx.user.id, input.date);
    }),
});
