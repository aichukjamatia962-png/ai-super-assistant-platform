export const config = {
      app: {
          name: "Independent AI Platform",
              version: "0.1.0",
                  environment: process.env.NODE_ENV ?? "development",
                    },
                      api: {
                          version: "v1",
                              prefix: "/api/v1",
                                },
                                } as const;
