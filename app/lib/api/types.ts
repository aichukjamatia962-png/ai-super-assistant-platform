export type ApiRequestContext = {
      requestId: string;
        userId: string | null;
          authenticated: boolean;
          };

          export type ApiHandlerResult<T> = {
            data: T;
              context: ApiRequestContext;
              };