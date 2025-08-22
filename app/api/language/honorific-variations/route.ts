// app/api/language/honorific-variations/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 쿼리 파라미터 꺼내기
    const { searchParams } = new URL(req.url);
    const sourceContent = searchParams.get("sourceContent");

    if (!sourceContent) {
      return NextResponse.json(
        { error: "sourceContent is required" },
        { status: 400 }
      );
    }
    const token = req.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token is missing" },
        { status: 401 }
      );
    }

    const backendRes = await fetch(
      `http://localhost:8080/api/language/honorific-variations?sourceContent=${encodeURIComponent(
        sourceContent
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );

    if (!backendRes.ok) {
      const text = await backendRes.text();
      return NextResponse.json({ error: text }, { status: backendRes.status });
    }
    const data = await backendRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Honorific route error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
