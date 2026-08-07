"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, currentRole } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/login");
    } else if (currentRole) {
      // Check role constraints if needed, e.g. a Sales exec shouldn't be in /supply
      if (pathname.startsWith('/supply') && currentRole !== 'Supply Executive') {
        router.push('/select-workspace');
      }
      if (pathname.startsWith('/sales') && currentRole !== 'Sales Executive') {
        router.push('/select-workspace');
      }
    } else {
      // Authenticated but no role selected
      router.push("/select-workspace");
    }
  }, [isAuthenticated, currentRole, router, pathname]);

  if (!mounted) return null; // Avoid hydration mismatch
  if (!isAuthenticated || !currentRole) return null; // Don't render until verified

  return <>{children}</>;
}
