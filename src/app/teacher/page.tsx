"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Lesson, AppUser } from "@/types";
import { getStudentsForTeacher, updateLesson, subscribeToTeacherLessons } from "@/services/db";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import LessonModal from "@/components/LessonModal";
import LoadingScreen from "@/components/LoadingScreen";

export default function TeacherDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<AppUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "courses" | "students" | "resources">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "teacher")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    let unsubscribe: () => void;
    
    if (user?.uid) {
      // 1. Fetch Students (One-time or could be real-time too)
      getStudentsForTeacher(user.uid)
        .then(setStudents)
        .catch(console.error);

      // 2. Setup Real-time Listener for Lessons
      unsubscribe = subscribeToTeacherLessons(user.uid, (updatedLessons) => {
        setLessons(updatedLessons);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  if (loading || !user) return <LoadingScreen message="Loading Teacher Portal" />;

  const allAttachments: { lesson: Lesson; file: any }[] = [];
  lessons.forEach(l => {
    l.attachments?.forEach(a => {
      allAttachments.push({ lesson: l, file: a });
    });
  });
  
  const filteredResources = allAttachments.filter(att => 
    att.file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    att.lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-transparent">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-white/10 flex flex-col relative z-20">
        <div className="p-6 text-2xl font-extrabold tracking-wider text-white">Prima Sinfonia</div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "dashboard" ? "bg-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(98,0,238,0.3)]" : "hover:bg-white/5 text-slate-300"}`}>Dashboard</button>
          <button onClick={() => setActiveTab("courses")} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "courses" ? "bg-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(98,0,238,0.3)]" : "hover:bg-white/5 text-slate-300"}`}>Courses</button>
          <button onClick={() => setActiveTab("students")} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "students" ? "bg-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(98,0,238,0.3)]" : "hover:bg-white/5 text-slate-300"}`}>Students</button>
          <button onClick={() => setActiveTab("resources")} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "resources" ? "bg-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(98,0,238,0.3)]" : "hover:bg-white/5 text-slate-300"}`}>Resources</button>
        </nav>
        <div className="p-6 border-t border-white/10 mt-auto">
          <div className="text-sm text-slate-400 mb-3 truncate">Logged in as {user.name || user.email} <br/><span className="text-[var(--color-secondary)]">Teacher</span></div>
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
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              {activeTab === "dashboard" ? "Teacher Dashboard" : activeTab === "courses" ? "Courses" : activeTab === "students" ? "My Students" : "Resource Library"}
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-light">Welcome back, {user.name?.split(" ")[0] || "Teacher"}!</p>
          </div>
          {activeTab === "dashboard" && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[var(--color-primary)] hover:bg-purple-700 text-white py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(98,0,238,0.5)] font-medium transition-all"
            >
              + Schedule Lesson
            </button>
          )}
        </header>

        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-2">Upcoming Lessons</h3>
                <p className="text-4xl font-bold text-[var(--color-secondary)]">{lessons.filter(l => l.status === "scheduled").length}</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setActiveTab("students")}>
                <h3 className="text-xl font-semibold text-white mb-2">Active Students</h3>
                <p className="text-4xl font-bold text-blue-400">{students.length}</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setActiveTab("resources")}>
                <h3 className="text-xl font-semibold text-white mb-2">Resources Shared</h3>
                <p className="text-4xl font-bold text-purple-400">
                  {allAttachments.length}
                </p>
              </div>
            </div>

            {/* Schedule Calendar */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 text-white fc-glass-theme">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
                    backgroundColor: 'var(--color-primary)',
                  };
                })}
                editable={true}
                droppable={true}
                eventDrop={async (info) => {
                  if (!info.event.start) return info.revert();
                  try {
                    await updateLesson(info.event.id, { date: info.event.start });
                    // No need to loadData(), real-time listener will catch it!
                  } catch(e) {
                    console.error("Failed to update lesson", e);
                    info.revert();
                  }
                }}
                eventResize={async (info) => {
                  if (!info.event.start || !info.event.end) return info.revert();
                  try {
                    const newDuration = Math.round((info.event.end.getTime() - info.event.start.getTime()) / 60000);
                    await updateLesson(info.event.id, { durationMinutes: newDuration });
                    // No need to loadData(), real-time listener will catch it!
                  } catch(e) {
                    console.error("Failed to update duration", e);
                    info.revert();
                  }
                }}
                height="auto"
              />
            </div>
          </>
        )}

        {activeTab === "courses" && (
          <div className="glass-panel p-10 rounded-2xl border border-white/10 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-white mb-2">Course Management</h3>
            <p className="text-slate-400 max-w-md mx-auto">This section is under construction. Soon you'll be able to build structured course curriculums and track student progressions through specific modules.</p>
          </div>
        )}

        {activeTab === "students" && (
          <div className="space-y-4">
            {students.length === 0 ? (
              <p className="text-slate-400 italic">No students assigned to you yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {students.map(student => (
                  <div key={student.uid} className="glass-panel p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{student.name}</h3>
                      <p className="text-sm text-slate-400">{student.email}</p>
                      <p className="text-xs text-[var(--color-secondary)] mt-2">
                        {lessons.filter(l => l.studentId === student.uid).length} lessons total
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)] flex items-center justify-center text-xl font-bold text-[var(--color-primary)] shadow-[0_0_10px_rgba(98,0,238,0.3)]">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "resources" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <input 
                type="text"
                placeholder="Search notes, sheets, or lesson titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[var(--color-primary)] placeholder-white/30"
              />
              <button className="ml-4 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-medium transition-all border border-white/10">
                + Upload Resource
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.length === 0 ? (
                <p className="text-slate-400 italic col-span-full">No matching resources found.</p>
              ) : (
                filteredResources.map((att, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl border border-[var(--color-primary)]/30 hover:bg-white/10 transition-colors flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-4xl">{att.file.type === "pdf" ? "📄" : "🖼️"}</span>
                        <span className="text-xs px-2 py-1 bg-white/10 text-slate-300 rounded-lg uppercase">{att.file.type}</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1 truncate" title={att.file.name}>{att.file.name}</h4>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">Assigned in: {att.lesson.title}</p>
                    </div>
                    <a href={att.file.url} target="_blank" rel="noopener noreferrer" className="w-full block text-center bg-[var(--color-primary)] text-white py-2 rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-[0_0_15px_rgba(98,0,238,0.3)]">
                      View File
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {isModalOpen && (
        <LessonModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}