import { NextResponse } from "next/server";

const API = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function GET() {
  try {
    const r = await fetch(`${API}/audits`, { cache: "no-store" });
    if (!r.ok) {
      const error = await r.json().catch(() => ({ error: "Failed to fetch audits" }));
      return NextResponse.json(error, { status: r.status });
    }
    const data = await r.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/audits:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const r = await fetch(`${API}/audits`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (error: any) {
    console.error("Error in POST /api/audits:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const r = await fetch(`${API}/audits`, {
      method: "DELETE",
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (error: any) {
    console.error("Error in DELETE /api/audits:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

