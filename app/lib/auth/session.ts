import type { AuthSession } from "./types";

export type CreateSessionInput = {
  userId: string;
  expiresAt: Date;
};

export type CreatedSession = {
  session: AuthSession;
  token: string;
};

export interface SessionStore {
  create(input: CreateSessionInput): Promise<CreatedSession>;
  getByToken(token: string): Promise<AuthSession | null>;
  deleteByToken(token: string): Promise<void>;
}
