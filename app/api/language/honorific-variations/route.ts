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
    const backendRes = await fetch('http//localhost:8080/api/language/honorific-variations',{
        method:"GET",
        headers:{
            Authorization:token,
        }
    });
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
