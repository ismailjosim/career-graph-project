"use client";

import { useCallback, useEffect, useState } from "react";
import type { CoverLetter } from "@/interfaces";
import { useSession } from "@/lib/auth-client";

const API_BASE_URL = "/api";

export function useCoverLetters() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoverLetters = useCallback(async () => {
    if (!userId) {
      if (!isPending) setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/cover-letters`, {
        headers: { "x-user-id": userId },
      });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch cover letters");
      const data = await response.json();
      setCoverLetters(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId, isPending]);

  useEffect(() => {
    if (userId) {
      fetchCoverLetters();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchCoverLetters, userId, isPending]);

  const createCoverLetter = async (data: {
    title: string;
    content: string;
  }) => {
    if (!userId) throw new Error("Authentication required");

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
      setCoverLetters((prev) => [newLetter, ...prev]);
      return newLetter;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const updateCoverLetter = async (
    id: string,
    data: { title: string; content: string },
  ) => {
    if (!userId) throw new Error("Authentication required");

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
      setCoverLetters((prev) =>
        prev.map((item) => (item._id === id ? updated : item)),
      );
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const deleteCoverLetter = async (id: string) => {
    if (!userId) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/cover-letters/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      if (!response.ok) throw new Error("Failed to delete cover letter");
      setCoverLetters((prev) => prev.filter((item) => item._id !== id));
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
