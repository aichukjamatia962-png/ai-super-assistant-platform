import { config } from "../../../lib/config";
import { apiResponse, createRequestContext } from "../../../lib/api";
import { db } from "../../../lib/db";

export async function GET(request: Request) {
  const context = createRequestContext(request);
  const databaseHealth = await db.healthCheck();

  const status =
    databaseHealth.status === "ok" ? "ok" : "degraded";

  return apiResponse(
    {
      success: status === "ok",
      data: {
        status,
        service: config.app.name,
        version: config.api.version,
        database: databaseHealth,
      },
    },
    context,
  );
}
