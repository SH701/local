import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    // Authorization 헤더 필터링
    let auth = req.headers.get("authorization") || undefined;
    if (auth && (/^Bearer\s*$/i.test(auth) || /Bearer\s+null/i.test(auth))) {
      auth = undefined;
    }

    // 쿠키에서 accessToken 보완
    if (!auth) {
      const token = req.cookies.get("accessToken")?.value;
      if (token && token !== "null" && token !== "undefined") {
        auth = `Bearer ${token}`;
      }
    }

    if (!auth) {
      return NextResponse.json(
        { error: 'Authorization token is missing' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // ⚠️ id를 요청 파라미터에서 받아오거나 query에서 추출해야 함
    const { id } = body; // 예시
    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    // Spring Boot API로 프록시
    const backendRes = await fetch(`http://localhost:8080/api/messages/${id}/translate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      body: JSON.stringify(body),
    });

    const text = await backendRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error in PUT /api/users/me/profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
