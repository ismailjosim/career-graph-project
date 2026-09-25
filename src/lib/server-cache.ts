/**
 * Lightweight, in-memory TTL server cache for expensive database aggregations and analytics.
 */

interface ServerCacheEntry<T> {
  data: T;
  expiresAt: number;
}

class ServerCache {
  private cache = new Map<string, ServerCacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as ServerCacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set<T>(key: string, data: T, ttlSeconds = 60): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  invalidate(keyOrPrefix: string): void {
    for (const key of Array.from(this.cache.keys())) {
      if (key === keyOrPrefix || key.startsWith(keyOrPrefix)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

// Global singleton across server requests
const globalWithCache = global as typeof globalThis & {
  __cg_server_cache?: ServerCache;
};

export const serverCache =
  globalWithCache.__cg_server_cache || new ServerCache();

if (process.env.NODE_ENV !== "production") {
  globalWithCache.__cg_server_cache = serverCache;
}
