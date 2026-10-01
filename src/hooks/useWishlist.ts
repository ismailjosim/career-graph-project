"use client";

import { useCallback, useEffect, useState } from "react";
import type { Wishlist } from "@/interfaces";
import { useSession } from "@/lib/auth-client";
import { clientCache } from "@/lib/client-cache";

const API_BASE_URL = "/api";

export function useWishlist() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;
  const cacheKey = userId ? `wishlist_${userId}` : null;

  // Instant SWR cache hydration: 0ms load if cached
  const [wishlist, setWishlist] = useState<Wishlist[]>(() => {
    if (!cacheKey) return [];
    const cached = clientCache.get<Wishlist[]>(cacheKey);
    return cached?.data || [];
  });

  const [loading, setLoading] = useState<boolean>(() => {
    if (!cacheKey) return true;
    const cached = clientCache.get<Wishlist[]>(cacheKey);
    return !cached?.data;
  });

  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(
    async (forceRefresh = false) => {
      if (!userId || !cacheKey) {
        if (!isPending) setLoading(false);
        return;
      }

      const cached = clientCache.get<Wishlist[]>(cacheKey);
      if (!forceRefresh && cached && !cached.isStale && wishlist.length > 0) {
        setLoading(false);
        return;
      }

      if (!cached?.data || cached.data.length === 0) {
        setLoading(true);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/wishlist`, {
          headers: { "x-user-id": userId },
        });
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch wishlist");
        const data: Wishlist[] = await response.json();
        setWishlist(data);
        clientCache.set(cacheKey, data, 120_000, true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [userId, cacheKey, isPending, wishlist.length],
  );

  useEffect(() => {
    if (userId) {
      if (cacheKey && wishlist.length === 0) {
        const cached = clientCache.get<Wishlist[]>(cacheKey);
        if (cached?.data) {
          setWishlist(cached.data);
          setLoading(false);
        }
      }
      fetchWishlist();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [fetchWishlist, userId, cacheKey, isPending, wishlist.length]);

  const addItem = async (
    item: Omit<Wishlist, "_id" | "userId" | "savedAt">,
  ) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

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
      setWishlist((prev) => {
        const next = [newItem, ...prev];
        clientCache.set(cacheKey, next, 120_000, true);
        return next;
      });
      return newItem;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const deleteItem = async (id: string) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      if (!response.ok) throw new Error("Failed to delete wishlist item");
      setWishlist((prev) => {
        const next = prev.filter((item) => item._id !== id);
        clientCache.set(cacheKey, next, 120_000, true);
        return next;
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };

  const updateStatus = async (id: string, status: Wishlist["status"]) => {
    if (!userId || !cacheKey) throw new Error("Authentication required");

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
      setWishlist((prev) => {
        const next = prev.map((item) => (item._id === id ? updated : item));
        clientCache.set(cacheKey, next, 120_000, true);
        return next;
      });
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
