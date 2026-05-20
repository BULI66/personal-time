import { describe, it } from 'vitest';
import { 
  generateId,
  formatDate,
  parseDateStr,
  formatDateDisplay,
  formatWeekDisplay,
  formatDayDisplay,
  getWeekDates,
  addDaysUtil,
  generateRepeatingDates
} from '../utils/dateUtils';
import type { Event } from '../types';

describe('dateUtils', () => {
  describe('generateId', () => {
    it('should generate a unique string ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
      expect(id1).not.toBe(id2);
    });
  });

  describe('formatDate', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024
      expect(formatDate(date)).toBe('2024-01-15');
    });
  });

  describe('parseDateStr', () => {
    it('should parse ISO date string to Date object', () => {
      const dateStr = '2024-06-15';
      const date = parseDateStr(dateStr);
      
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(5); // June is month index 5
      expect(date.getDate()).toBe(15);
    });
  });

  describe('formatDateDisplay', () => {
    it('should format date as YYYY年M月', () => {
      const date = new Date(2024, 5, 15); // June 15, 2024
      expect(formatDateDisplay(date)).toBe('2024年6月');
    });
  });

  describe('formatDayDisplay', () => {
    it('should format date with weekday', () => {
      const date = new Date(2024, 0, 1); // January 1, 2024 (Monday)
      expect(formatDayDisplay(date)).toBe('2024年1月1日 周一');
    });
  });

  describe('getWeekDates', () => {
    it('should return 7 days starting from Sunday', () => {
      const date = new Date(2024, 0, 3); // Wednesday, January 3, 2024
      const weekDates = getWeekDates(date);
      
      expect(weekDates.length).toBe(7);
      expect(weekDates[0].getDay()).toBe(0); // Sunday
      expect(weekDates[6].getDay()).toBe(6); // Saturday
    });
  });

  describe('addDaysUtil', () => {
    it('should add days to date', () => {
      const date = new Date(2024, 0, 1);
      const result = addDaysUtil(date, 5);
      
      expect(result.getDate()).toBe(6);
    });

    it('should handle month rollover', () => {
      const date = new Date(2024, 0, 30); // January 30
      const result = addDaysUtil(date, 3);
      
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(2);
    });
  });

  describe('generateRepeatingDates', () => {
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

    it('should return single date when no repeat', () => {
      const result = generateRepeatingDates(baseEvent);
      expect(result).toEqual(['2024-01-15']);
    });

    it('should generate daily repeating dates', () => {
      const event = { ...baseEvent, repeat: 'daily' as const };
      const result = generateRepeatingDates(event);
      
      expect(result.length).toBeGreaterThan(1);
      expect(result[0]).toBe('2024-01-15');
      expect(result[1]).toBe('2024-01-16');
    });

    it('should generate weekly repeating dates', () => {
      const event = { ...baseEvent, repeat: 'weekly' as const };
      const result = generateRepeatingDates(event);
      
      expect(result.length).toBeGreaterThan(1);
      expect(result[0]).toBe('2024-01-15');
      expect(result[1]).toBe('2024-01-22'); // 7 days later
    });

    it('should respect repeat end date', () => {
      const event = { 
        ...baseEvent, 
        repeat: 'daily' as const,
        repeatEndDate: '2024-01-17'
      };
      const result = generateRepeatingDates(event);
      
      expect(result).toEqual(['2024-01-15', '2024-01-16', '2024-01-17']);
    });
  });
});
