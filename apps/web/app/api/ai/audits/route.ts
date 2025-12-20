import { NextResponse } from "next/server";

const API = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const r = await fetch(`${API}/ai/audits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const error = await r.json().catch(() => ({ error: "Failed to process AI request" }));
      return NextResponse.json(error, { status: r.status });
    }

    const data = await r.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error in POST /api/ai/audits:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

