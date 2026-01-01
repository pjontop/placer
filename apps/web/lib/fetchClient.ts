export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

let accessToken: string | null = null
let refreshFn: (() => Promise<string | null>) | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function setRefreshFunction(fn: () => Promise<string | null>) {
  refreshFn = fn
}

async function tryRefresh(): Promise<boolean> {
  if (!refreshFn) return false
  try {
    const newToken = await refreshFn()
    if (newToken) {
      setAccessToken(newToken)
      return true
    }
  } catch (e) {
    // ignore
  }
  return false
}

export async function apiFetch(path: string, method: RequestMethod = 'GET', body?: any, opts: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || ''
  const url = `${base}${path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...opts,
  })

  if (res.status === 401) {
    // try refresh once
    const refreshed = await tryRefresh()
    if (refreshed) {
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
      const retry = await fetch(url, {
        method,
        credentials: 'include',
        headers,
        body: body ? JSON.stringify(body) : undefined,
        ...opts,
      })
      return retry
    }
  }

  return res
}
