// Server-side session helper for Next.js server components
// - Calls backend /api/auth/refresh with credentials to obtain a new access token
// - Parses token to return basic user claims or null

function base64UrlDecode(input: string) {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/')
  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(b64)
  }
  return Buffer.from(b64, 'base64').toString('utf8')
}

function parseJwt(token: string | null) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[1]) return null
    const payload = JSON.parse(base64UrlDecode(parts[1]))
    return payload as Record<string, any>
  } catch (e) {
    return null
  }
}

export type ServerUser = { id: string; email?: string; username?: string }

export async function getServerSession(): Promise<ServerUser | null> {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || ''
  try {
    const res = await fetch(base + '/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return null
    const data = await res.json()
    const token = data.token as string | undefined
    if (!token) return null
    const claims = parseJwt(token)
    if (!claims) return null
    return { id: claims.sub, email: claims.email, username: claims.username }
  } catch (e) {
    return null
  }
}
