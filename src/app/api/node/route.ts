import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken, getSelectedRepo, deleteNode } from '@/lib/github'

export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  try {
    const token = await getAccessToken()
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const repoInfo = await getSelectedRepo()
    if (!repoInfo) return NextResponse.json({ error: 'No repo selected' }, { status: 400 })

    const body = await request.json()
    const { path } = body

    if (!path) {
      return NextResponse.json({ error: 'path is required' }, { status: 400 })
    }

    await deleteNode(
      token,
      repoInfo.owner,
      repoInfo.repo,
      path
    )

    return NextResponse.json({ success: true, path })
  } catch (err) {
    console.error('/api/node DELETE error:', err)
    const message = err instanceof Error ? err.message : 'Failed to delete node'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
