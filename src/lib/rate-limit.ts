type RateLimiterOptions = {
  windowMs: number;
  maxRequests: number;
};

type RateLimitRecord = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitRecord>();

export function rateLimit(
  identifier: string,
  options: RateLimiterOptions = { windowMs: 60 * 1000, maxRequests: 20 },
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record) {
    store.set(identifier, {
      count: 1,
      resetTime: now + options.windowMs,
    });
    return {
      success: true,
      limit: options.maxRequests,
      remaining: options.maxRequests - 1,
      reset: now + options.windowMs,
    };
  }

  // If the window has expired, reset it
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + options.windowMs;
    store.set(identifier, record);
    return {
      success: true,
      limit: options.maxRequests,
      remaining: options.maxRequests - 1,
      reset: record.resetTime,
    };
  }

  // If within window, increment count
  record.count += 1;
  store.set(identifier, record);

  const success = record.count <= options.maxRequests;
  const remaining = Math.max(0, options.maxRequests - record.count);

  return {
    success,
    limit: options.maxRequests,
    remaining,
    reset: record.resetTime,
  };
}

// Optional cleanup function if used in a long-running Node process
export function cleanupRateLimiter() {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key);
    }
  }
}
