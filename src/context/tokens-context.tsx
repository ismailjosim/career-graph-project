"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "@/lib/auth-client";
import { clientCache } from "@/lib/client-cache";

interface TokensContextType {
  tokens: number;
  loading: boolean;
  isLoaded: boolean;
  refreshTokens: () => Promise<void>;
  updateTokensLocally: (newBalance: number) => void;
}

const TokensContext = createContext<TokensContextType>({
  tokens: 50,
  loading: true,
  isLoaded: false,
  refreshTokens: async () => {},
  updateTokensLocally: () => {},
});

export function TokensProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  // Instant hydration from memory or sessionStorage
  const [tokens, setTokens] = useState<number>(() => {
    const cached = clientCache.get<number>("user_tokens");
    return typeof cached?.data === "number" ? cached.data : 50;
  });

  const [isLoaded, setIsLoaded] = useState<boolean>(() => {
    const cached = clientCache.get<number>("user_tokens");
    return typeof cached?.data === "number";
  });

  const [loading, setLoading] = useState<boolean>(() => {
    const cached = clientCache.get<number>("user_tokens");
    return !cached || cached.isStale;
  });

  const refreshTokens = useCallback(async () => {
    if (!session?.user) {
      if (!isPending) {
        setLoading(false);
      }
      return;
    }
    try {
      const cached = clientCache.get<number>("user_tokens");
      if (!cached) {
        setLoading(true);
      }

      const res = await fetch("/api/users/me");
      if (res.ok) {
        const data = await res.json();
        if (typeof data?.user?.tokens === "number") {
          setTokens(data.user.tokens);
          setIsLoaded(true);
          clientCache.set("user_tokens", data.user.tokens, 60_000, true);
        }
      }
    } catch (err) {
      console.error("Failed to fetch token balance:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.user, isPending]);

  useEffect(() => {
    refreshTokens();
  }, [refreshTokens]);

  const updateTokensLocally = useCallback((newBalance: number) => {
    setTokens(newBalance);
    setIsLoaded(true);
    clientCache.set("user_tokens", newBalance, 60_000, true);
  }, []);

  return (
    <TokensContext.Provider
      value={{ tokens, loading, isLoaded, refreshTokens, updateTokensLocally }}
    >
      {children}
    </TokensContext.Provider>
  );
}

export function useTokens() {
  return useContext(TokensContext);
}
