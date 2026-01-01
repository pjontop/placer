import { setAccessToken, setRefreshFunction } from './fetchClient'

function base64UrlDecode(input: string) {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/')
  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(b64)
  }
  return Buffer.from(b64, 'base64').toString('utf8')
}

function parseJwt(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[1]) return null
    const payload = JSON.parse(base64UrlDecode(parts[1]))
    return payload as Record<string, any>
  } catch (e) {
    return null
  }
}

export type User = {
  id: string
  email?: string
  username?: string
}

let _accessToken: string | null = null

export function getAccessToken() {
  return _accessToken
}

export async function signIn(email: string, password: string) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || ''
  const res = await fetch(base + '/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Login failed')
  }
  const data = await res.json()
  const token = data.token as string
  _accessToken = token
  setAccessToken(token)
  return parseJwt(token)
}

export async function refresh() {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || ''
  const res = await fetch(base + '/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  const token = data.token as string
  _accessToken = token
  setAccessToken(token)
  return token
}

export async function signOut() {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || ''
  await fetch(base + '/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })
  _accessToken = null
  setAccessToken(null)
}

// initialize refresh function for fetch client
setRefreshFunction(refresh)
