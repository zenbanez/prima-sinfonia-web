"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Let the AuthContext middleware handle the redirect based on role
      router.push("/dashboard"); 
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-md p-10 space-y-6 rounded-3xl glass-panel relative z-10">
        <h2 className="text-4xl font-extrabold text-center text-white tracking-tight">Login</h2>
        <p className="text-center text-slate-400 font-light">Welcome back to Prima Sinfonia</p>

        {error && <div className="p-3 text-sm text-red-200 bg-red-900/50 border border-red-500/30 rounded-xl">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white placeholder-white/30 transition-all outline-none"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white placeholder-white/30 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 text-white bg-[var(--color-primary)] rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0B0B14] shadow-[0_0_15px_rgba(98,0,238,0.5)] transition-all font-medium disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-center text-slate-400">
          New here?{" "}
          <Link href="/signup" className="text-[var(--color-secondary)] hover:text-teal-300 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}