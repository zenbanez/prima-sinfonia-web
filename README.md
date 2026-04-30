# Prima Sinfonia Web 🎵

Prima Sinfonia is a comprehensive music school management application ported to the web with **Next.js**, **Tailwind CSS v4 (Glassmorphism theme)**, and **Firebase**. 

It streamlines the connection between teachers and students, allowing for efficient lesson management, interactive calendar scheduling, multimedia resource sharing, and progress tracking.

## ✨ Features

- **Role-Based Portals**: Tailored interfaces for Teachers and Students with distinct color themes (Deep Purple for Teachers, Teal for Students).
- **Interactive Calendar**: FullCalendar integration allowing teachers to schedule, drag-and-drop, and resize lesson durations seamlessly.
- **Lesson Management**:
  - Teachers can create, update, and schedule lessons dynamically.
  - Students can view their upcoming lessons, past history, and next scheduled class.
- **Resource Library**:
  - Support for attaching sheet music (PDFs) and images to lessons via Firebase Storage.
  - A dedicated searchable resource library for both teachers and students.
- **Real-time Synchronization**: Powered by Cloud Firestore `onSnapshot` listeners so schedules and dashboard metrics update instantly without refreshing.

## 🚀 Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend**: [Firebase](https://firebase.google.com/)
  - Authentication
  - Cloud Firestore (NoSQL Database)
  - Firebase Storage (File Hosting)
- **UI Components**:
  - `FullCalendar` for advanced scheduling.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore, Storage, and Auth enabled.

### Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd prima-sinfonia-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Firebase Configuration**:
   Create a `.env.local` file in the root directory and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🚢 Deployment (Firebase Hosting)

Since this app uses Next.js, Firebase Hosting provides native integration via the Firebase CLI. 

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in the project**:
   ```bash
   firebase init hosting
   ```
   - Select your existing Firebase project.
   - When asked if you want to use a web framework (experimental), select **Yes**. 
   - Choose **Next.js**.
   - Select your preferred region for Serverless functions (if SSR is needed).

4. **Deploy**:
   ```bash
   firebase deploy --only hosting
   ```

---
*Developed with ❤️ for music education.*