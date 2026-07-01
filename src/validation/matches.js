import { z } from "zod";

const positiveIntegerSchema = z.coerce
  .number()
  .int()
  .positive();

const nonNegativeIntegerSchema = z.coerce
  .number()
  .int()
  .nonnegative();

const isValidIsoDateString = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  const isoDatePattern =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

  if (!isoDatePattern.test(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
};

export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
};

export const listMatchesQuerySchema = z.object({
  limit: positiveIntegerSchema.max(100).optional(),
});

export const matchIdParamSchema = z.object({
  id: positiveIntegerSchema,
});

export const createMatchSchema = z
  .object({
    sport: z.string().trim().min(1, "sport is required"),
    homeTeam: z.string().trim().min(1, "homeTeam is required"),
    awayTeam: z.string().trim().min(1, "awayTeam is required"),
    startTime: z.string().refine(isValidIsoDateString, {
      message: "startTime must be a valid ISO date string",
    }),
    endTime: z.string().refine(isValidIsoDateString, {
      message: "endTime must be a valid ISO date string",
    }),
    homeScore: nonNegativeIntegerSchema.optional(),
    awayScore: nonNegativeIntegerSchema.optional(),
  })
  .superRefine(({ startTime, endTime }, ctx) => {
    if (!isValidIsoDateString(startTime) || !isValidIsoDateString(endTime)) {
      return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (endDate <= startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "endTime must be after startTime",
      });
    }
  });

export const updateScoreSchema = z.object({
  homeScore: nonNegativeIntegerSchema,
  awayScore: nonNegativeIntegerSchema,
});
