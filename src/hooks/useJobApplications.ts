"use client";

import { useCallback, useEffect, useState } from "react";
import type { JobApplication } from "@/interfaces";
import { useSession } from "@/lib/auth-client";
import { clientCache } from "@/lib/client-cache";

const API_BASE_URL = "/api";

export function useJobApplications() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;
  const cacheKey = userId ? `applications_${userId}` : null;

  // Instant SWR cache hydration: 0ms load if cached
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    if (!cacheKey) return [];
    const cached = clientCache.get<JobApplication[]>(cacheKey);
    return cached?.data || [];
  });

  const [loading, setLoading] = useState<boolean>(() => {
    if (!cacheKey) return true;
    const cached = clientCache.get<JobApplication[]>(cacheKey);
    return !cached?.data;
  });

  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(
    async (forceRefresh = false) => {
      if (!userId || !cacheKey) {
        if (!isPending) setLoading(false);
        return;
      }

      const cached = clientCache.get<JobApplication[]>(cacheKey);
      if (
        !forceRefresh &&
        cached &&
        !cached.isStale &&
        applications.length > 0
      ) {
        setLoading(false);
        return;
      }

      if (!cached?.data || cached.data.length === 0) {
        setLoading(true);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/applications`, {
          headers: { "x-user-id": userId },
        });
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch applications");
        const data: JobApplication[] = await response.json();
        setApplications(data);
        clientCache.set(cacheKey, data, 120_000, true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [userId, cacheKey, isPending, applications.length],
  );

  useEffect(() => {
    if (userId) {
      if (cacheKey && applications.length === 0) {
        const cached = clientCache.get<JobApplication[]>(cacheKey);
        if (cached?.data) {
          setApplications(cached.data);
          setLoading(false);
        }
      }
      fetchApplications();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchApplications, userId, cacheKey, isPending, applications.length]);

  const createApplication = async (
    app: Omit<JobApplication, "_id" | "userId" | "appliedAt">,
  ) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ ...app, userId }),
      });
      if (!response.ok) throw new Error("Failed to create application");
      const newApp = await response.json();
      setApplications((prev) => {
        const next = [newApp, ...prev];
        clientCache.set(cacheKey, next, 120_000, true);
        return next;
      });
      return newApp;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const updateApplication = async (
    id: string,
    app: Partial<JobApplication>,
  ) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(app),
      });
      if (!response.ok) throw new Error("Failed to update application");
      const updated = await response.json();
      setApplications((prev) => {
        const next = prev.map((item) => (item._id === id ? updated : item));
        clientCache.set(cacheKey, next, 120_000, true);
        return next;
      });
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const deleteApplication = async (id: string) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      if (!response.ok) throw new Error("Failed to delete application");
      setApplications((prev) => {
        const next = prev.filter((item) => item._id !== id);
        clientCache.set(cacheKey, next, 120_000, true);
        return next;
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  return {
    applications,
    loading,
    error,
    fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
  };
}
