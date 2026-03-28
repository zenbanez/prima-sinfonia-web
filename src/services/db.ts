import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  Unsubscribe
} from "firebase/firestore";
import { AppUser, Lesson } from "@/types";

const USERS_COLLECTION = "users";
const LESSONS_COLLECTION = "lessons";

// ========================
// USER SERVICES
// ========================

export const getUserProfile = async (uid: string): Promise<AppUser | null> => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return { ...snap.data(), uid: snap.id } as AppUser;
  }
  return null;
};

// For a teacher to get their assigned students
export const getStudentsForTeacher = async (teacherUid: string): Promise<AppUser[]> => {
  // Query all users where role is student (for MVP we fetch all, ideally filter by teacherIds array-contains)
  const q = query(
    collection(db, USERS_COLLECTION),
    where("role", "==", "student")
  );
  
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), uid: d.id } as AppUser));
};

// ========================
// LESSON SERVICES
// ========================

export const createLesson = async (lessonData: Omit<Lesson, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const lessonsRef = collection(db, LESSONS_COLLECTION);
  const docRef = await addDoc(lessonsRef, {
    ...lessonData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateLesson = async (lessonId: string, updates: Partial<Lesson>): Promise<void> => {
  const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);
  await updateDoc(lessonRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteLesson = async (lessonId: string): Promise<void> => {
  const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);
  await deleteDoc(lessonRef);
};

// ONE-TIME FETCH (Fallback/Legacy)
export const getLessonsForTeacher = async (teacherId: string): Promise<Lesson[]> => {
  const q = query(
    collection(db, LESSONS_COLLECTION),
    where("teacherId", "==", teacherId),
    orderBy("date", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as Lesson));
};

export const getLessonsForStudent = async (studentId: string): Promise<Lesson[]> => {
  const q = query(
    collection(db, LESSONS_COLLECTION),
    where("studentId", "==", studentId),
    orderBy("date", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as Lesson));
};

// ========================
// REAL-TIME LISTENERS
// ========================

export const subscribeToTeacherLessons = (
  teacherId: string,
  onUpdate: (lessons: Lesson[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, LESSONS_COLLECTION),
    where("teacherId", "==", teacherId),
    orderBy("date", "asc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const lessons = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Lesson));
    onUpdate(lessons);
  }, (error) => {
    console.error("Teacher lessons subscription error:", error);
  });
};

export const subscribeToStudentLessons = (
  studentId: string,
  onUpdate: (lessons: Lesson[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, LESSONS_COLLECTION),
    where("studentId", "==", studentId),
    orderBy("date", "asc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const lessons = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Lesson));
    onUpdate(lessons);
  }, (error) => {
    console.error("Student lessons subscription error:", error);
  });
};