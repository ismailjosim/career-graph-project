"use client";

import { useCallback, useEffect, useState } from "react";
import type { Wishlist } from "@/interfaces";
import { useSession } from "@/lib/auth-client";

const API_BASE_URL = "/api";

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
