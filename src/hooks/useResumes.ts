"use client";

import { useCallback, useEffect, useState } from "react";
import type { Resume } from "@/interfaces";
import { useSession } from "@/lib/auth-client";
import { clientCache } from "@/lib/client-cache";

const API_BASE_URL = "/api";

export function useResumes() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;
  const cacheKey = userId ? `resumes_${userId}` : null;

  // Instant SWR cache hydration: 0ms load if cached
  const [resumes, setResumes] = useState<Resume[]>(() => {
    if (!cacheKey) return [];
    const cached = clientCache.get<Resume[]>(cacheKey);
    return cached?.data || [];
  });

  const [loading, setLoading] = useState<boolean>(() => {
    if (!cacheKey) return true;
    const cached = clientCache.get<Resume[]>(cacheKey);
    return !cached?.data;
  });

  const [error, setError] = useState<string | null>(null);

  const fetchResumes = useCallback(
    async (forceRefresh = false) => {
      if (!userId || !cacheKey) {
        if (!isPending) setLoading(false);
        return;
      }

      const cached = clientCache.get<Resume[]>(cacheKey);
      if (!forceRefresh && cached && !cached.isStale && resumes.length > 0) {
        setLoading(false);
        return;
      }

      // If we don't have any cached data yet, show loading spinner
      if (!cached?.data || cached.data.length === 0) {
        setLoading(true);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/resumes`, {
          headers: { "x-user-id": userId },
        });
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch resumes");
        const data: Resume[] = await response.json();
        setResumes(data);
        clientCache.set(cacheKey, data, 120_000, true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [userId, cacheKey, isPending, resumes.length],
  );

  useEffect(() => {
    if (userId) {
      // Re-hydrate from cache if userId just became available
      if (cacheKey && resumes.length === 0) {
        const cached = clientCache.get<Resume[]>(cacheKey);
        if (cached?.data) {
          setResumes(cached.data);
          setLoading(false);
        }
      }
      fetchResumes();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchResumes, userId, cacheKey, isPending, resumes.length]);

  const addResume = async (data: {
    name: string;
    fileName: string;
    fileUrl: string;
    cloudinaryPublicId?: string;
    fileSize?: number;
    rawText?: string;
  }) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ ...data, userId }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to add resume");
      }
      const newResume = await response.json();
      setResumes((prev) => {
        const updated = [newResume, ...prev];
        clientCache.set(cacheKey, updated, 120_000, true);
        return updated;
      });
      return newResume;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const deleteResume = async (id: string) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      if (!response.ok) throw new Error("Failed to delete resume");
      setResumes((prev) => {
        const updated = prev.filter((item) => item._id !== id);
        clientCache.set(cacheKey, updated, 120_000, true);
        return updated;
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const setDefaultResume = async (id: string) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

    try {
      // First update current default if exists
      for (const r of resumes) {
        if (r._id && r.isDefault && r._id !== id) {
          await fetch(`${API_BASE_URL}/resumes/${r._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": userId,
            },
            body: JSON.stringify({ isDefault: false }),
          });
        }
      }

      // Then set the selected resume as default
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ isDefault: true }),
      });
      if (!response.ok) throw new Error("Failed to set default resume");

      // Update local state and cache
      setResumes((prev) => {
        const updated = prev.map((r) => ({
          ...r,
          isDefault: r._id === id,
        }));
        clientCache.set(cacheKey, updated, 120_000, true);
        return updated;
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  return {
    resumes,
    loading,
    error,
    fetchResumes,
    addResume,
    deleteResume,
    setDefaultResume,
  };
}
