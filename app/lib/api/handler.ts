import { createRequestContext } from "./request-context";
import type { ApiRequestContext } from "./types";

export type ApiHandler<T> = (
  request: Request,
    context: ApiRequestContext,
    ) => Promise<T>;

    export async function handleApiRequest<T>(
      request: Request,
        handler: ApiHandler<T>,
        ): Promise<T> {
          const context = createRequestContext(request);

            return handler(request, context);
            }