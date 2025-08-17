/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || "http://localhost:8080";

export async function POST(req: Request) {
  try {
    // 1) 공통 CORS 헤더
    const resHeaders = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });

    // 2) 인증 토큰 꺼내기
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401, headers: resHeaders }
      );
    }
    const token = auth.split(' ')[1];

    // 3) 백엔드에 대화 생성 요청 프록시
    const backendRes = await fetch(`${API_URL}/api/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: await req.text(),
    });

    // 4) 백엔드 응답 그대로 내려주기
    const data = await backendRes.json();
    return NextResponse.json(data, {
      status: backendRes.status,
      headers: resHeaders
    });
  } catch (e) {
    console.error('Upstream fetch error', e);
    return NextResponse.json(
      { message: 'Upstream fetch failed' },
      { status: 502, headers: new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      })}
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // 1) CORS/응답 헤더
    const resHeaders = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });

    // 2) 인증 토큰
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401, headers: resHeaders }
      );
    }
    const token = auth.split(' ')[1];

    // 3) 요청 URL에서 필요한 파라미터만 추출
    const url = new URL(req.url);
    const status = url.searchParams.get('status'); // status만 허용

    let backendUrl = `${API_URL}/api/conversations`;
    if (status) {
      backendUrl += `?status=${status}`;
    }

    // 4) 백엔드로 전달
    const backendRes = await fetch(backendUrl, {
  method: 'GET',
  headers: { Authorization: `Bearer ${token}` },
});

    
    // 5) 응답 파싱 (빈 body 안전 처리)
    const ct = backendRes.headers.get('content-type') || '';
    let data: any = null;

    if (backendRes.status === 204) {
      data = {}; // No Content → 빈 객체
    } else if (ct.includes('application/json')) {
      try {
        data = await backendRes.json();
      } catch {
        data = {}; // body 없는데 json() 시도했을 경우 대비
      }
    } else {
      data = await backendRes.text();
    }

    return NextResponse.json(data, {
      status: backendRes.status,
      headers: resHeaders,
    });
  } catch (e) {
    console.error('Upstream fetch error', e);
    return NextResponse.json(
      { message: 'Upstream fetch failed' },
      {
        status: 502,
        headers: new Headers({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }),
      }
    );
  }
}
