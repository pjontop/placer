"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authClient from '../lib/auth'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  user: authClient.User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, name: string, password: string) => Promise<void>
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
            setUser({ id: payload.sub, email: payload.email, name: payload.name }) // changed to name instead of username TODO: replace it in backend :(
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
      const result = await authClient.signIn(email, password)
      if (result.success) {
        setUser(result.data)
      } else {
        throw new Error(result.error)
      }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, name: string, password: string) => {
    setLoading(true)
    try {
      const signUpResult = await authClient.signUp(email, name, password)
      if (!signUpResult.success) {
        throw new Error(signUpResult.error)
      }
      // signin after signup
      const signInResult = await authClient.signIn(email, password)
      if (signInResult.success) {
        setUser(signInResult.data)
      } else {
        throw new Error(signInResult.error)
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
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
