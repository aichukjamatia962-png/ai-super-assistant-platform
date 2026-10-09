import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { databaseConfig } from "./config";
import type { DatabaseClient, DatabaseHealth } from "./types";

const pool =
  databaseConfig.provider === "postgresql" && databaseConfig.url
    ? new Pool({
        connectionString: databaseConfig.url,
        max: 10,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
      })
    : null;

export const database = pool ? drizzle(pool) : null;

class PostgreSQLDatabaseClient implements DatabaseClient {
  async healthCheck(): Promise<DatabaseHealth> {
    if (!pool) {
      return {
        status: "degraded",
        provider: databaseConfig.provider,
      };
    }

    const start = Date.now();

    try {
      await pool.query("SELECT 1");

      return {
        status: "ok",
        provider: "postgresql",
        latencyMs: Date.now() - start,
      };
    } catch {
      return {
        status: "down",
        provider: "postgresql",
        latencyMs: Date.now() - start,
      };
    }
  }
}

export const db: DatabaseClient = new PostgreSQLDatabaseClient();
