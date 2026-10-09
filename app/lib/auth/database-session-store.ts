import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { database } from "../db";
import { sessions } from "../db/schema";
import type { AuthSession } from "./types";
import type { CreatedSession, CreateSessionInput, SessionStore } from "./session";

export class DatabaseSessionStore implements SessionStore {
  async create(input: CreateSessionInput): Promise<CreatedSession> {
    if (!database) {
      throw new Error("Database is not configured");
    }

    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");

    const [row] = await database
      .insert(sessions)
      .values({
        userId: input.userId,
        tokenHash,
        expiresAt: input.expiresAt,
      })
      .returning({
        id: sessions.id,
        userId: sessions.userId,
        expiresAt: sessions.expiresAt,
      });

    if (!row) {
      throw new Error("Failed to create session");
    }

    return {
      session: {
        id: row.id,
        userId: row.userId,
        expiresAt: row.expiresAt,
      },
      token,
    };
  }

  async getByToken(token: string): Promise<AuthSession | null> {
    if (!database) {
      throw new Error("Database is not configured");
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");

    const [row] = await database
      .select({
        id: sessions.id,
        userId: sessions.userId,
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .where(
        and(
          eq(sessions.tokenHash, tokenHash),
          gt(sessions.expiresAt, new Date()),
        ),
      )
      .limit(1);

    return row ?? null;
  }

  async deleteByToken(token: string): Promise<void> {
    if (!database) {
      throw new Error("Database is not configured");
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");

    await database.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
  }
}
