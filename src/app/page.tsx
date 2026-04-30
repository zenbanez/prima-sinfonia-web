import Link from "next/link";
import Image from "next/image";
import { 
  CalendarCheck, 
  Library, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent selection:bg-[var(--color-primary)] selection:text-white">
      {/* Navigation / Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-2">
          <div className="relative h-20 w-20 bg-white rounded-xl shadow-[0_0_15px_rgba(98,0,238,0.3)] flex items-center justify-center overflow-hidden">
            <Image 
              src="/logo.png" 
              alt="Prima Sinfonia Logo" 
              fill
              sizes="80px"
              className="object-contain p-2"
              priority
            />
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block pointer-events-none">
          <span className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] font-script drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            Prima Sinfonia
          </span>
        </div>

        <div className="flex gap-4">
          <Link href="/login" className="text-slate-300 hover:text-white font-medium px-4 py-2 transition-colors">
            Log In
          </Link>
          <Link href="/signup" className="hidden sm:inline-block px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/10 transition-all backdrop-blur-md">
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* Dynamic Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center relative">
          
          {/* Accreditation Badge */}
          <div className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 animate-fade-in sm:text-base text-sm shadow-[0_0_20px_rgba(98,0,238,0.2)]">
            <ShieldCheck className="w-5 h-5 text-[var(--color-secondary)]" />
            <span className="text-white/90 font-medium tracking-wide">
              Registered London College of Music Exam Center
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight max-w-4xl drop-shadow-2xl leading-tight">
            The Symphony of <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Music Education</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-10 font-light max-w-2xl leading-relaxed">
            The all-in-one portal connecting teachers and students. Schedule lessons, share resources, and track progress effortlessly towards LCM mastery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-md">
            <Link
              href="/signup"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-2xl hover:bg-purple-700 transition-all shadow-[0_0_25px_rgba(98,0,238,0.4)] hover:shadow-[0_0_35px_rgba(98,0,238,0.6)] hover:-translate-y-1"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#demo"
              className="flex items-center justify-center px-8 py-4 bg-white/5 text-white font-medium rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              View Demo
            </Link>
          </div>

          {/* Decorative glowing backdrops */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-primary)]/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </section>

        {/* Features Split (Teacher vs Student) */}
        <section className="w-full max-w-7xl mx-auto px-6 py-20 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Harmony in Practice</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">A finely tuned portal giving teachers the control they need and students the clarity they deserve.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Teacher Perspective */}
            <div className="glass-panel p-10 rounded-3xl border border-[var(--color-primary)]/20 relative overflow-hidden group hover:border-[var(--color-primary)]/50 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/10 blur-[80px] rounded-full group-hover:bg-[var(--color-primary)]/20 transition-colors -z-10" />
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Users className="w-8 h-8 text-[var(--color-primary)]" />
                For Teachers
              </h3>
              <ul className="space-y-4">
                {["Drag-and-drop calendar scheduling", "Manage multiple student profiles easily", "Upload and distribute digital resources", "Track lesson progress & leave notes"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-6 h-6 text-[var(--color-primary)] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Student Perspective */}
            <div className="glass-panel p-10 rounded-3xl border border-[var(--color-secondary)]/20 relative overflow-hidden group hover:border-[var(--color-secondary)]/50 transition-colors">
              <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--color-secondary)]/10 blur-[80px] rounded-full group-hover:bg-[var(--color-secondary)]/20 transition-colors -z-10" />
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-[var(--color-secondary)]" />
                For Students
              </h3>
              <ul className="space-y-4">
                {["Clear itinerary of upcoming lessons", "Direct download of sheet music & notes", "Mobile-friendly dashboard view", "Instant access to lesson feedback", "Structured path to LCM qualifications"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-6 h-6 text-[var(--color-secondary)] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="w-full max-w-7xl mx-auto px-6 py-20 mb-10 relative">
          <div className="absolute -top-1/4 right-0 w-[500px] h-[500px] bg-[var(--color-secondary)]/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            <div className="md:col-span-2 glass-panel rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CalendarCheck className="w-12 h-12 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Smart Scheduling</h3>
              <p className="text-slate-300 relative z-10 max-w-md">Our robust FullCalendar integration means scheduling conflicts are a thing of the past.</p>
            </div>
            <div className="glass-panel rounded-3xl p-8 flex flex-col justify-end hover:bg-white/10 transition-colors border border-white/5 hover:border-[var(--color-secondary)]/30">
              <Library className="w-12 h-12 text-[var(--color-secondary)] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Resource Library</h3>
              <p className="text-slate-400 text-sm">Centralized PDFs and image storage directly synced across all student devices.</p>
            </div>
            <div className="glass-panel rounded-3xl p-8 flex flex-col justify-end hover:bg-white/10 transition-colors border border-white/5 hover:border-[#3b82f6]/30">
              <ShieldCheck className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Secure Portals</h3>
              <p className="text-slate-400 text-sm">Role-based auth keeps sensitive data entirely private between instructor and student.</p>
            </div>
            <div className="md:col-span-2 glass-panel rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Users className="w-12 h-12 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Curriculum Tracking</h3>
              <p className="text-slate-300 relative z-10 max-w-md">Build organized learning tracks and guide students toward their LCM certifications.</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-xl mt-auto py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">Prima Sinfonia</span>
          </div>
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Prima Sinfonia.<br/>Registered London College of Music Exam Center.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}