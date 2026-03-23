import { NextResponse } from 'next/server'
import { getAccessToken, getAuthenticatedUser } from '@/lib/github'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const token = await getAccessToken()
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getAuthenticatedUser(token)
    return NextResponse.json(user)
  } catch (err) {
    console.error('/api/auth/me error:', err)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
