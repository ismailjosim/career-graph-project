"use client";

import { useCallback, useEffect, useState } from "react";
import type { JobMarket } from "@/interfaces";
import { useSession } from "@/lib/auth-client";
import { clientCache } from "@/lib/client-cache";

const API_BASE_URL = "/api";

export function useJobMarket() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;
  const cacheKey = userId ? `job_market_${userId}` : null;

  // Instant SWR cache hydration: 0ms load if cached
  const [markets, setMarkets] = useState<JobMarket[]>(() => {
    if (!cacheKey) return [];
    const cached = clientCache.get<JobMarket[]>(cacheKey);
    return cached?.data || [];
  });

  const [loading, setLoading] = useState<boolean>(() => {
    if (!cacheKey) return true;
    const cached = clientCache.get<JobMarket[]>(cacheKey);
    return !cached?.data;
  });

  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = useCallback(
    async (forceRefresh = false) => {
      if (!userId || !cacheKey) {
        if (!isPending) setLoading(false);
        return;
      }

      const cached = clientCache.get<JobMarket[]>(cacheKey);
      if (!forceRefresh && cached && !cached.isStale && markets.length > 0) {
        setLoading(false);
        return;
      }

      if (!cached?.data || cached.data.length === 0) {
        setLoading(true);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/job-market`, {
          headers: { "x-user-id": userId },
        });
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch job markets");
        const data: JobMarket[] = await response.json();
        setMarkets(data);
        clientCache.set(cacheKey, data, 180_000, true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [userId, cacheKey, isPending, markets.length],
  );

  useEffect(() => {
    if (userId) {
      if (cacheKey && markets.length === 0) {
        const cached = clientCache.get<JobMarket[]>(cacheKey);
        if (cached?.data) {
          setMarkets(cached.data);
          setLoading(false);
        }
      }
      fetchMarkets();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchMarkets, userId, cacheKey, isPending, markets.length]);

  const addMarket = async (
    item: Omit<JobMarket, "_id" | "userId" | "savedAt" | "visitCount">,
  ) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/job-market`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ ...item, userId }),
      });
      if (!response.ok) throw new Error("Failed to add job market");
      const newMarket = await response.json();
      setMarkets((prev) => {
        const next = [newMarket, ...prev];
        clientCache.set(cacheKey, next, 180_000, true);
        return next;
      });
      return newMarket;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const updateMarket = async (id: string, updates: Partial<JobMarket>) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/job-market/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update job market");
      const updated = await response.json();
      setMarkets((prev) => {
        const next = prev.map((m) => (m._id === id ? updated : m));
        clientCache.set(cacheKey, next, 180_000, true);
        return next;
      });
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const deleteMarket = async (id: string) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/job-market/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      if (!response.ok) throw new Error("Failed to delete job market");
      setMarkets((prev) => {
        const next = prev.filter((m) => m._id !== id);
        clientCache.set(cacheKey, next, 180_000, true);
        return next;
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    return updateMarket(id, { isFavorite: !current });
  };

  const visitMarket = async (id: string) => {
    try {
      fetch(`${API_BASE_URL}/job-market/${id}/visit`, {
        method: "POST",
        headers: { "x-user-id": userId || "" },
      }).catch(() => {});
      setMarkets((prev) => {
        const next = prev.map((m) =>
          m._id === id ? { ...m, visitCount: (m.visitCount || 0) + 1 } : m,
        );
        if (cacheKey) clientCache.set(cacheKey, next, 180_000, true);
        return next;
      });
    } catch {
      // background increment
    }
  };

  return {
    markets,
    loading,
    error,
    fetchMarkets,
    addMarket,
    updateMarket,
    deleteMarket,
    toggleFavorite,
    visitMarket,
  };
}
