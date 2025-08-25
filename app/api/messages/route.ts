/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token is missing" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const backendRes = await fetch("http://localhost:8080/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const text = await backendRes.text();
    console.log("backendRes:", backendRes);
    console.log("text:", `"${text}"`); // 빈 문자열도 보이도록
    console.log("text length:", text.length);

    let data: any;

    // 응답 본문이 비어있는 경우 처리
    if (text.length === 0) {
      // 상태 코드에 따라 적절한 에러 메시지 생성
      data = {
        error: getErrorMessage(backendRes.status),
        status: backendRes.status,
        message: getStatusMessage(backendRes.status),
      };
    } else {
      // 응답 본문이 있는 경우 JSON 파싱 시도
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        data = {
          error: "Invalid response format",
          raw: text,
          status: backendRes.status,
        };
      }
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Error in /api/messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function getErrorMessage(status: number): string {
  switch (status) {
    case 403:
      return "FORBIDDEN";
    case 409:
      return "CONFLICT";
    case 401:
      return "UNAUTHORIZED";
    case 500:
      return "INTERNAL_SERVER_ERROR";
    default:
      return "UNKNOWN_ERROR";
  }
}

function getStatusMessage(status: number): string {
  switch (status) {
    case 403:
      return "접근이 금지되었습니다.";
    case 409:
      return "STT resulted in empty text.";
    case 401:
      return "인증이 필요합니다.";
    case 500:
      return "서버 내부 오류가 발생했습니다.";
    default:
      return `HTTP ${status} 오류가 발생했습니다.`;
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token is missing" },
        { status: 401 }
      );
    }

    // URL 쿼리 파라미터 추출
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "10";

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 }
      );
    }

    const backendRes = await fetch(
      `http://localhost:8080/api/messages?conversationId=${conversationId}&page=${page}&size=${size}`,
      {
        method: "GET",
        headers: { Authorization: token },
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Error in GET /api/messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
