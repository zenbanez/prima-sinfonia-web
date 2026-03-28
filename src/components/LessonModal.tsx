"use client";

import { useState, useEffect } from "react";
import { AppUser, Lesson } from "@/types";
import { getStudentsForTeacher, createLesson } from "@/services/db";
import { uploadFile } from "@/services/storage";
import { useAuth } from "@/context/AuthContext";

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LessonModal({ isOpen, onClose, onSuccess }: LessonModalProps) {
  const { user } = useAuth();
  const [students, setStudents] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (user?.uid && isOpen) {
      getStudentsForTeacher(user.uid).then(setStudents).catch(console.error);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError("");

    try {
      let attachments: any[] = [];
      
      // Handle file upload if present
      if (file) {
        const fileData = await uploadFile(file, `lessons/${user.uid}`, setUploadProgress);
        attachments.push({
          id: fileData.id,
          name: fileData.name,
          url: fileData.url,
          type: fileData.type,
          uploadedAt: new Date()
        });
      }

      // Combine date and time into a single Date object
      const lessonDateTime = new Date(`${date}T${time}`);

      await createLesson({
        teacherId: user.uid,
        studentId,
        title,
        date: lessonDateTime,
        durationMinutes: parseInt(duration),
        status: "scheduled",
        notes,
        attachments
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to schedule lesson.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg glass-panel p-8 rounded-3xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Schedule Lesson</h2>
        
        {error && <div className="p-3 mb-4 text-sm text-red-200 bg-red-900/50 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Title</label>
            <input 
              type="text" required value={title} onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[var(--color-primary)]"
              placeholder="e.g. Piano - Sonata in C Major"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Student</label>
            <select 
              required value={studentId} onChange={e => setStudentId(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-white/10 rounded-xl text-white outline-none focus:border-[var(--color-primary)]"
            >
              <option value="" disabled>Select a student</option>
              {students.map(s => <option key={s.uid} value={s.uid}>{s.name} ({s.email})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Date</label>
              <input 
                type="date" required value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Time</label>
              <input 
                type="time" required value={time} onChange={e => setTime(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Duration (minutes)</label>
            <select 
              value={duration} onChange={e => setDuration(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-white/10 rounded-xl text-white outline-none focus:border-[var(--color-primary)]"
            >
              <option value="30">30 mins</option>
              <option value="45">45 mins</option>
              <option value="60">60 mins</option>
              <option value="90">90 mins</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Notes</label>
            <textarea 
              value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[var(--color-primary)]"
              placeholder="Practice goals, focus areas..."
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Attachment (PDF / Image)</label>
            <input 
              type="file" accept=".pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:bg-purple-700 cursor-pointer"
            />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div className="bg-[var(--color-secondary)] h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full mt-6 px-4 py-3 bg-[var(--color-primary)] hover:bg-purple-700 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(98,0,238,0.5)] transition-all disabled:opacity-50"
          >
            {loading ? "Scheduling..." : "Schedule Lesson"}
          </button>
        </form>
      </div>
    </div>
  );
}