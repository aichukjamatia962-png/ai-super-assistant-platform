import { apiResponse, createRequestContext } from "../../../../lib/api";
import {
  DatabaseSessionStore,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "../../../../lib/auth";

const sessionStore = new DatabaseSessionStore();

export async function POST(request: Request) {
  const context = createRequestContext(request);
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.slice(SESSION_COOKIE_NAME.length + 1);

  if (token) {
    try {
      await sessionStore.deleteByToken(decodeURIComponent(token));
    } catch {
      return apiResponse(
        {
          success: false,
          error: {
            code: "LOGOUT_FAILED",
            message: "Could not end the session. Please try again.",
          },
        },
        context,
        500,
      );
    }
  }

  const response = apiResponse(
    { success: true, data: { loggedOut: true } },
    context,
  );

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
