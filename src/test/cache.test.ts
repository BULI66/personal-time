import { describe, it, beforeEach } from 'vitest';
import { repeatingEventsCache, generateCacheKey, generateRepeatingDatesCached, cleanupOldCache, invalidateEventCache } from '../utils/cache';
import type { Event } from '../types';

describe('cache', () => {
  const baseEvent: Event = {
    id: 'test-event',
    title: 'Test Event',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '10:00',
    category: 'work',
    color: '#5B7C99',
    tags: [],
    reminder: 15,
    repeat: 'none',
    createdAt: Date.now()
  };

  beforeEach(() => {
    repeatingEventsCache.clear();
  });

  describe('generateCacheKey', () => {
    it('should generate unique cache key based on event properties', () => {
      const key1 = generateCacheKey(baseEvent);
      const event2 = { ...baseEvent, date: '2024-01-16' };
      const key2 = generateCacheKey(event2);
      
      expect(key1).toBe('test-event-2024-01-15-none-undefined');
      expect(key1).not.toBe(key2);
    });
  });

  describe('generateRepeatingDatesCached', () => {
    it('should cache and return repeating dates', () => {
      const event = { ...baseEvent, repeat: 'daily' as const };
      
      const result1 = generateRepeatingDatesCached(event);
      const result2 = generateRepeatingDatesCached(event);
      
      expect(result1).toBe(result2); // Should return cached result
      expect(repeatingEventsCache.size()).toBe(1);
    });

    it('should generate different results for different events', () => {
      const event1 = { ...baseEvent, id: 'event1', repeat: 'daily' as const };
      const event2 = { ...baseEvent, id: 'event2', repeat: 'daily' as const };
      
      const result1 = generateRepeatingDatesCached(event1);
      const result2 = generateRepeatingDatesCached(event2);
      
      expect(repeatingEventsCache.size()).toBe(2);
    });
  });

  describe('cleanupOldCache', () => {
    it('should remove old cache entries', () => {
      const event = { ...baseEvent, repeat: 'daily' as const };
      generateRepeatingDatesCached(event);
      
      expect(repeatingEventsCache.size()).toBe(1);
      
      // Manually set the cache item as old
      repeatingEventsCache.cache.forEach((item) => {
        item.createdAt = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days ago
      });
      
      cleanupOldCache();
      
      expect(repeatingEventsCache.size()).toBe(0);
    });
  });

  describe('invalidateEventCache', () => {
    it('should remove cache entries for specific event', () => {
      const event1 = { ...baseEvent, id: 'event1', repeat: 'daily' as const };
      const event2 = { ...baseEvent, id: 'event2', repeat: 'daily' as const };
      
      generateRepeatingDatesCached(event1);
      generateRepeatingDatesCached(event2);
      
      expect(repeatingEventsCache.size()).toBe(2);
      
      invalidateEventCache('event1');
      
      expect(repeatingEventsCache.size()).toBe(1);
    });
  });
});
