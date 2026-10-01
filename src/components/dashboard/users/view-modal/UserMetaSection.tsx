"use client";

import { Calendar, Check, Coins, Copy } from "lucide-react";
import { useState } from "react";
import type { ManagedUser } from "../types";

interface UserMetaSectionProps {
  user: ManagedUser;
  onAdjustTokens?: (user: ManagedUser) => void;
}

export function UserMetaSection({
  user,
  onAdjustTokens,
}: UserMetaSectionProps) {
  const [copied, setCopied] = useState(false);

  const copyUserId = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* User ID */}
      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            User ID
          </span>
          <button
            type="button"
            onClick={copyUserId}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <p className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate select-all">
          {user.id}
        </p>
      </div>

      {/* Created At */}
      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
          Joined Date
        </span>
        <p className="text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Unknown"}
          </span>
        </p>
      </div>

      {/* Token Balance Card */}
      <div className="p-3 rounded-xl border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 col-span-1 sm:col-span-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
              Token Balance
            </span>
            <p className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
              {user.tokens ?? 50} Tokens
            </p>
          </div>
        </div>
        {onAdjustTokens && (
          <button
            type="button"
            onClick={() => onAdjustTokens(user)}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
          >
            Adjust Tokens
          </button>
        )}
      </div>
    </div>
  );
}
