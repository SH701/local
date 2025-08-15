// app/api/conversations/[id]/end/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.headers.get('authorization');
    if (!token) {
      return NextResponse.json({ error: 'Authorization token is missing' }, { status: 401 });
    }

    const backendRes = await fetch(`http://localhost:8080/api/conversations/${id}/end`, {
      method: 'PUT',
      headers: { authorization: token },
      cache: 'no-store',
    });

    // 보통 200 OK (바디가 없거나 짧은 문자열)
    const text = await backendRes.text().catch(() => '');
    return new NextResponse(text || null, {
      status: backendRes.status,
      headers: {
        'content-type':
          backendRes.headers.get('content-type') ?? (text ? 'text/plain' : ""),
      },
    });
  } catch (e) {
    console.error('Error in PUT /api/conversations/[id]/end:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
