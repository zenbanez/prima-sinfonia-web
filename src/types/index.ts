import { Timestamp } from "firebase/firestore";

export type Role = "teacher" | "student";

export interface Milestone {
  id: string;
  title: string;
  category: "Technical Work" | "Performance" | "Discussion" | "Sight Reading" | "Aural Tests" | "Theory" | "Other";
  completed: boolean;
  targetDate?: Timestamp | Date | null;
}

export interface StudentProgress {
  currentGrade: string;
  instrument: string;
  milestones: Milestone[];
  lastUpdated: Timestamp | Date;
}

export interface PracticeLog {
  id?: string;
  studentId: string;
  durationMinutes: number;
  date: Timestamp | Date;
  notes?: string;
  createdAt: Timestamp | Date;
}

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Timestamp | Date;
  // If teacher, they might have a list of assigned student UIDs
  studentIds?: string[];
  // If student, they might have a list of assigned teacher UIDs
  teacherIds?: string[];
  
  // Progress Tracking Fields
  progress?: StudentProgress;
  isActive: boolean; // For current vs past students filtering
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "pdf" | "image";
  uploadedAt: Timestamp | Date;
}

export interface Lesson {
  id?: string;
  teacherId: string;
  studentId: string;
  title: string;
  date: Timestamp | Date;
  durationMinutes: number;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  attachments: Attachment[];
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}