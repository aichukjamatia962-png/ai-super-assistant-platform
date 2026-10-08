import { z } from "zod";

export function validateInput<T extends z.ZodType>(
  schema: T,
    input: unknown,
    ): z.infer<T> {
      return schema.parse(input);
      }