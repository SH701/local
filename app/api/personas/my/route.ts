// app/api/personas/my/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Authorization 헤더 체크
    const token = req.headers.get('authorization');
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token is missing' },
        { status: 401 }
      );
    }

    // Spring Boot API로 프록시
    const backendRes = await fetch('http://localhost:8080/api/personas/my', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error in GET /api/personas/my:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
