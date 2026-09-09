"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";

export default function HomePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [router, session, isPending]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl relative bg-white dark:bg-slate-800 p-2 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 border border-slate-200/80 dark:border-slate-700/60 animate-pulse">
          <Image
            src="/career-graph.png"
            alt="Career Graph Logo"
            width={52}
            height={52}
            priority
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-8 h-8 border-3 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
          Loading Career Graph...
        </p>
      </div>
    </div>
  );
}
