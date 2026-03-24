import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken, getSelectedRepo, uploadBinary } from '@/lib/github'

export const dynamic = 'force-dynamic'

// POST /api/upload
export async function POST(request: NextRequest) {
  try {
    const token = await getAccessToken()
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const repoInfo = await getSelectedRepo()
    if (!repoInfo) return NextResponse.json({ error: 'No repo selected' }, { status: 400 })

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64Content = Buffer.from(arrayBuffer).toString('base64')
    
    // Create safe filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${Date.now()}-${safeName}`
    const relativePath = `.images/${filename}`
    const githubPath = `notes/${relativePath}`

    await uploadBinary(
      token,
      repoInfo.owner,
      repoInfo.repo,
      githubPath,
      base64Content,
      `Upload image ${filename}`
    )

    return NextResponse.json({ url: relativePath })
  } catch (err) {
    console.error('/api/upload error:', err)
    const message = err instanceof Error ? err.message : 'Failed to upload image'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
