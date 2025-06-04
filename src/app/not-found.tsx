'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 text-center bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">Page Not Found</h2>
        <p className="mt-2 text-gray-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <p className="mt-4 text-blue-600">
          Redirecting to dashboard in 3 seconds...
        </p>
      </div>
    </div>
  );
}
