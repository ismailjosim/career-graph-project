"use client";

import { useCallback, useEffect, useState } from "react";
import type { CoverLetter } from "@/interfaces";
import { useSession } from "@/lib/auth-client";
import { clientCache } from "@/lib/client-cache";

const API_BASE_URL = "/api";

export function useCoverLetters() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;
  const cacheKey = userId ? `cover_letters_${userId}` : null;

  // Instant SWR cache hydration: 0ms load if cached
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>(() => {
    if (!cacheKey) return [];
    const cached = clientCache.get<CoverLetter[]>(cacheKey);
    return cached?.data || [];
  });

  const [loading, setLoading] = useState<boolean>(() => {
    if (!cacheKey) return true;
    const cached = clientCache.get<CoverLetter[]>(cacheKey);
    return !cached?.data;
  });

  const [error, setError] = useState<string | null>(null);

  const fetchCoverLetters = useCallback(
    async (forceRefresh = false) => {
      if (!userId || !cacheKey) {
        if (!isPending) setLoading(false);
        return;
      }

      const cached = clientCache.get<CoverLetter[]>(cacheKey);
      if (
        !forceRefresh &&
        cached &&
        !cached.isStale &&
        coverLetters.length > 0
      ) {
        setLoading(false);
        return;
      }

      if (!cached?.data || cached.data.length === 0) {
        setLoading(true);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/cover-letters`, {
          headers: { "x-user-id": userId },
        });
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch cover letters");
        const data: CoverLetter[] = await response.json();
        setCoverLetters(data);
        clientCache.set(cacheKey, data, 120_000, true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [userId, cacheKey, isPending, coverLetters.length],
  );

  useEffect(() => {
    if (userId) {
      if (cacheKey && coverLetters.length === 0) {
        const cached = clientCache.get<CoverLetter[]>(cacheKey);
        if (cached?.data) {
          setCoverLetters(cached.data);
          setLoading(false);
        }
      }
      fetchCoverLetters();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchCoverLetters, userId, cacheKey, isPending, coverLetters.length]);

  const createCoverLetter = async (data: {
    title: string;
    content: string;
  }) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/cover-letters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ ...data, userId }),
      });
      if (!response.ok) throw new Error("Failed to create cover letter");
      const newLetter = await response.json();
      setCoverLetters((prev) => {
        const updated = [newLetter, ...prev];
        clientCache.set(cacheKey, updated, 120_000, true);
        return updated;
      });
      return newLetter;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const updateCoverLetter = async (
    id: string,
    data: { title: string; content: string },
  ) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/cover-letters/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update cover letter");
      const updated = await response.json();
      setCoverLetters((prev) => {
        const next = prev.map((item) => (item._id === id ? updated : item));
        clientCache.set(cacheKey, next, 120_000, true);
        return next;
      });
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const deleteCoverLetter = async (id: string) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/cover-letters/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      if (!response.ok) throw new Error("Failed to delete cover letter");
      setCoverLetters((prev) => {
        const next = prev.filter((item) => item._id !== id);
        clientCache.set(cacheKey, next, 120_000, true);
        return next;
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  return {
    coverLetters,
    loading,
    error,
    fetchCoverLetters,
    createCoverLetter,
    updateCoverLetter,
    deleteCoverLetter,
  };
}
