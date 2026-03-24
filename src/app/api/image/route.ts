import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken, getSelectedRepo, getImageDownloadUrl } from '@/lib/github'

export const dynamic = 'force-dynamic'

// GET /api/image?path=.images/...
export async function GET(request: NextRequest) {
  try {
    const token = await getAccessToken()
    if (!token) return new NextResponse('Unauthorized', { status: 401 })

    const repoInfo = await getSelectedRepo()
    if (!repoInfo) return new NextResponse('No repo selected', { status: 400 })

    const path = request.nextUrl.searchParams.get('path')
    if (!path) return new NextResponse('path is required', { status: 400 })

    const githubPath = `notes/${path}`

    // Fetch the download URL from GitHub API
    const downloadUrl = await getImageDownloadUrl(
      token,
      repoInfo.owner,
      repoInfo.repo,
      githubPath
    )

    // Securely redirect the browser to the raw GitHub download URL
    return NextResponse.redirect(downloadUrl)
  } catch (err) {
    console.error('/api/image GET error:', err)
    return new NextResponse('Failed to fetch image', { status: 500 })
  }
}
