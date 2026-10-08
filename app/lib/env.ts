const nodeEnv = process.env.NODE_ENV ?? "development";

export const env = {
  nodeEnv,
    isDevelopment: nodeEnv === "development",
      isProduction: nodeEnv === "production",
      } as const;