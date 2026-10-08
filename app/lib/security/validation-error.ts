import { z } from "zod";

export function getValidationIssues(error: z.ZodError) {
  return error.issues.map((issue) => ({
      path: issue.path,
          message: issue.message,
              code: issue.code,
                }));
                }