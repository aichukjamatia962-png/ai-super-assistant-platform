import { eq } from "drizzle-orm";
import { apiResponse, createRequestContext } from "../../../../lib/api";
import {
  DatabaseSessionStore,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  SESSION_MAX_AGE_SECONDS,
} from "../../../../lib/auth";
import { loginSchema } from "../../../../lib/auth/login-schema";
import { database } from "../../../../lib/db";
import { users } from "../../../../lib/db/schema";
import { verifyPassword } from "../../../../lib/security";
import { ZodError } from "zod";
import { getValidationIssues } from "../../../../lib/security/validation-error";

const sessionStore = new DatabaseSessionStore();

export async function POST(request: Request) {
  const context = createRequestContext(request);

  try {
    const body: unknown = await request.json();
    const input = loginSchema.parse(body);

    if (!database) {
      return apiResponse(
        {
          success: false,
          error: {
            code: "DATABASE_UNAVAILABLE",
            message: "Login is temporarily unavailable.",
          },
        },
        context,
        503,
      );
    }

    const [user] = await database
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (!user || !(await verifyPassword(user.passwordHash, input.password))) {
      return apiResponse(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password.",
          },
        },
        context,
        401,
      );
    }

    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
    const created = await sessionStore.create({
      userId: user.id,
      expiresAt,
    });

    const response = apiResponse(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
      },
      context,
    );

    response.cookies.set(SESSION_COOKIE_NAME, created.token, {
      ...SESSION_COOKIE_OPTIONS,
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return apiResponse(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Please check your login details.",
            issues: getValidationIssues(error),
          },
        },
        context,
        400,
      );
    }

    return apiResponse(
      {
        success: false,
        error: {
          code: "LOGIN_FAILED",
          message: "Login could not be completed.",
        },
      },
      context,
      500,
    );
  }
}
