// app/api/language/stt/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.API_URL ?? "http://localhost:8080";

export async function POST(req: NextRequest) {
  try {
    // ✅ 프론트에서 보낸 body 파싱
    const body = await req.json();
    const { audioUrl } = body;

    if (!audioUrl) {
      return NextResponse.json(
        { error: "audioUrl is required" },
        { status: 400 }
      );
    }

    // ✅ Authorization 헤더 전달 (로그인 사용자라면)
    const auth = req.headers.get("authorization");

    // ✅ 백엔드로 요청 전달
    const backendRes = await fetch(`${BASE}/api/language/stt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify({ audioUrl }),
    });

    // ✅ 백엔드 응답 처리
    const text = await backendRes.text();

    return new NextResponse(text, {
      status: backendRes.status,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error("Error in STT route:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
