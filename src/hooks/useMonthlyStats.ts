"use client";

import { useCallback, useEffect, useState } from "react";
import type { MonthlyStats } from "@/interfaces";
import { useSession } from "@/lib/auth-client";

const API_BASE_URL = "/api";

export function useMonthlyStats() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userId) {
      if (!isPending) setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/stats/monthly`, {
        headers: { "x-user-id": userId },
      });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId, isPending]);

  useEffect(() => {
    if (userId) {
      fetchStats();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchStats, userId, isPending]);

  const refreshStats = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/stats/monthly`, {
        method: "POST",
        headers: { "x-user-id": userId },
      });
      if (!response.ok) throw new Error("Failed to refresh stats");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  return {
    stats,
    loading,
    error,
    fetchStats,
    refreshStats,
  };
}
