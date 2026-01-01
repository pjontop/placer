import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || ''
  try {
    const cookie = req.headers.get('cookie') || ''
    // Forward the cookie to backend so it can revoke server-side token
    const resp = await fetch(backend + '/api/auth/logout', {
      method: 'POST',
      headers: { cookie },
    })

    // If backend sets Set-Cookie to clear refresh cookie, forward it to the client
    const setCookie = resp.headers.get('set-cookie')
    const headers = setCookie ? { 'Set-Cookie': setCookie } : undefined

    return new NextResponse(null, { status: resp.status, headers })
  } catch (e) {
    return new NextResponse('Error proxying signout', { status: 500 })
  }
}
