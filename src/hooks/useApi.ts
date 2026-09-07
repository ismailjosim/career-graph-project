import { useState, useEffect } from "react";
import type { JobApplication, MonthlyStats } from "@/lib/validation";

const API_BASE_URL = "/api";
const USER_ID = "demo-user"; // Replace with actual user ID from auth

export function useJobApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/applications`, {
        headers: { "x-user-id": USER_ID },
      });
      if (!response.ok) throw new Error("Failed to fetch applications");
      const data = await response.json();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (app: Omit<JobApplication, "_id">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": USER_ID,
        },
        body: JSON.stringify(app),
      });
      if (!response.ok) throw new Error("Failed to create application");
      const newApp = await response.json();
      setApplications([newApp, ...applications]);
      return newApp;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const updateApplication = async (id: string, updates: Partial<JobApplication>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": USER_ID,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update application");
      const updated = await response.json();
      setApplications(applications.map((app) => (app._id === id ? updated : app)));
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": USER_ID },
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
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/stats/monthly`, {
        headers: { "x-user-id": USER_ID },
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/monthly`, {
        method: "POST",
        headers: { "x-user-id": USER_ID },
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
