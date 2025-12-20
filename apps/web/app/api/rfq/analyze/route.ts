import { NextResponse } from "next/server";

const API = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const r = await fetch(`${API}/rfq/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (error: any) {
    console.error("Error in POST /api/rfq/analyze:", error);
    return NextResponse.json(
      { error: "Failed to analyze offers", message: error.message },
      { status: 500 }
    );
  }
}

