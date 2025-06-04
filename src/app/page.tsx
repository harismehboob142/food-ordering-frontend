"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated, otherwise to dashboard
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Food Ordering System</h1>
        <p className="mt-2">Redirecting...</p>
      </div>
    </div>
  );
}
