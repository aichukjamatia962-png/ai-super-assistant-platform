import { NextResponse } from "next/server";
import { config } from "../../../lib/config";
import { success } from "../../../lib/api-response";

export async function GET() {
  return NextResponse.json(
      success({
            status: "ok",
                  service: config.app.name,
                        version: config.api.version,
                            }),
                              );
                              }