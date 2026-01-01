"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Label } from "@workspace/ui/components/label"
import { useAuth } from "@/hooks/useAuth"

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [agree, setAgree] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { signIn, loading } = useAuth()
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await signIn(email, password)
      router.push('/profile')
    } catch (err: any) {
      setError(err?.message || 'Sign in failed')
    }
  }

  return (
    <form className="w-full" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <Button size="sm" variant="outline" className="w-full rounded-2xl px-4 py-2 text-sm flex items-center justify-center gap-2" aria-label="Log in with Google">
          <Image src="/login-page/google-brands-solid-full.svg" alt="Google" width={18} height={18} className="-ml-1" />
          <span className="font-medium">Log in with Google</span>
        </Button>

        <Button size="sm" variant="outline" className="w-full rounded-2xl px-4 py-2 text-sm flex items-center justify-center gap-2" aria-label="Log in with Apple">
          <Image src="/login-page/apple-brands-solid-full.svg" alt="Apple" width={18} height={18} className="-ml-1" />
          <span className="font-medium">Log in with Apple</span>
        </Button>
      </div>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 border-t border-border" />
        <span className="text-sm text-center text-[var(--color-muted-foreground)] px-3">or</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <div className="mb-4">
        <Label htmlFor="signin-email" className="mb-2 text-sm text-[var(--color-foreground)]">Email address</Label>
        <Input id="signin-email" type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="mb-2 flex items-center justify-between">
        <Label htmlFor="signin-password" className="text-sm text-[var(--color-foreground)]">Password</Label>
        <Link href="#" className="text-sm underline text-[var(--color-muted-foreground)]">Forgot Password ?</Link>
      </div>

      <div className="mb-2">
        <div className="relative">
          <Input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            placeholder="A minimum of 8 Characters"
            className="pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button /* weird thingy with this but TODO: investigate later */
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6"
          >
            <Image
              src={showPassword ? "/login-page/eye-closed.svg" : "/login-page/eye.svg"}
              alt={showPassword ? "Hide" : "Show"}
              width={18}
              height={18}
            />
          </button>
        </div>
        <p className="text-xs text-[var(--color-muted-foreground)] mt-2">A minimum of 8 Characters</p>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Checkbox id="signin-agree" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
        <Label htmlFor="signin-agree" className="text-sm text-[var(--color-muted-foreground)]">I agree to the <a href="#" className="underline">Terms & Conditions</a></Label>
      </div>

      {error && <div className="text-sm text-destructive mt-3">{error}</div>}

      <div className="mt-6">
        <Button className="w-full rounded-2xl py-2 bg-[var(--color-foreground)] text-[var(--color-primary-foreground)] font-medium text-center" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</Button>
      </div>
    </form>
  )
}
