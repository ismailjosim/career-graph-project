"use client";

import { useCallback, useEffect, useState } from "react";
import type { Resume } from "@/interfaces";
import { useSession } from "@/lib/auth-client";

const API_BASE_URL = "/api";

export function useResumes() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResumes = useCallback(async () => {
    if (!userId) {
      if (!isPending) setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        headers: { "x-user-id": userId },
      });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch resumes");
      const data = await response.json();
      setResumes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId, isPending]);

  useEffect(() => {
    if (userId) {
      fetchResumes();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchResumes, userId, isPending]);

  const addResume = async (data: {
    name: string;
    fileName: string;
    fileUrl: string;
    cloudinaryPublicId?: string;
    fileSize?: number;
  }) => {
    if (!userId) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ ...data, userId }),
      });
      if (!response.ok) throw new Error("Failed to add resume");
      const newResume = await response.json();
      setResumes((prev) => [newResume, ...prev]);
      return newResume;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const deleteResume = async (id: string) => {
    if (!userId) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      if (!response.ok) throw new Error("Failed to delete resume");
      setResumes((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const setDefaultResume = async (id: string) => {
    if (!userId) throw new Error("Authentication required");

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

      // Update local state
      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          isDefault: r._id === id,
        })),
      );
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
