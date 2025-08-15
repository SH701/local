// app/api/conversations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const token = req.headers.get('authorization');
    if (!token) {
      return NextResponse.json({ error: 'Authorization token is missing' }, { status: 401 });
    }

    const backendRes = await fetch(`http://localhost:8080/api/conversations/${id}`, {
      headers: { authorization: token },
      cache: 'no-store',
    });

    const body = await backendRes.text();
    return new NextResponse(body, {
      status: backendRes.status,
      headers: {
        'content-type': backendRes.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (e) {
    console.error('Error in GET /api/conversations/[id]:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
