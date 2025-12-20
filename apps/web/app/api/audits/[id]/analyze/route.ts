import { NextResponse } from "next/server";

const API =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:4000";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const r = await fetch(`${API}/audits/${params.id}/analyze`, {
      method: "POST",
    });

    if (!r.ok) {
      const error = await r
        .json()
        .catch(() => ({ error: "Failed to analyze audit" }));
      return NextResponse.json(error, { status: r.status });
    }

    const data = await r.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error in POST /api/audits/[id]/analyze:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
