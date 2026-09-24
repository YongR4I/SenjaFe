import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:8000/api/v1";

export async function GET() {
  const startedAt = Date.now();

  try {
    const res = await fetch(`${API_URL}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });

    return NextResponse.json(
      {
        status: res.ok ? "ok" : "degraded",
        backend: res.ok ? "up" : "down",
        backendStatus: res.status,
        latencyMs: Date.now() - startedAt,
      },
      { status: res.ok ? 200 : 503 },
    );
  } catch {
    return NextResponse.json(
      { status: "degraded", backend: "unreachable", latencyMs: Date.now() - startedAt },
      { status: 503 },
    );
  }
}
