import { config } from "../../../lib/config";
import { apiResponse, createRequestContext } from "../../../lib/api";

export async function GET(request: Request) {
  const context = createRequestContext(request);

    return apiResponse(
        {
              success: true,
                    data: {
                            status: "ok",
                                    service: config.app.name,
                                            version: config.api.version,
                                                  },
                                                      },
                                                          context,
                                                            );
                                                            }