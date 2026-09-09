import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import type {
  CoverLetter,
  JobApplication,
  MonthlyStats,
  Resume,
  Wishlist,
} from "@/lib/validation";

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

export function useWishlist() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    if (!userId) {
      if (!isPending) setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        headers: { "x-user-id": userId },
      });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch wishlist");
      const data = await response.json();
      setWishlist(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId, isPending]);

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchWishlist, userId, isPending]);

  const addItem = async (
    item: Omit<Wishlist, "_id" | "userId" | "savedAt">,
  ) => {
    if (!userId) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ ...item, userId }),
      });
      if (!response.ok) throw new Error("Failed to add wishlist item");
      const newItem = await response.json();
      setWishlist((prev) => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const deleteItem = async (id: string) => {
    if (!userId) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      if (!response.ok) throw new Error("Failed to delete wishlist item");
      setWishlist((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const updateStatus = async (id: string, status: Wishlist["status"]) => {
    if (!userId) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      const updated = await response.json();
      setWishlist((prev) =>
        prev.map((item) => (item._id === id ? updated : item)),
      );
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  return {
    wishlist,
    loading,
    error,
    fetchWishlist,
    addItem,
    deleteItem,
    updateStatus,
  };
}

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
