import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken, getSelectedRepo, updateFile } from '@/lib/github'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const token = await getAccessToken()
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const repoInfo = await getSelectedRepo()
    if (!repoInfo) return NextResponse.json({ error: 'No repo selected' }, { status: 400 })

    const body = await request.json()
    const { path, type } = body

    if (!path || !type) {
      return NextResponse.json({ error: 'path and type are required' }, { status: 400 })
    }

    if (type === 'file') {
      // Create an empty markdown file
      const filePath = path.endsWith('.md') ? path : `${path}.md`
      const result = await updateFile(
        token,
        repoInfo.owner,
        repoInfo.repo,
        filePath,
        `# ${filePath.split('/').pop()?.replace('.md', '') ?? 'New Note'}\n\n`,
        `create note: ${filePath}`
      )
      return NextResponse.json({ success: true, path: filePath, sha: result.sha })
    } else if (type === 'folder') {
      // GitHub doesn't support empty folders; create a .gitkeep
      const keepPath = `${path}/.gitkeep`
      await updateFile(
        token,
        repoInfo.owner,
        repoInfo.repo,
        keepPath,
        '',
        `create folder: ${path}`
      )
      return NextResponse.json({ success: true, path })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (err) {
    console.error('/api/create error:', err)
    const message = err instanceof Error ? err.message : 'Failed to create'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
