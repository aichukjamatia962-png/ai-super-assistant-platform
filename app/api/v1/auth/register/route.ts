import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";
import { apiResponse } from "../../../../lib/api";
import { createRequestContext } from "../../../../lib/api";
import { database } from "../../../../lib/db";
import { users } from "../../../../lib/db/schema";
import {
  DatabaseSessionStore,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  SESSION_MAX_AGE_SECONDS,
} from "../../../../lib/auth";
import { registerSchema } from "../../../../lib/auth/register-schema";
import { hashPassword } from "../../../../lib/security";
import { getValidationIssues } from "../../../../lib/security/validation-error";

const sessionStore = new DatabaseSessionStore();

export async function POST(request: Request) {
  const context = createRequestContext(request);

  try {
    const body: unknown = await request.json();
    const input = registerSchema.parse(body);

    if (!database) {
      return apiResponse(
        {
          success: false,
          error: { code: "DATABASE_UNAVAILABLE", message: "Registration is temporarily unavailable." },
        },
        context,
        503,
      );
    }

    const [existingUser] = await database
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (existingUser) {
      return apiResponse(
        {
          success: false,
          error: { code: "EMAIL_ALREADY_EXISTS", message: "An account with this email already exists." },
        },
        context,
        409,
      );
    }

    const passwordHash = await hashPassword(input.password);

    const [user] = await database
      .insert(users)
      .values({
        email: input.email,
        name: input.name ?? null,
        passwordHash,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
      });

    if (!user) {
      throw new Error("User creation failed");
    }

    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
    const created = await sessionStore.create({
      userId: user.id,
      expiresAt,
    });

    const response = apiResponse(
      {
        success: true,
        data: { user },
      },
      context,
      201,
    );

    response.cookies.set(
      SESSION_COOKIE_NAME,
      created.token,
      {
        ...SESSION_COOKIE_OPTIONS,
        expires: expiresAt,
      },
    );

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return apiResponse(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Please check your registration details.",
            issues: getValidationIssues(error),
          },
        },
        context,
        400,
      );
    }

    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "23505"
    ) {
      return apiResponse(
        {
          success: false,
          error: { code: "EMAIL_ALREADY_EXISTS", message: "An account with this email already exists." },
        },
        context,
        409,
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "REGISTRATION_FAILED",
          message: "Registration could not be completed.",
        },
        requestId: context.requestId,
      },
      { status: 500 },
    );
  }
}
