import SignInForm from "./signin-form"

export default function SignInPage() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-[var(--color-background)]">
      <div className="container mx-auto py-12 px-6 flex flex-col md:flex-row gap-8 items-start md:items-stretch w-full max-w-screen-xl">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
          <div className="mb-6">
            <img src="/placerLogo-WithoutText.svg" alt="Logo" className="w-8 h-8" />
          </div>

          <h1 className="text-3xl font-semibold text-[var(--color-foreground)] mb-2">Welcome Back!</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-6">pls gib credentials</p>

          <SignInForm />

          <p className="text-sm text-[var(--color-muted-foreground)] mt-6">Have an account? <a className="underline" href="#">Sign in</a></p>
        </div>

        <div className="hidden md:block flex-1 max-w-[min(65vw,56rem)] rounded-2xl bg-[var(--color-foreground)] min-h-[60vh]" aria-hidden>
          {/* Right-side visual panel from Figma (placeholder using foreground color) */}
        </div>
      </div>
    </div>
  )
}
