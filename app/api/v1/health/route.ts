import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "independent-ai-platform",
    version: "v1"
  });
}
