import Image from "next/image"
import Link from "next/link"
import SignInForm from "./signin-form"

export default function SignInPage() {
  return (
    <main className="min-h-svh flex items-center justify-center bg-[var(--color-background)]">
      <div className="container mx-auto py-12 px-6 flex flex-col md:flex-row gap-8 items-start md:items-stretch w-full max-w-screen-xl">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
          <div className="mb-6">
            <Image src="/placerLogo-WithoutText.svg" alt="Placer logo" width={32} height={32} />
          </div>

          <h1 className="text-3xl font-semibold text-[var(--color-foreground)] mb-2">Welcome Back!</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-6">Sign in to your account</p>

          <SignInForm />

          <p className="text-sm text-[var(--color-muted-foreground)] mt-6">
            Don't have an account? <Link href="/signup" className="underline">Sign up</Link>
          </p>
        </div>

        <div className="hidden md:block flex-1 max-w-[min(65vw,56rem)] rounded-2xl bg-[var(--color-foreground)] min-h-[60vh]" aria-hidden>
        </div>
      </div>
    </main>
  )
}