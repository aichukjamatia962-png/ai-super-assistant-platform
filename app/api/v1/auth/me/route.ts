import { eq } from "drizzle-orm";
import { apiResponse, createRequestContext } from "../../../../lib/api";
import {
  DatabaseSessionStore,
  SESSION_COOKIE_NAME,
} from "../../../../lib/auth";
import { database } from "../../../../lib/db";
import { users } from "../../../../lib/db/schema";

const sessionStore = new DatabaseSessionStore();

export async function GET(request: Request) {
  const context = createRequestContext(request);
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.slice(SESSION_COOKIE_NAME.length + 1);

  if (!token) {
    return apiResponse(
      {
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "Please log in to continue.",
        },
      },
      context,
      401,
    );
  }

  if (!database) {
    return apiResponse(
      {
        success: false,
        error: {
          code: "DATABASE_UNAVAILABLE",
          message: "Authentication is temporarily unavailable.",
        },
      },
      context,
      503,
    );
  }

  try {
    const session = await sessionStore.getByToken(decodeURIComponent(token));

    if (!session) {
      return apiResponse(
        {
          success: false,
          error: {
            code: "INVALID_SESSION",
            message: "Your session is invalid or expired. Please log in again.",
          },
        },
        context,
        401,
      );
    }

    const [user] = await database
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return apiResponse(
        {
          success: false,
          error: {
            code: "USER_NOT_FOUND",
            message: "Please log in again.",
          },
        },
        context,
        401,
      );
    }

    return apiResponse(
      {
        success: true,
        data: { user },
      },
      { ...context, userId: user.id, authenticated: true },
    );
  } catch {
    return apiResponse(
      {
        success: false,
        error: {
          code: "AUTHENTICATION_FAILED",
          message: "Could not verify your session.",
        },
      },
      context,
      500,
    );
  }
}
