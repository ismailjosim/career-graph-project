"use client";

import { useCallback, useEffect, useState } from "react";
import type { MonthlyStats } from "@/interfaces";
import { useSession } from "@/lib/auth-client";
import { clientCache } from "@/lib/client-cache";

const API_BASE_URL = "/api";

export function useMonthlyStats() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;
  const cacheKey = userId ? `monthly_stats_${userId}` : null;

  // Instant SWR cache hydration: 0ms load if cached
  const [stats, setStats] = useState<MonthlyStats | null>(() => {
    if (!cacheKey) return null;
    const cached = clientCache.get<MonthlyStats>(cacheKey);
    return cached?.data || null;
  });

  const [loading, setLoading] = useState<boolean>(() => {
    if (!cacheKey) return true;
    const cached = clientCache.get<MonthlyStats>(cacheKey);
    return !cached?.data;
  });

  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(
    async (forceRefresh = false) => {
      if (!userId || !cacheKey) {
        if (!isPending) setLoading(false);
        return;
      }

      const cached = clientCache.get<MonthlyStats>(cacheKey);
      if (!forceRefresh && cached && !cached.isStale && stats) {
        setLoading(false);
        return;
      }

      if (!cached?.data) {
        setLoading(true);
      }

      try {
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
        clientCache.set(cacheKey, data, 120_000, true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [userId, cacheKey, isPending, stats],
  );

  useEffect(() => {
    if (userId) {
      if (cacheKey && !stats) {
        const cached = clientCache.get<MonthlyStats>(cacheKey);
        if (cached?.data) {
          setStats(cached.data);
          setLoading(false);
        }
      }
      fetchStats();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchStats, userId, cacheKey, isPending, stats]);

  const refreshStats = async () => {
    if (!userId || !cacheKey) return;

    try {
      const response = await fetch(`${API_BASE_URL}/stats/monthly`, {
        method: "POST",
        headers: { "x-user-id": userId },
      });
      if (!response.ok) throw new Error("Failed to refresh stats");
      const data = await response.json();
      setStats(data);
      clientCache.set(cacheKey, data, 120_000, true);
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
