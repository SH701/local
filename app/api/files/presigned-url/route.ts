// app/api/files/presigned-url/route.ts
import { NextRequest, NextResponse } from 'next/server';

// 1) CORS 프리플라이트
export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return res;
}

// 2) 실제 POST 요청 프록시
export async function POST(req: NextRequest) {
  try {
    // Authorization 헤더 체크
    const token = req.headers.get('authorization');
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token is missing' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Spring Boot API로 프록시
    const backendRes = await fetch('http://localhost:8080/api/files/presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { 
      status: backendRes.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error in POST /api/files/presigned-url:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
