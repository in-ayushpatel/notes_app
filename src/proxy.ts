import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'gh_token'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  // Protect /app routes
  if (pathname.startsWith('/app') && !token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect logged-in users away from landing page
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/app', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/app/:path*'],
}
