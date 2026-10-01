import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface ProfileErrorProps {
  error: string | null;
}

export function ProfileError({ error }: ProfileErrorProps) {
  return (
    <div className="card p-8 text-center text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 max-w-md mx-auto my-12 space-y-3">
      <AlertCircle className="w-8 h-8 mx-auto" />
      <h2 className="text-base font-bold">Profile Unavailable</h2>
      <p className="text-xs">
        {error || "Could not retrieve profile information."}
      </p>
      <Link
        href="/dashboard"
        className="btn-primary py-2 px-4 text-xs inline-block"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
