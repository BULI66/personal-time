import { describe, it, beforeEach, afterEach } from 'vitest';
import { addEvent, updateEvent, deleteEvent, getEventsForDate } from '../utils/storage';
import type { Event } from '../types';

describe('storage', () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Test Event 1',
      date: '2024-06-15',
      startTime: '09:00',
      endTime: '10:00',
      category: 'work',
      color: '#5B7C99',
      tags: ['meeting'],
      reminder: 15,
      repeat: 'none',
      createdAt: Date.now()
    },
    {
      id: '2',
      title: 'Test Event 2',
      date: '2024-06-15',
      startTime: '14:00',
      endTime: '15:00',
      category: 'life',
      color: '#D4A088',
      tags: [],
      reminder: 0,
      repeat: 'none',
      createdAt: Date.now()
    },
    {
      id: '3',
      title: 'Test Event 3',
      date: '2024-06-16',
      startTime: '10:00',
      endTime: '11:00',
      category: 'study',
      color: '#6FA07C',
      tags: ['exam'],
      reminder: 30,
      repeat: 'none',
      createdAt: Date.now()
    }
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('addEvent', () => {
    it('should add a new event to the list', () => {
      const newEvent = {
        title: 'New Event',
        date: '2024-06-17',
        startTime: '09:00',
        endTime: '10:00',
        category: 'work',
        color: '#5B7C99',
        tags: [],
        reminder: 15,
        repeat: 'none'
      };

      const result = addEvent(mockEvents, newEvent);
      
      expect(result.length).toBe(mockEvents.length + 1);
      expect(result[result.length - 1].title).toBe('New Event');
      expect(result[result.length - 1].id).toBeDefined();
      expect(result[result.length - 1].createdAt).toBeDefined();
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event', () => {
      const updates = {
        title: 'Updated Event',
        description: 'Updated description'
      };

      const result = updateEvent(mockEvents, '1', updates);
      
      expect(result.length).toBe(mockEvents.length);
      expect(result[0].title).toBe('Updated Event');
      expect(result[0].description).toBe('Updated description');
      expect(result[0].updatedAt).toBeDefined();
    });

    it('should not modify other events', () => {
      const updates = { title: 'Updated' };
      const result = updateEvent(mockEvents, '1', updates);
      
      expect(result[1].title).toBe('Test Event 2');
      expect(result[2].title).toBe('Test Event 3');
    });
  });

  describe('deleteEvent', () => {
    it('should remove an event from the list', () => {
      const result = deleteEvent(mockEvents, '2');
      
      expect(result.length).toBe(mockEvents.length - 1);
      expect(result.find(e => e.id === '2')).toBeUndefined();
    });

    it('should return same list when event not found', () => {
      const result = deleteEvent(mockEvents, 'nonexistent');
      
      expect(result.length).toBe(mockEvents.length);
    });
  });

  describe('getEventsForDate', () => {
    it('should return events for specific date', () => {
      const result = getEventsForDate(mockEvents, '2024-06-15');
      
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should return empty array when no events for date', () => {
      const result = getEventsForDate(mockEvents, '2024-06-18');
      
      expect(result).toEqual([]);
    });
  });
});
