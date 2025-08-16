import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL || 'http://localhost:8080';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ messageId: string }> }  // ⬅ Promise 타입
) {
  try {
    const { messageId } = await context.params; // ⬅ await 필수
    console.log("👉 messageId:", messageId)

    if (!messageId) {
      return NextResponse.json(
        { error: 'messageId is required' },
        { status: 400 }
      );
    }

    let auth = req.headers.get('authorization');
    if (!auth || /Bearer\s+(null|undefined)?$/i.test(auth)) {
      const token = req.cookies.get('accessToken')?.value;
      if (token) auth = `Bearer ${token}`;
    }

    if (!auth) {
      return NextResponse.json(
        { error: 'Authorization token is missing' },
        { status: 401 }
      );
    }

    const backendRes = await fetch(
      `${API_URL}/api/messages/${messageId}/honorific-variations`,
      {
        method: 'GET',
        headers: { Authorization: auth },
      }
    );

    const text = await backendRes.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error(
      'Error in GET /api/messages/[messageId]/honorific-variations:',
      error
    );
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
