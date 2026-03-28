# Prima Sinfonia Web - Development Plan

## Phase 1: Core Infrastructure & Auth
- [x] Initialize Next.js project with Tailwind CSS
- [x] Configure Firebase SDK (Auth, Firestore, Storage)
- [x] Set up Authentication Context / State Management
- [x] Build Login & Sign-up Pages (Email/Password)
- [x] Create Role-based Routing (Middleware or Provider to split Teacher vs Student routes)
- [x] Build Main Layout Shell (Sidebar, Header, responsive navigation)

## Phase 2: Database & Data Models
- [x] Define Firestore schemas for `Users` (roles) and `Lessons`
- [x] Create Firestore service functions (CRUD for lessons, fetching user profiles)
- [x] Create Firebase Storage upload functions for multimedia (PDFs, Images)

## Phase 3: Teacher Portal
- [x] **Teacher Dashboard**: Overview of upcoming lessons and recent activity
- [x] **Calendar View**: Interactive calendar to schedule and view lessons
- [x] **Lesson Builder**: Form to create/edit lessons and assign them to students
- [x] **Resource Upload**: Interface to attach sheet music and images
- [x] **Student Management**: View list of assigned students

## Phase 4: Student Portal
- [x] **Student Dashboard**: Next upcoming lesson and recent assigned materials
- [x] **My Schedule**: Calendar view of assigned lessons
- [x] **Lesson Details**: View specific lesson notes and download attached PDFs/Images

## Phase 5: Polish & Refinement
- [x] Implement real-time listeners for instant updates on lessons
- [x] Loading skeletons and error boundary states
- [x] Mobile responsiveness review
- [x] Final UI/UX polish (Colors, typography matching the original app)
