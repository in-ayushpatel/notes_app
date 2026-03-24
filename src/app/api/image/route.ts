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
    console.log('[api/image] Requested path:', path)
    if (!path) return new NextResponse('path is required', { status: 400 })

    const githubPath = `notes/${path}`
    console.log('[api/image] Fetching from GitHub:', githubPath)

    // Fetch the download URL from GitHub API
    const downloadUrl = await getImageDownloadUrl(
      token,
      repoInfo.owner,
      repoInfo.repo,
      githubPath
    )
    console.log('[api/image] Download URL fetched successfully.')

    // Securely redirect the browser to the raw GitHub download URL
    return NextResponse.redirect(downloadUrl)
  } catch (err) {
    console.error('/api/image GET error:', err)
    const message = err instanceof Error ? err.message : 'Failed to fetch image'
    
    // If it's a 404 from GitHub, return 404 to the browser
    if (message.includes('404')) {
      return new NextResponse('Image not found on GitHub', { status: 404 })
    }
    
    return new NextResponse(message, { status: 500 })
  }
}
