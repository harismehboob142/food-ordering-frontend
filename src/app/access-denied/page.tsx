"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AccessDenied() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 text-center bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-red-500">403</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Access Denied
        </h2>
        <p className="mt-2 text-gray-600">
          You don't have permission to access this page.
        </p>
        {user && (
          <p className="mt-2 text-gray-600">
            Your role: <span className="font-semibold">{user.role}</span>
            {user.country && (
              <>
                , Country: <span className="font-semibold">{user.country}</span>
              </>
            )}
          </p>
        )}
        <p className="mt-4 text-blue-600">
          Redirecting to dashboard in 3 seconds...
        </p>
      </div>
    </div>
  );
}
