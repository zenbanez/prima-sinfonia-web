"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

export default function DashboardRouter() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "teacher") {
        router.push("/teacher");
      } else if (user.role === "student") {
        router.push("/student");
      } else {
        // Fallback or missing role handling
        console.warn("User has no role assigned");
      }
    }
  }, [user, loading, router]);

  return <LoadingScreen message="Routing to portal" />;
}