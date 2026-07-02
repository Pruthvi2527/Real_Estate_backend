const CACHE_TTL_MS = 30_000;

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class TtlCache {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry || Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  deleteByPrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }
}

export const propertyCache = new TtlCache();

export const PROPERTY_LIST_CACHE_KEY = 'properties:list:all';

export const getPropertyCacheKey = (id: string): string => `properties:id:${id}`;

export const invalidatePropertyCaches = (id?: string): void => {
  propertyCache.delete(PROPERTY_LIST_CACHE_KEY);
  propertyCache.deleteByPrefix('properties:list:page:');

  if (id) {
    propertyCache.delete(getPropertyCacheKey(id));
  }
};
