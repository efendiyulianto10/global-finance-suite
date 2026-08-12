import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "global-finance-suite",
    timestamp: new Date().toISOString(),
  });
}
