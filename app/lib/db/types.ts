export type DatabaseHealth = {
      status: "ok" | "degraded" | "down";
        provider: string;
          latencyMs?: number;
          };

          export interface DatabaseClient {
            healthCheck(): Promise<DatabaseHealth>;
            }