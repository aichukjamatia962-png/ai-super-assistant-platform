export type AIMessage = {
      role: "system" | "user" | "assistant";
        content: string;
        };

        export type AIProviderConfig = {
          baseUrl: string;
            model: string;
              apiKey?: string;
                timeoutMs?: number;
                };

                export type AIProviderResponse = {
                  content: string;
                    model: string;
                    };

                    export interface AIProvider {
                      generate(
                          messages: AIMessage[],
                            ): Promise<AIProviderResponse>;
                            }

                            export class AIProviderError extends Error {
                              constructor(
                                  message: string,
                                      public readonly code: string,
                                        ) {
                                            super(message);
                                                this.name = "AIProviderError";
                                                  }
                                                  }
