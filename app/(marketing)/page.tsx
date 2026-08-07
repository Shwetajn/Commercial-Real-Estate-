"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MarketingPage() {
  const router = useRouter();

  useEffect(() => {
    // For this prototype, route immediately to login
    router.push('/login');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <p className="text-slate-500 animate-pulse">Redirecting to Enterprise Portal...</p>
    </div>
  );
}
