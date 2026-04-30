"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Lesson, AppUser } from "@/types";
import { getStudentsForTeacher, updateLesson, subscribeToTeacherLessons, updateStudentProgress } from "@/services/db";
import FullCalendar from "@fullcalendar/react";
import { Menu, X, TrendingUp, CheckCircle, Clock, ChevronRight, User } from "lucide-react";
import { getSyllabusByGrade } from "@/lib/syllabus";
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
  const [activeTab, setActiveTab] = useState<"dashboard" | "courses" | "students" | "resources" | "progress">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="flex h-screen bg-transparent overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 w-64 glass-panel border-r border-white/10 flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-between items-center p-6 border-b border-white/10 md:border-none md:pb-0">
          <div className="text-2xl font-extrabold tracking-wider text-white">Prima Sinfonia</div>
          <button className="md:hidden text-white hover:bg-white/10 p-1 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-2">
          <button onClick={() => { setActiveTab("dashboard"); setIsMobileMenuOpen(false); }} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "dashboard" ? "bg-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(98,0,238,0.3)]" : "hover:bg-white/5 text-slate-300"}`}>Dashboard</button>
          <button onClick={() => { setActiveTab("courses"); setIsMobileMenuOpen(false); }} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "courses" ? "bg-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(98,0,238,0.3)]" : "hover:bg-white/5 text-slate-300"}`}>Courses</button>
          <button onClick={() => { setActiveTab("students"); setIsMobileMenuOpen(false); }} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "students" ? "bg-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(98,0,238,0.3)]" : "hover:bg-white/5 text-slate-300"}`}>Students</button>
          <button onClick={() => { setActiveTab("progress"); setIsMobileMenuOpen(false); }} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "progress" ? "bg-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(98,0,238,0.3)]" : "hover:bg-white/5 text-slate-300"}`}>Progress Tracking</button>
          <button onClick={() => { setActiveTab("resources"); setIsMobileMenuOpen(false); }} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "resources" ? "bg-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(98,0,238,0.3)]" : "hover:bg-white/5 text-slate-300"}`}>Resources</button>
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
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative z-10 w-full">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border border-white/10" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {activeTab === "dashboard" ? "Teacher Dashboard" : activeTab === "courses" ? "Courses" : activeTab === "students" ? "My Students" : activeTab === "progress" ? "Progress Tracking" : "Resource Library"}
              </h1>
              <p className="text-slate-400 mt-2 text-base md:text-lg font-light">Welcome back, {user.name?.split(" ")[0] || "Teacher"}!</p>
            </div>
          </div>
          {activeTab === "dashboard" && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[var(--color-primary)] hover:bg-purple-700 text-white py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(98,0,238,0.5)] font-medium transition-all w-full md:w-auto mt-2 md:mt-0"
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
            <div className="glass-panel p-4 md:p-6 rounded-2xl border border-white/10 text-white fc-glass-theme overflow-x-auto">
              <div className="min-w-[600px] md:min-w-0">
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
                  dayHeaderFormat={{ weekday: 'short' }} // Shorter day names
                  events={lessons.map(lesson => {
                    const start = (lesson.date as any)?.toDate ? (lesson.date as any).toDate() : new Date(lesson.date as any);
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

        {activeTab === "progress" && (
          <div className="space-y-8">
            {/* Student Selector */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <User className="text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Select Student</h3>
                  <p className="text-xs text-slate-400">Manage milestones and LCM exam readiness</p>
                </div>
              </div>
              <select 
                value={selectedStudentId} 
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-[#1a1a2e] border border-white/10 text-white px-4 py-2 rounded-xl outline-none focus:border-[var(--color-primary)] min-w-[200px]"
              >
                <option value="">Choose a student...</option>
                {students.map(s => <option key={s.uid} value={s.uid}>{s.name}</option>)}
              </select>
            </div>

            {selectedStudentId ? (
              (() => {
                const student = students.find(s => s.uid === selectedStudentId);
                const progress = student?.progress;
                
                if (!progress) {
                  return (
                    <div className="glass-panel p-10 rounded-2xl border border-dashed border-white/20 text-center">
                      <TrendingUp className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-20" />
                      <h3 className="text-xl font-bold text-white mb-2">No Progress Data</h3>
                      <p className="text-slate-400 mb-6 max-w-sm mx-auto">This student hasn't started an LCM syllabus yet. Initialize one to start tracking milestones.</p>
                      
                      <div className="flex justify-center gap-4">
                        {["Initial", "Grade 1", "Grade 5"].map(grade => (
                          <button 
                            key={grade}
                            onClick={async () => {
                              const milestones = getSyllabusByGrade(grade);
                              await updateStudentProgress(selectedStudentId, {
                                currentGrade: grade,
                                instrument: "Piano",
                                milestones
                              });
                              // Refresh students list
                              const updated = await getStudentsForTeacher(user.uid);
                              setStudents(updated);
                            }}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-xl text-white font-medium transition-all"
                          >
                            Start {grade}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                const completedCount = progress.milestones.filter(m => m.completed).length;
                const totalCount = progress.milestones.length;
                const percentage = Math.round((completedCount / totalCount) * 100);

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Progress Overview */}
                    <div className="lg:col-span-1 space-y-6">
                      <div className="glass-panel p-6 rounded-2xl border border-white/10">
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Current Status</h4>
                        <div className="flex items-end justify-between mb-2">
                          <span className="text-3xl font-extrabold text-white">{progress.currentGrade}</span>
                          <span className="text-sm text-[var(--color-secondary)] font-bold">{percentage}% Ready</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-3 mb-6">
                          <div 
                            className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] h-3 rounded-full shadow-[0_0_10px_rgba(98,0,238,0.5)] transition-all duration-500" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Total Milestones</span>
                            <span className="text-white font-bold">{totalCount}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Completed</span>
                            <span className="text-green-400 font-bold">{completedCount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-indigo-500/5">
                        <div className="flex items-center gap-3 mb-4">
                          <TrendingUp className="text-[var(--color-secondary)] w-5 h-5" />
                          <h4 className="text-white font-bold">Exam Checklist</h4>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          Marking these off helps the student visualize their journey toward the final LCM certification.
                        </p>
                      </div>
                    </div>

                    {/* Milestones List */}
                    <div className="lg:col-span-2 space-y-4">
                      {["Technical Work", "Performance", "Discussion", "Sight Reading", "Aural Tests"].map(category => {
                        const catMilestones = progress.milestones.filter(m => m.category === category);
                        if (catMilestones.length === 0) return null;

                        return (
                          <div key={category} className="space-y-3">
                            <h5 className="text-white font-bold text-sm ml-2 flex items-center gap-2">
                              <span className="w-1 h-4 bg-[var(--color-primary)] rounded-full"></span>
                              {category}
                            </h5>
                            <div className="space-y-2">
                              {catMilestones.map(m => (
                                <div 
                                  key={m.id} 
                                  onClick={async () => {
                                    const newMilestones = progress.milestones.map(ms => 
                                      ms.id === m.id ? { ...ms, completed: !ms.completed } : ms
                                    );
                                    await updateStudentProgress(selectedStudentId, {
                                      ...progress,
                                      milestones: newMilestones
                                    });
                                    // Refresh students list
                                    const updated = await getStudentsForTeacher(user.uid);
                                    setStudents(updated);
                                  }}
                                  className={`group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${m.completed ? "bg-green-500/10 border-green-500/20 text-green-100" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${m.completed ? "bg-green-500 border-green-500" : "border-white/20 group-hover:border-white/40"}`}>
                                      {m.completed && <CheckCircle className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className="font-medium">{m.title}</span>
                                  </div>
                                  <ChevronRight className={`w-4 h-4 transition-transform ${m.completed ? "opacity-40" : "opacity-0 group-hover:opacity-40"}`} />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      
                      <button 
                        onClick={() => {
                          if (confirm("Are you sure you want to reset and re-initialize? This will erase current progress.")) {
                            updateStudentProgress(selectedStudentId, null);
                            const updated = getStudentsForTeacher(user.uid).then(setStudents);
                          }
                        }}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors pt-4 pl-2"
                      >
                        Reset Syllabus
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="glass-panel p-20 rounded-2xl border border-white/10 text-center">
                <div className="text-6xl mb-6 opacity-20">📈</div>
                <h3 className="text-2xl font-bold text-white mb-2">Track Student Growth</h3>
                <p className="text-slate-400 max-w-md mx-auto">Select a student above to see their LCM exam milestones and update their progress.</p>
              </div>
            )}
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