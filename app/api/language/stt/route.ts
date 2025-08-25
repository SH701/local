// app/api/language/stt/route.ts
import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8080";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = req.headers.get("authorization");

    const backendRes = await fetch(`${API}/api/language/stt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    });

    const text = await backendRes.text();

    return new NextResponse(text, {
      status: backendRes.status,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error("Error in /api/language/stt:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
