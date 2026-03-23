import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// POST /api/repo/select — save selected repo as cookie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { owner, repo } = body

    if (!owner || !repo) {
      return NextResponse.json({ error: 'owner and repo are required' }, { status: 400 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('selected_repo', JSON.stringify({ owner, repo }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return response
  } catch (err) {
    console.error('/api/repo/select error:', err)
    return NextResponse.json({ error: 'Failed to select repo' }, { status: 500 })
  }
}

// GET /api/repo/select — get selected repo from cookie
export async function GET(request: NextRequest) {
  const raw = request.cookies.get('selected_repo')?.value
  if (!raw) return NextResponse.json({ repo: null })
  try {
    return NextResponse.json({ repo: JSON.parse(raw) })
  } catch {
    return NextResponse.json({ repo: null })
  }
}
