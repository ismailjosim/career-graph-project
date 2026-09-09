"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Coins,
  History,
} from "lucide-react";
import type { TokenTransactionData } from "./types";

interface TokenTransactionsLedgerProps {
  transactions: TokenTransactionData[];
  loading: boolean;
}

export function TokenTransactionsLedger({
  transactions,
  loading,
}: TokenTransactionsLedgerProps) {
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "signup_bonus":
      case "email_verification_bonus":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "package_purchase":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "admin_grant":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "ats_check":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "cover_letter":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "fit_analysis":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  const formatTypeName = (type: string) => {
    switch (type) {
      case "signup_bonus":
        return "Signup Reward";
      case "email_verification_bonus":
        return "Email Verified";
      case "package_purchase":
        return "Package Purchase";
      case "admin_grant":
        return "Admin Adjustment";
      case "ats_check":
        return "ATS Audit";
      case "cover_letter":
        return "AI Cover Letter";
      case "fit_analysis":
        return "Job Fit Check";
      default:
        return type.replace(/_/g, " ");
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Token History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit log of credits, bonuses, and feature deductions
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
          <Clock className="w-5 h-5 animate-spin" />
          <span>Loading transactions...</span>
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
          <Coins className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No token transactions recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">Event</th>
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right">Tokens</th>
                <th className="pb-3 text-right">Balance</th>
                <th className="pb-3 text-right pr-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {transactions.map((tx) => {
                const isCredit = tx.amount > 0;
                return (
                  <tr
                    key={tx._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 pl-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(
                          tx.type,
                        )}`}
                      >
                        {isCredit ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {formatTypeName(tx.type)}
                      </span>
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-300 font-medium max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-3 text-right font-mono font-bold whitespace-nowrap">
                      <span
                        className={
                          isCredit
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-900 dark:text-slate-100"
                        }
                      >
                        {isCredit ? `+${tx.amount}` : tx.amount}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {tx.balanceAfter}
                    </td>
                    <td className="py-3 text-right pr-2 text-slate-400 whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
