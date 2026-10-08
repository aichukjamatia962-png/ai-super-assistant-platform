import type { DatabaseClient, DatabaseHealth } from "./types";

class UnconfiguredDatabaseClient implements DatabaseClient {
  async healthCheck(): Promise<DatabaseHealth> {
      return {
            status: "degraded",
                  provider: "unconfigured",
                      };
                        }
                        }

                        export const db: DatabaseClient = new UnconfiguredDatabaseClient();