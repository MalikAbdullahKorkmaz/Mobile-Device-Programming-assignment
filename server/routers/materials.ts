import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { uploadStudyMaterial, getUserStudyMaterials, deleteStudyMaterial } from "../db";
import { storagePut } from "../storage";

export const materialsRouter = router({
  uploadMaterial: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        subject: z.string().min(1),
        fileData: z.string(), // Base64 encoded file data
        fileName: z.string().min(1),
        fileType: z.string().min(1),
        fileSize: z.number().positive(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Convert base64 to buffer
      const buffer = Buffer.from(input.fileData, "base64");

      // Upload to S3
      const fileKey = `${ctx.user.id}/materials/${Date.now()}-${input.fileName}`;
      const { url } = await storagePut(fileKey, buffer, `application/${input.fileType}`);

      // Save metadata to database
      return uploadStudyMaterial(ctx.user.id, {
        title: input.title,
        description: input.description,
        subject: input.subject,
        fileUrl: url,
        fileKey,
        fileType: input.fileType,
        fileSize: input.fileSize,
        tags: input.tags ? JSON.stringify(input.tags) : null,
      });
    }),

  getMaterials: protectedProcedure.query(async ({ ctx }) => {
    return getUserStudyMaterials(ctx.user.id);
  }),

  deleteMaterial: protectedProcedure
    .input(z.object({ materialId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return deleteStudyMaterial(input.materialId, ctx.user.id);
    }),
});
