import { STORAGE_KEY } from './constants';
import { formatDate, getWeekDates } from './dateUtils';
import { encryptedLocalStorageSetItem, encryptedLocalStorageGetItem } from './encryption';
import type { Event } from '../types';

export async function loadEvents(): Promise<Event[]> {
  try {
    const data = await encryptedLocalStorageGetItem(STORAGE_KEY);
    return data || [];
  } catch (e) {
    console.error('Failed to load events:', e);
    try {
      const plainData = localStorage.getItem(STORAGE_KEY);
      return plainData ? JSON.parse(plainData) : [];
    } catch {
      return [];
    }
  }
}

export async function saveEvents(events: Event[]): Promise<void> {
  try {
    await encryptedLocalStorageSetItem(STORAGE_KEY, events);
  } catch (e) {
    console.error('Failed to save events:', e);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (err) {
      console.error('Failed to save events (fallback):', err);
    }
  }
}

export function addEvent(events: Event[], event: Omit<Event, 'id' | 'createdAt'>): Event[] {
  const newEvent: Event = {
    ...event,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    createdAt: Date.now()
  };
  const newEvents = [...events, newEvent];
  saveEvents(newEvents);
  return newEvents;
}

export function updateEvent(events: Event[], id: string, updates: Partial<Event>): Event[] {
  const newEvents = events.map(e => 
    e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e
  );
  saveEvents(newEvents);
  return newEvents;
}

export function deleteEvent(events: Event[], id: string): Event[] {
  const newEvents = events.filter(e => e.id !== id);
  saveEvents(newEvents);
  return newEvents;
}

export function getEventsForDate(events: Event[], dateStr: string): Event[] {
  return events.filter(e => e.date === dateStr);
}

export function getEventsForWeek(events: Event[], date: Date): Event[] {
  const weekDates = getWeekDates(date);
  const startStr = formatDate(weekDates[0]);
  const endStr = formatDate(weekDates[6]);
  
  return events.filter(e => e.date >= startStr && e.date <= endStr);
}
