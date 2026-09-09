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

interface TokensContextType {
  tokens: number;
  loading: boolean;
  refreshTokens: () => Promise<void>;
  updateTokensLocally: (newBalance: number) => void;
}

const TokensContext = createContext<TokensContextType>({
  tokens: 50,
  loading: true,
  refreshTokens: async () => {},
  updateTokensLocally: () => {},
});

export function TokensProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [tokens, setTokens] = useState<number>(50);
  const [loading, setLoading] = useState(true);

  const refreshTokens = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/users/me");
      if (res.ok) {
        const data = await res.json();
        if (typeof data?.user?.tokens === "number") {
          setTokens(data.user.tokens);
        }
      }
    } catch (err) {
      console.error("Failed to fetch token balance:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    refreshTokens();
  }, [refreshTokens]);

  const updateTokensLocally = useCallback((newBalance: number) => {
    setTokens(newBalance);
  }, []);

  return (
    <TokensContext.Provider
      value={{ tokens, loading, refreshTokens, updateTokensLocally }}
    >
      {children}
    </TokensContext.Provider>
  );
}

export function useTokens() {
  return useContext(TokensContext);
}
