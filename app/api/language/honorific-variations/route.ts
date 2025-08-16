import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token is missing' },
        { status: 401 }
      );
    }

    // 프론트에서 전달받은 쿼리 추출
    const { searchParams } = new URL(req.url);
    const sourceContent = searchParams.get('sourceContent');
    const aiRole = searchParams.get('aiRole');

    if (!sourceContent) {
      return NextResponse.json(
        { error: 'sourceContent is required' },
        { status: 400 }
      );
    }

    // 백엔드 요청 (GET + query params)
    const backendRes = await fetch(
      `http://localhost:8080/api/language/honorific-variations?sourceContent=${encodeURIComponent(
        sourceContent
      )}${aiRole ? `&aiRole=${encodeURIComponent(aiRole)}` : ''}`,
      {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error in GET /api/language/honorific-variations:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
