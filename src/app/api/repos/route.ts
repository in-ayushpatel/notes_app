import { NextResponse } from 'next/server'
import { getAccessToken, getUserRepos } from '@/lib/github'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const token = await getAccessToken()
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const repos = await getUserRepos(token)
    return NextResponse.json({ repos })
  } catch (err) {
    console.error('/api/repos error:', err)
    return NextResponse.json({ error: 'Failed to fetch repos' }, { status: 500 })
  }
}
