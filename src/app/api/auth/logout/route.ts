import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('gh_token')
  response.cookies.delete('selected_repo')
  return response
}
