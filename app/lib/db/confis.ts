export const databaseConfig = {
      provider: process.env.DATABASE_PROVIDER ?? "unconfigured",
        url: process.env.DATABASE_URL ?? null,
        } as const;