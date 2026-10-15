
function readPositiveInteger(value: string | undefined, fallback: number) {
  if (!value) return fallback;

    const parsed = Number(value);
      return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
      }

      export const aiConfig = {
        provider: process.env.AI_PROVIDER ?? "http",
          baseUrl: process.env.AI_BASE_URL ?? "",
            model: process.env.AI_MODEL ?? "",
              apiKey: process.env.AI_API_KEY ?? "",
                timeoutMs: readPositiveInteger(process.env.AI_TIMEOUT_MS, 60_000),
                } as const;

                export const isAIConfigured = Boolean(
                  aiConfig.baseUrl.trim() && aiConfig.model.trim()
                  );
                  