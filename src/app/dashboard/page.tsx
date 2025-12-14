"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { useProjectStore } from "@/lib/store";

export default function DashboardPage() {
  const router = useRouter();
  const { project } = useProjectStore();

  useEffect(() => {
    // If no project, redirect to home
    if (!project) {
      router.push("/");
    }
  }, [project, router]);

  if (!project) {
    return null;
  }

  return <Dashboard />;
}

