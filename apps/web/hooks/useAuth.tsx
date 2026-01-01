"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authClient from '../lib/auth'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  user: authClient.User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<authClient.User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    // Try refresh on mount
    authClient.refresh().then((token) => {
      if (!mounted) return
      if (token) {
        try {
          const p = token.split('.')
          if (p.length === 3 && p[1]) {
            const payload = JSON.parse((globalThis as any).atob ? (globalThis as any).atob(p[1].replace(/-/g, '+').replace(/_/g, '/')) : Buffer.from(p[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))
            setUser({ id: payload.sub, email: payload.email, username: payload.username })
          }
        } catch (e) {
          setUser(null)
        }
      }
      setLoading(false)
    }).catch(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const claims = await authClient.signIn(email, password)
      if (claims) {
        setUser({ id: claims.sub, email: claims.email, username: claims.username })
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await authClient.signOut()
      setUser(null)
      router.push('/signin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
