import { NextResponse } from "next/server";
import type { ApiRequestContext } from "./types";
import { getSecurityHeaders } from "../security/headers";

export function apiResponse<T>(
  data: T,
    context: ApiRequestContext,
      status = 200,
      ) {
        return NextResponse.json(data, {
            status,
                headers: {
                      ...getSecurityHeaders(),
                            "X-Request-ID": context.requestId,
                                },
                                  });
                                  }