import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params

  try {
    const auth = req.headers.get("authorization") // 👈 프론트에서 보낸 Authorization 꺼냄

    const backendRes = await fetch(
      `http://localhost:8080/api/messages/${messageId}/translate`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(auth ? { Authorization: auth } : {}), // 👈 토큰 전달
        },
      }
    )

    const text = await backendRes.text()

    return new NextResponse(text, {
      status: backendRes.status,
      headers: { 'Content-Type': 'text/plain' },
    })
  } catch (err) {
    console.error('Error in translate route:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
