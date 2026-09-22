"use client";

import { useCallback, useEffect, useState } from "react";
import type { JobMarket } from "@/interfaces";
import { useSession } from "@/lib/auth-client";

const API_BASE_URL = "/api";

export function useJobMarket() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  const [markets, setMarkets] = useState<JobMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = useCallback(async () => {
    if (!userId) {
      if (!isPending) setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/job-market`, {
        headers: { "x-user-id": userId },
      });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch job markets");
      const data = await response.json();
      setMarkets(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId, isPending]);

  useEffect(() => {
    if (userId) {
      fetchMarkets();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchMarkets, userId, isPending]);

  const addMarket = async (
    item: Omit<JobMarket, "_id" | "userId" | "savedAt" | "visitCount">,
  ) => {
    if (!userId) throw new Error("Authentication required");

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
      setMarkets((prev) => [newMarket, ...prev]);
      return newMarket;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const updateMarket = async (id: string, updates: Partial<JobMarket>) => {
    if (!userId) throw new Error("Authentication required");

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
      setMarkets((prev) => prev.map((m) => (m._id === id ? updated : m)));
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const deleteMarket = async (id: string) => {
    if (!userId) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/job-market/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      if (!response.ok) throw new Error("Failed to delete job market");
      setMarkets((prev) => prev.filter((m) => m._id !== id));
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
      setMarkets((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, visitCount: (m.visitCount || 0) + 1 } : m,
        ),
      );
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
