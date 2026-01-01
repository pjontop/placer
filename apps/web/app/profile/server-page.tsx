import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'

export default async function ProfileServerPage() {
  const user = await getServerSession()
  if (!user) redirect('/signin')

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Welcome, {user.username || user.email}</h1>
      <p className="mt-2 text-sm text-muted-foreground">User ID: {user.id}</p>
      <form action="/api/auth/signout" method="post" className="mt-4">
        <button type="submit" className="px-3 py-2 bg-red-500 text-white rounded">Sign out</button>
      </form>
    </div>
  )
}
