import { Timestamp } from "firebase/firestore";

export type Role = "teacher" | "student";

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