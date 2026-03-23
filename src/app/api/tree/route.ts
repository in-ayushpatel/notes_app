import { NextResponse } from 'next/server'
import { getAccessToken, getSelectedRepo, getRepoTree } from '@/lib/github'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const token = await getAccessToken()
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const repoInfo = await getSelectedRepo()
    if (!repoInfo) return NextResponse.json({ error: 'No repo selected' }, { status: 400 })

    const tree = await getRepoTree(token, repoInfo.owner, repoInfo.repo)
    return NextResponse.json({ tree })
  } catch (err) {
    console.error('/api/tree error:', err)
    return NextResponse.json({ error: 'Failed to fetch tree' }, { status: 500 })
  }
}
