"use client"

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
  }, [loading, user, router])

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Welcome, {user.username || user.email}</h1>
      <p className="mt-2 text-sm text-muted-foreground">User ID: {user.id}</p>
      <button onClick={() => signOut()} className="mt-4 px-3 py-2 bg-red-500 text-white rounded">Sign out</button>
    </div>
  )
}
