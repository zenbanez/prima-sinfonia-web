"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update Auth Profile
      await updateProfile(user, { displayName: name });

      // 3. Create document in Firestore Users collection with the chosen role
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        role: role,
        createdAt: new Date()
      });

      router.push("/dashboard"); // We'll build the routing logic next
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden py-12">
      <div className="w-full max-w-md p-10 space-y-6 rounded-3xl glass-panel relative z-10">
        <h2 className="text-4xl font-extrabold text-center text-white tracking-tight">Join Us</h2>
        <p className="text-center text-slate-400 font-light">Create your Prima Sinfonia account</p>

        {error && <div className="p-3 text-sm text-red-200 bg-red-900/50 border border-red-500/30 rounded-xl">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white transition-all outline-none"
              placeholder="Mozart"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white transition-all outline-none"
              placeholder="mozart@salzburg.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">I am a...</label>
            <div className="flex space-x-4">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                  className="peer sr-only"
                />
                <div className="text-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 peer-checked:bg-[var(--color-primary)]/20 peer-checked:border-[var(--color-primary)] peer-checked:text-white transition-all">
                  Student
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={role === "teacher"}
                  onChange={() => setRole("teacher")}
                  className="peer sr-only"
                />
                <div className="text-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 peer-checked:bg-[var(--color-primary)]/20 peer-checked:border-[var(--color-primary)] peer-checked:text-white transition-all">
                  Teacher
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 text-white bg-[var(--color-primary)] rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0B0B14] shadow-[0_0_15px_rgba(98,0,238,0.5)] transition-all font-medium disabled:opacity-50 mt-4"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-slate-400">
          Already registered?{" "}
          <Link href="/login" className="text-[var(--color-secondary)] hover:text-teal-300 transition-colors">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}