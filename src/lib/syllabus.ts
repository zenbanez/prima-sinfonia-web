import { Milestone } from "@/types";

export interface SyllabusPreset {
  grade: string;
  milestones: Omit<Milestone, "id">[];
}

export const PIANO_SYLLABUS: Record<string, SyllabusPreset> = {
  "Initial": {
    grade: "Initial",
    milestones: [
      { title: "C major scale (RH/LH)", category: "Technical Work", completed: false },
      { title: "A minor scale (RH/LH)", category: "Technical Work", completed: false },
      { title: "List A Performance Piece", category: "Performance", completed: false },
      { title: "List B Performance Piece", category: "Performance", completed: false },
      { title: "Discussion: Notes/Values", category: "Discussion", completed: false },
    ]
  },
  "Grade 1": {
    grade: "Grade 1",
    milestones: [
      { title: "C Major Scale (Hand Separately)", category: "Technical Work", completed: false },
      { title: "G Major Scale (Hand Separately)", category: "Technical Work", completed: false },
      { title: "F Major Scale (Hand Separately)", category: "Technical Work", completed: false },
      { title: "A Harmonic Minor (Hand Separately)", category: "Technical Work", completed: false },
      { title: "D Harmonic Minor (Hand Separately)", category: "Technical Work", completed: false },
      { title: "C Major Arpeggio", category: "Technical Work", completed: false },
      { title: "Performance List A: Item 1", category: "Performance", completed: false },
      { title: "Performance List B: Item 1", category: "Performance", completed: false },
      { title: "Performance List C: Item 1", category: "Performance", completed: false },
      { title: "Discussion: Symbols & Terms", category: "Discussion", completed: false },
      { title: "Sight Reading: Grade 1 Standard", category: "Sight Reading", completed: false },
      { title: "Aural Tests: Tests 1-3", category: "Aural Tests", completed: false },
    ]
  },
  "Grade 5": {
    grade: "Grade 5",
    milestones: [
      { title: "All Majors Scales (Hands Together)", category: "Technical Work", completed: false },
      { title: "All Minors Scales (Harmonic/Melodic)", category: "Technical Work", completed: false },
      { title: "Chromatic Scales starting on any white key", category: "Technical Work", completed: false },
      { title: "Performance List A: Selected Piece", category: "Performance", completed: false },
      { title: "Performance List B: Selected Piece", category: "Performance", completed: false },
      { title: "Performance List C: Selected Piece", category: "Performance", completed: false },
      { title: "Discussion: Historical Context", category: "Discussion", completed: false },
      { title: "Sight Reading: Grade 5 Standard", category: "Sight Reading", completed: false },
      { title: "Aural Tests: Tests 1-5", category: "Aural Tests", completed: false },
    ]
  }
};

export function getSyllabusByGrade(grade: string): Milestone[] {
  const preset = PIANO_SYLLABUS[grade];
  if (!preset) return [];
  
  return preset.milestones.map((m, idx) => ({
    ...m,
    id: `${grade.toLowerCase().replace(" ", "-")}-${idx}`
  })) as Milestone[];
}
