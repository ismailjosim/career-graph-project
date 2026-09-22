"use client";

import { useCallback, useEffect, useState } from "react";
import type { JobApplication } from "@/interfaces";
import { useSession } from "@/lib/auth-client";

const API_BASE_URL = "/api";

export function useJobApplications() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!userId) {
      if (!isPending) setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/applications`, {
        headers: { "x-user-id": userId },
      });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch applications");
      const data = await response.json();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId, isPending]);

  useEffect(() => {
    if (userId) {
      fetchApplications();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchApplications, userId, isPending]);

  const createApplication = async (
    app: Omit<JobApplication, "_id" | "userId" | "appliedAt">,
  ) => {
    if (!userId) throw new Error("Authentication required");

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
      setApplications([newApp, ...applications]);
      return newApp;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const updateApplication = async (
    id: string,
    updates: Partial<JobApplication>,
  ) => {
    if (!userId) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update application");
      const updated = await response.json();
      setApplications(
        applications.map((app) => (app._id === id ? updated : app)),
      );
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const deleteApplication = async (id: string) => {
    if (!userId) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      if (!response.ok) throw new Error("Failed to delete application");
      setApplications(applications.filter((app) => app._id !== id));
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
