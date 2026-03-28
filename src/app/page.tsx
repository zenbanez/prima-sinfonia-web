import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <main className="text-center p-12 rounded-3xl max-w-lg w-full glass-panel">
        <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
          Prima Sinfonia
        </h1>
        <p className="text-lg text-slate-300 mb-8 font-light">
          The all-in-one music school management platform for teachers and students.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-xl hover:bg-purple-700 transition-all shadow-[0_0_15px_rgba(98,0,238,0.5)]"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-white/5 text-[var(--color-secondary)] font-medium rounded-xl border border-[var(--color-secondary)]/30 hover:bg-[var(--color-secondary)]/10 transition-all"
          >
            Create Account
          </Link>
        </div>
      </main>
    </div>
  );
}