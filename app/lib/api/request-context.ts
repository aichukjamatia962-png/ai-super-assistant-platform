import type { ApiRequestContext } from "./types";

export function createRequestContext(
  request: Request,
  ): ApiRequestContext {
    const requestId =
        request.headers.get("x-request-id") ?? crypto.randomUUID();

          return {
              requestId,
                  userId: null,
                      authenticated: false,
                        };
                        }