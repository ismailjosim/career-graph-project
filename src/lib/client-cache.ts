/**
 * Zero-dependency in-memory client-side cache with Stale-While-Revalidate (SWR)
 * support and optional sessionStorage persistence for ultra-fast navigation.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // in milliseconds
}

class ClientCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  /**
   * Synchronously retrieve cached data if available.
   * Returns { data, isStale } so the UI can render instantly while revalidating.
   */
  get<T>(key: string): { data: T; isStale: boolean } | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) {
      if (typeof window !== "undefined") {
        try {
          const raw = sessionStorage.getItem(`cg_cache_${key}`);
          if (raw) {
            const parsed = JSON.parse(raw) as CacheEntry<T>;
            const isStale = Date.now() - parsed.timestamp > parsed.ttl;
            this.cache.set(key, parsed);
            return { data: parsed.data, isStale };
          }
        } catch {
          // ignore storage error
        }
      }
      return null;
    }

    const isStale = Date.now() - entry.timestamp > entry.ttl;
    return { data: entry.data, isStale };
  }

  /**
   * Save data into memory and optionally session storage.
   */
  set<T>(
    key: string,
    data: T,
    ttlMs = 120_000,
    persistToSession = false,
  ): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    };
    this.cache.set(key, entry as CacheEntry<unknown>);

    if (persistToSession && typeof window !== "undefined") {
      try {
        sessionStorage.setItem(`cg_cache_${key}`, JSON.stringify(entry));
      } catch {
        // quota exceeded or private browsing
      }
    }
  }

  /**
   * Invalidate one or more cache entries by prefix or exact key.
   */
  invalidate(prefixOrKey: string): void {
    for (const key of Array.from(this.cache.keys())) {
      if (key === prefixOrKey || key.startsWith(prefixOrKey)) {
        this.cache.delete(key);
      }
    }
    if (typeof window !== "undefined") {
      try {
        const fullPrefix = `cg_cache_${prefixOrKey}`;
        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const k = sessionStorage.key(i);
          if (k && (k === fullPrefix || k.startsWith(fullPrefix))) {
            keysToRemove.push(k);
          }
        }
        for (const k of keysToRemove) {
          sessionStorage.removeItem(k);
        }
      } catch {
        // ignore
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const clientCache = new ClientCache();
