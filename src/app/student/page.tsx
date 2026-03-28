"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Lesson, Attachment } from "@/types";
import { subscribeToStudentLessons } from "@/services/db";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import LoadingScreen from "@/components/LoadingScreen";

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "lessons" | "materials">("dashboard");

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    let unsubscribe: () => void;
    if (user?.uid) {
      unsubscribe = subscribeToStudentLessons(user.uid, (updatedLessons) => {
        setLessons(updatedLessons);
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  if (loading || !user) return <LoadingScreen message="Loading Student Portal" />;

  const now = new Date();
  const upcomingLessons = lessons.filter(l => {
    const d = l.date?.toDate ? l.date.toDate() : new Date(l.date as any);
    return d > now && l.status === "scheduled";
  });
  const nextLesson = upcomingLessons[0]; // Assuming lessons are sorted by date asc

  // Extract all attachments across all lessons
  const allAttachments: { lesson: Lesson; file: Attachment }[] = [];
  lessons.forEach(l => {
    l.attachments?.forEach(a => {
      allAttachments.push({ lesson: l, file: a });
    });
  });

  return (
    <div className="flex h-screen bg-transparent">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-white/10 flex flex-col relative z-20">
        <div className="p-6 text-2xl font-extrabold tracking-wider text-[var(--color-secondary)]">Prima Sinfonia</div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "dashboard" ? "bg-[var(--color-secondary)]/20 border border-[var(--color-secondary)]/50 text-[var(--color-secondary)] shadow-[0_0_15px_rgba(3,218,198,0.2)]" : "hover:bg-white/5 text-slate-300"}`}>Dashboard</button>
          <button onClick={() => setActiveTab("lessons")} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "lessons" ? "bg-[var(--color-secondary)]/20 border border-[var(--color-secondary)]/50 text-[var(--color-secondary)] shadow-[0_0_15px_rgba(3,218,198,0.2)]" : "hover:bg-white/5 text-slate-300"}`}>Lessons List</button>
          <button onClick={() => setActiveTab("materials")} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "materials" ? "bg-[var(--color-secondary)]/20 border border-[var(--color-secondary)]/50 text-[var(--color-secondary)] shadow-[0_0_15px_rgba(3,218,198,0.2)]" : "hover:bg-white/5 text-slate-300"}`}>Materials</button>
        </nav>
        <div className="p-6 border-t border-white/10 mt-auto">
          <div className="text-sm text-slate-400 mb-3 truncate">Logged in as {user.name || user.email} <br/><span className="text-[var(--color-primary)]">Student</span></div>
          <button 
            onClick={() => signOut(auth)}
            className="w-full text-left text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto relative z-10">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            {activeTab === "dashboard" ? "Student Dashboard" : activeTab === "lessons" ? "Lessons List" : "Materials"}
          </h1>
          <p className="text-slate-400 mt-2 text-lg font-light">Welcome back, {user.name?.split(" ")[0] || "Student"}!</p>
        </header>

        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Next Lesson Card */}
              <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-[var(--color-secondary)] border-white/10 hover:bg-white/10 transition-all cursor-pointer" onClick={() => nextLesson && setSelectedLesson(nextLesson)}>
                <h3 className="text-xl font-semibold text-white mb-4">Next Lesson</h3>
                {nextLesson ? (
                  <div>
                    <h4 className="text-2xl font-bold text-[var(--color-secondary)]">{nextLesson.title}</h4>
                    <p className="text-slate-300 mt-2 flex items-center gap-2">
                      <span>📅 {(nextLesson.date?.toDate ? nextLesson.date.toDate() : new Date(nextLesson.date as any)).toLocaleDateString()}</span>
                      <span>⏰ {(nextLesson.date?.toDate ? nextLesson.date.toDate() : new Date(nextLesson.date as any)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </p>
                    <p className="text-slate-400 text-sm mt-2 flex items-center gap-2">⏱️ {nextLesson.durationMinutes} mins</p>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm italic mt-2">You don't have any upcoming lessons scheduled.</p>
                )}
              </div>

              {/* Recent Materials */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer overflow-y-auto max-h-64" onClick={() => setActiveTab("materials")}>
                <h3 className="text-xl font-semibold text-white mb-4">Recent Materials</h3>
                {allAttachments.length > 0 ? (
                  <ul className="text-slate-300 text-sm space-y-3">
                    {allAttachments.slice(0, 5).map((att, idx) => (
                      <li key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl opacity-80">{att.file.type === "pdf" ? "📄" : "🖼️"}</span>
                          <div>
                            <p className="font-medium truncate max-w-[150px]">{att.file.name}</p>
                            <p className="text-xs text-slate-500">From: {att.lesson.title}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400 text-sm italic mt-2">No materials uploaded yet.</p>
                )}
              </div>
            </div>

            {/* Schedule Calendar for Student (Read Only) */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">My Schedule</h2>
              <div className="glass-panel p-6 rounded-2xl border border-white/10 text-white fc-glass-theme">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "timeGridWeek,timeGridDay"
                  }}
                  slotMinTime="08:00:00"
                  slotMaxTime="20:00:00"
                  allDaySlot={false}
                  events={lessons.map(lesson => {
                    const start = lesson.date?.toDate ? lesson.date.toDate() : new Date(lesson.date as any);
                    const end = new Date(start.getTime() + lesson.durationMinutes * 60000);
                    return {
                      id: lesson.id,
                      title: lesson.title,
                      start,
                      end,
                      backgroundColor: 'var(--color-secondary)',
                      extendedProps: { lesson } // For clicking event
                    };
                  })}
                  eventClick={(info) => {
                    setSelectedLesson(info.event.extendedProps.lesson);
                  }}
                  height="auto"
                />
              </div>
            </div>
          </>
        )}

        {activeTab === "lessons" && (
          <div className="space-y-4">
            {lessons.filter(l => (l.date?.toDate ? l.date.toDate() : new Date(l.date as any)) < now).length === 0 ? (
              <p className="text-slate-400 italic">No past lessons found.</p>
            ) : (
              lessons
                .filter(l => (l.date?.toDate ? l.date.toDate() : new Date(l.date as any)) < now)
                .sort((a, b) => {
                  const d1 = a.date?.toDate ? a.date.toDate() : new Date(a.date as any);
                  const d2 = b.date?.toDate ? b.date.toDate() : new Date(b.date as any);
                  return d2.getTime() - d1.getTime(); // Descending (most recent first)
                })
                .map(lesson => (
                  <div key={lesson.id} className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setSelectedLesson(lesson)}>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{lesson.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">
                        📅 {(lesson.date?.toDate ? lesson.date.toDate() : new Date(lesson.date as any)).toLocaleDateString()} | ⏰ {(lesson.date?.toDate ? lesson.date.toDate() : new Date(lesson.date as any)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300 border border-white/20">
                        {lesson.status.toUpperCase()}
                      </span>
                      {lesson.attachments && lesson.attachments.length > 0 && (
                        <span className="text-xs text-[var(--color-secondary)]">📎 {lesson.attachments.length} Materials</span>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {activeTab === "materials" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAttachments.length === 0 ? (
              <p className="text-slate-400 italic col-span-full">No materials uploaded yet.</p>
            ) : (
              allAttachments.map((att, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl border border-[var(--color-secondary)]/30 hover:bg-white/10 transition-colors flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-4xl">{att.file.type === "pdf" ? "📄" : "🖼️"}</span>
                      <span className="text-xs px-2 py-1 bg-white/10 text-slate-300 rounded-lg uppercase">{att.file.type}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1 truncate" title={att.file.name}>{att.file.name}</h4>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">From: {att.lesson.title}</p>
                  </div>
                  <a href={att.file.url} target="_blank" rel="noopener noreferrer" className="w-full block text-center bg-[var(--color-secondary)] text-white py-2 rounded-xl font-medium hover:bg-teal-400 transition-colors shadow-[0_0_15px_rgba(3,218,198,0.3)]">
                    Download
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Lesson Details Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel p-8 rounded-3xl relative">
            <button 
              onClick={() => setSelectedLesson(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            
            <h2 className="text-3xl font-bold text-white mb-2">{selectedLesson.title}</h2>
            <div className="flex gap-4 mb-6">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-[var(--color-secondary)] border border-[var(--color-secondary)]/30">
                {selectedLesson.status.toUpperCase()}
              </span>
              <span className="text-slate-400 text-sm">
                ⏱️ {selectedLesson.durationMinutes} mins
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Schedule</h3>
                <p className="text-lg text-white">
                  {(selectedLesson.date?.toDate ? selectedLesson.date.toDate() : new Date(selectedLesson.date as any)).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
                </p>
              </div>

              {selectedLesson.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Teacher's Notes</h3>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-slate-300 italic">{selectedLesson.notes}</p>
                  </div>
                </div>
              )}

              {selectedLesson.attachments && selectedLesson.attachments.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Materials</h3>
                  <ul className="space-y-2">
                    {selectedLesson.attachments.map((att, idx) => (
                      <li key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                        <span className="text-slate-300 font-medium truncate max-w-[200px]">{att.name}</span>
                        <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-secondary)] hover:text-teal-300 bg-[var(--color-secondary)]/10 px-4 py-2 rounded-lg text-sm transition-colors">
                          Open {att.type === 'pdf' ? 'PDF' : 'Image'}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}