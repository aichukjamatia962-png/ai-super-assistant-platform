import type { AuthSession } from "./types";

export interface SessionStore {
  create(session: AuthSession): Promise<void>;
    get(sessionId: string): Promise<AuthSession | null>;
      delete(sessionId: string): Promise<void>;
      }