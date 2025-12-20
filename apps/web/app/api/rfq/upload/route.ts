import { NextResponse } from "next/server";

const API = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Forward to backend
    const backendFormData = new FormData();
    files.forEach((file) => {
      backendFormData.append("files", file);
    });

    const r = await fetch(`${API}/rfq/upload`, {
      method: "POST",
      body: backendFormData,
    });

    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (error: any) {
    console.error("Error in POST /api/rfq/upload:", error);
    return NextResponse.json(
      { error: "Failed to upload files", message: error.message },
      { status: 500 }
    );
  }
}

