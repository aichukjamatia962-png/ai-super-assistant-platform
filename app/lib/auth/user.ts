import type { AuthUser } from "./types";

export function createAuthUser(input: {
  id: string;
    email: string;
      name?: string | null;
      }): AuthUser {
        return {
            id: input.id,
                email: input.email,
                    name: input.name ?? null,
                      };
                      }