"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Lesson, Attachment, StudentProgress, PracticeLog } from "@/types";
import { subscribeToStudentLessons, subscribeToStudentProgress, addPracticeLog, subscribeToPracticeLogs } from "@/services/db";
import FullCalendar from "@fullcalendar/react";
import { Menu, X, TrendingUp, Clock, Play, Square, Save, Award, CheckCircle2, History } from "lucide-react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import LoadingScreen from "@/components/LoadingScreen";

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "lessons" | "materials" | "progress">("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Progress & Practice State
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerElapsed, setTimerElapsed] = useState(0); // in seconds
  const [practiceNotes, setPracticeNotes] = useState("");
  const [isSavingLog, setIsSavingLog] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    let unsubLessons: () => void;
    let unsubProgress: () => void;
    let unsubLogs: () => void;

    if (user?.uid) {
      unsubLessons = subscribeToStudentLessons(user.uid, setLessons);
      unsubProgress = subscribeToStudentProgress(user.uid, setProgress);
      unsubLogs = subscribeToPracticeLogs(user.uid, setPracticeLogs);
    }

    return () => {
      if (unsubLessons) unsubLessons();
      if (unsubProgress) unsubProgress();
      if (unsubLogs) unsubLogs();
    };
  }, [user]);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ":" : ""}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSavePractice = async () => {
    if (!user || !user.uid) return;
    
    if (timerElapsed < 60) {
      if (!confirm("Your session was less than a minute. Save anyway?")) return;
    }
    
    setIsSavingLog(true);
    try {
      await addPracticeLog({
        studentId: user.uid,
        durationMinutes: Math.max(1, Math.round(timerElapsed / 60)),
        date: new Date(),
        notes: practiceNotes,
      });
      setIsTimerRunning(false);
      setTimerElapsed(0);
      setPracticeNotes("");
    } catch (error) {
      console.error("Failed to save practice log:", error);
    } finally {
      setIsSavingLog(false);
    }
  };

  if (loading || !user) return <LoadingScreen message="Loading Student Portal" />;

  const now = new Date();
  const upcomingLessons = lessons.filter(l => {
    const d = (l.date as any)?.toDate ? (l.date as any).toDate() : new Date(l.date as any);
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
          <div className="text-2xl font-extrabold tracking-wider text-[var(--color-secondary)]">Prima Sinfonia</div>
          <button className="md:hidden text-white hover:bg-white/10 p-1 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-2">
          <button onClick={() => { setActiveTab("dashboard"); setIsMobileMenuOpen(false); }} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "dashboard" ? "bg-[var(--color-secondary)]/20 border border-[var(--color-secondary)]/50 text-[var(--color-secondary)] shadow-[0_0_15px_rgba(3,218,198,0.2)]" : "hover:bg-white/5 text-slate-300"}`}>Dashboard</button>
          <button onClick={() => { setActiveTab("progress"); setIsMobileMenuOpen(false); }} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "progress" ? "bg-[var(--color-secondary)]/20 border border-[var(--color-secondary)]/50 text-[var(--color-secondary)] shadow-[0_0_15px_rgba(3,218,198,0.2)]" : "hover:bg-white/5 text-slate-300"}`}>My Progress</button>
          <button onClick={() => { setActiveTab("lessons"); setIsMobileMenuOpen(false); }} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "lessons" ? "bg-[var(--color-secondary)]/20 border border-[var(--color-secondary)]/50 text-[var(--color-secondary)] shadow-[0_0_15px_rgba(3,218,198,0.2)]" : "hover:bg-white/5 text-slate-300"}`}>Lessons List</button>
          <button onClick={() => { setActiveTab("materials"); setIsMobileMenuOpen(false); }} className={`w-full text-left block py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "materials" ? "bg-[var(--color-secondary)]/20 border border-[var(--color-secondary)]/50 text-[var(--color-secondary)] shadow-[0_0_15px_rgba(3,218,198,0.2)]" : "hover:bg-white/5 text-slate-300"}`}>Materials</button>
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
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative z-10 w-full">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border border-white/10" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {activeTab === "dashboard" ? "Student Dashboard" : activeTab === "lessons" ? "Lessons List" : activeTab === "progress" ? "My Progress" : "Materials"}
              </h1>
              <p className="text-slate-400 mt-2 text-base md:text-lg font-light">Welcome back, {user.name?.split(" ")[0] || "Student"}!</p>
            </div>
          </div>
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
                      <span>📅 {((nextLesson.date as any)?.toDate ? (nextLesson.date as any).toDate() : new Date(nextLesson.date as any)).toLocaleDateString()}</span>
                      <span>⏰ {((nextLesson.date as any)?.toDate ? (nextLesson.date as any).toDate() : new Date(nextLesson.date as any)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
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
              <div className="glass-panel p-4 md:p-6 rounded-2xl border border-white/10 text-white fc-glass-theme overflow-x-auto">
                <div className="min-w-[600px] md:min-w-0">
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
                    dayHeaderFormat={{ weekday: 'short' }}
                    events={lessons.map(lesson => {
                      const start = (lesson.date as any)?.toDate ? (lesson.date as any).toDate() : new Date(lesson.date as any);
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
            </div>
          </>
        )}

        {activeTab === "progress" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: Progress Stats & Timer */}
            <div className="lg:col-span-1 space-y-6">
              {/* Practice Timer */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-teal-500/10 to-transparent">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                    <Clock className="w-5 h-5 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-bold text-teal-100">Practice Timer</h3>
                </div>

                <div className="text-center py-6">
                  <div className="text-5xl font-mono font-extrabold text-white tracking-widest mb-2">
                    {formatTime(timerElapsed)}
                  </div>
                  <p className="text-teal-400/60 text-xs uppercase tracking-widest font-bold">Focus & Record</p>
                </div>

                <div className="flex gap-3 mb-4">
                  {!isTimerRunning ? (
                    <button 
                      onClick={() => setIsTimerRunning(true)}
                      className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20"
                    >
                      <Play className="w-4 h-4 fill-current" /> Start
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsTimerRunning(false)}
                      className="flex-1 bg-red-500 hover:bg-red-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <Square className="w-4 h-4 fill-current" /> Stop
                    </button>
                  )}
                </div>

                {timerElapsed > 0 && !isTimerRunning && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <textarea 
                      value={practiceNotes}
                      onChange={(e) => setPracticeNotes(e.target.value)}
                      placeholder="What did you focus on today?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 outline-none focus:border-teal-500/50 min-h-[80px]"
                    />
                    <button 
                      onClick={handleSavePractice}
                      disabled={isSavingLog}
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-white/10 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" /> {isSavingLog ? "Saving..." : "Save Session"}
                    </button>
                  </div>
                )}
              </div>

              {/* Progress Summary Card */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <Award className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">LCM Readiness</h3>
                </div>

                {progress ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                          <circle 
                            cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                            strokeDasharray={364.4}
                            strokeDashoffset={364.4 - (364.4 * (progress.milestones.filter(m => m.completed).length / progress.milestones.length))}
                            className="text-teal-400 transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute text-2xl font-black text-white">
                          {Math.round((progress.milestones.filter(m => m.completed).length / progress.milestones.length) * 100)}%
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-white mt-4">{progress.currentGrade}</h4>
                      <p className="text-slate-400 text-sm">{progress.instrument}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm text-center py-4 italic">No active syllabus assigned by teacher yet.</p>
                )}
              </div>
            </div>

            {/* MIDDLE COLUMN: Milestones & Goals */}
            <div className="lg:col-span-2 space-y-6">
              {progress ? (
                <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-white">My Exam Milestones</h3>
                    <TrendingUp className="text-teal-400 w-6 h-6" />
                  </div>

                  <div className="space-y-8">
                    {["Technical Work", "Performance", "Discussion", "Sight Reading", "Aural Tests"].map(category => {
                      const catMilestones = progress.milestones.filter(m => m.category === category);
                      if (catMilestones.length === 0) return null;

                      return (
                        <div key={category} className="space-y-4">
                          <h4 className="text-teal-400/80 text-xs font-bold uppercase tracking-widest pl-2">{category}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {catMilestones.map(m => (
                              <div 
                                key={m.id}
                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${m.completed ? "bg-teal-500/10 border-teal-500/20" : "bg-white/5 border-white/5"}`}
                              >
                                {m.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-white/10 flex-shrink-0" />
                                )}
                                <span className={`text-sm font-medium ${m.completed ? "text-teal-100" : "text-slate-400"}`}>{m.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-20 rounded-3xl border border-white/10 text-center">
                  <TrendingUp className="w-16 h-16 text-white/10 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-2">Build Your Path</h3>
                  <p className="text-slate-400 max-w-sm mx-auto">Once your teacher assigns an LCM syllabus, your journey's milestones will appear here.</p>
                </div>
              )}

              {/* Practice History List */}
              <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-teal-400" /> Practice History
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">{practiceLogs.length} sessions logged</span>
                </div>

                <div className="space-y-3">
                  {practiceLogs.length === 0 ? (
                    <p className="text-slate-500 text-sm italic">You haven't logged any practice yet. Ready to start?</p>
                  ) : (
                    practiceLogs.map(log => (
                      <div key={log.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-white font-bold">{log.durationMinutes} mins</span>
                            <span className="text-slate-500 text-xs ml-3">
                              {log.date instanceof Date ? log.date.toLocaleDateString() : (log.date as any)?.toDate?.().toLocaleDateString() || new Date(log.date as any).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {log.notes && (
                          <p className="text-slate-400 text-sm italic line-clamp-1">{log.notes}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "lessons" && (
          <div className="space-y-4">
            {lessons.filter(l => ((l.date as any)?.toDate ? (l.date as any).toDate() : new Date(l.date as any)) < now).length === 0 ? (
              <p className="text-slate-400 italic">No past lessons found.</p>
            ) : (
              lessons
                .filter(l => ((l.date as any)?.toDate ? (l.date as any).toDate() : new Date(l.date as any)) < now)
                .sort((a, b) => {
                  const d1 = (a.date as any)?.toDate ? (a.date as any).toDate() : new Date(a.date as any);
                  const d2 = (b.date as any)?.toDate ? (b.date as any).toDate() : new Date(b.date as any);
                  return d2.getTime() - d1.getTime(); // Descending (most recent first)
                })
                .map(lesson => (
                  <div key={lesson.id} className="glass-panel p-4 md:p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setSelectedLesson(lesson)}>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{lesson.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">
                        📅 {((lesson.date as any)?.toDate ? (lesson.date as any).toDate() : new Date(lesson.date as any)).toLocaleDateString()} | ⏰ {((lesson.date as any)?.toDate ? (lesson.date as any).toDate() : new Date(lesson.date as any)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
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
          <div className="w-full max-w-lg glass-panel p-6 md:p-8 rounded-3xl relative overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setSelectedLesson(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedLesson.title}</h2>
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
                <p className="text-base md:text-lg text-white">
                  {((selectedLesson.date as any)?.toDate ? (selectedLesson.date as any).toDate() : new Date(selectedLesson.date as any)).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
                </p>
              </div>

              {selectedLesson.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Teacher's Notes</h3>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-slate-300 italic text-sm md:text-base">{selectedLesson.notes}</p>
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