import type { Event } from '../types';
import { generateRepeatingDates } from './dateUtils';

interface CacheItem {
  value: string[];
  lastAccessed: number;
  createdAt: number;
}

class Cache {
  private cache = new Map<string, CacheItem>();
  private maxSize = 100;

  get(key: string): string[] | null {
    const item = this.cache.get(key);
    if (item) {
      item.lastAccessed = Date.now();
      return item.value;
    }
    return null;
  }

  set(key: string, value: string[]): void {
    if (this.cache.size >= this.maxSize) {
      let oldestKey: string | null = null;
      let oldestTime = Date.now();
      
      this.cache.forEach((item, k) => {
        if (item.lastAccessed < oldestTime) {
          oldestTime = item.lastAccessed;
          oldestKey = k;
        }
      });
      
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    this.cache.set(key, {
      value,
      lastAccessed: Date.now(),
      createdAt: Date.now()
    });
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const repeatingEventsCache = new Cache();

export function generateCacheKey(event: Event): string {
  return `${event.id}-${event.date}-${event.repeat}-${event.repeatEndDate}`;
}

export function generateRepeatingDatesCached(event: Event): string[] {
  const cacheKey = generateCacheKey(event);
  const cached = repeatingEventsCache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const dates = generateRepeatingDates(event);
  repeatingEventsCache.set(cacheKey, dates);
  
  return dates;
}

export function cleanupOldCache(): void {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000;
  
  repeatingEventsCache.cache.forEach((item, key) => {
    if (now - item.createdAt > maxAge) {
      repeatingEventsCache.delete(key);
    }
  });
}

export function invalidateEventCache(eventId: string): void {
  repeatingEventsCache.cache.forEach((_, key) => {
    if (key.startsWith(eventId)) {
      repeatingEventsCache.delete(key);
    }
  });
}
