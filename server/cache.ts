// Simple in-memory cache for frequently accessed data
export class MemoryCache {
  private cache = new Map<string, { data: any; expires: number }>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, value: any, ttl?: number): void {
    const expires = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data: value, expires });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = new MemoryCache();

// Cleanup expired cache entries every 10 minutes
setInterval(() => cache.cleanup(), 10 * 60 * 1000);