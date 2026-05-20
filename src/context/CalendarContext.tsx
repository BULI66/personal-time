import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { loadEvents, addEvent, updateEvent, deleteEvent } from '../utils/storage';
import { generateRepeatingDatesCached, invalidateEventCache } from '../utils/cache';
import type { Event, CalendarContextType } from '../types';

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentView, setCurrentView] = useState<'year' | 'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['work', 'life', 'study', 'health', 'social', 'other']);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('calendar-theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const loadData = async () => {
      const savedEvents = await loadEvents();
      setEvents(savedEvents);
      initReminders(savedEvents);
    };
    
    loadData();
    applyTheme(theme);
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar-theme', theme);
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (themeValue: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', themeValue);
  };

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const initReminders = (eventsList: Event[]) => {
    eventsList.forEach(event => {
      if (event.reminder > 0) {
        const eventTime = new Date(`${event.date}T${event.startTime}`);
        const reminderTime = new Date(eventTime.getTime() - event.reminder * 60 * 1000);
        
        if (reminderTime > new Date()) {
          const timeout = reminderTime.getTime() - Date.now();
          setTimeout(() => {
            showNotification(event);
          }, timeout);
        }
      }
    });
  };

  const showNotification = (event: Event) => {
    const notification = document.getElementById('notification');
    const notifIcon = document.getElementById('notifIcon');
    const notifTitle = document.getElementById('notifTitle');
    
    if (notification && notifIcon && notifTitle) {
      notifIcon.textContent = '🔔';
      notifTitle.textContent = event.title;
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
      }, 5000);
    }
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(event.title, {
        body: `${event.date} ${event.startTime}`,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📅</text></svg>'
      });
    }
  };

  const expandRepeatingEvents = useCallback((eventsList: Event[]): Event[] => {
    const expanded: Event[] = [];
    
    eventsList.forEach(event => {
      const dates = generateRepeatingDatesCached(event);
      dates.forEach(date => {
        expanded.push({
          ...event,
          displayDate: date
        });
      });
    });
    
    return expanded;
  }, []);

  const filteredEvents = useMemo(() => {
    let result = events.filter(e => selectedCategories.includes(e.category));
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return expandRepeatingEvents(result);
  }, [events, selectedCategories, searchQuery, expandRepeatingEvents]);

  const handleAddEvent = useCallback((eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvents = addEvent(events, eventData);
    setEvents(newEvents);
    initReminders([{ ...eventData, id: 'temp', createdAt: Date.now() }]);
  }, [events]);

  const handleUpdateEvent = useCallback((id: string, updates: Partial<Event>) => {
    invalidateEventCache(id);
    const newEvents = updateEvent(events, id, updates);
    setEvents(newEvents);
  }, [events]);

  const handleDeleteEvent = useCallback((id: string) => {
    invalidateEventCache(id);
    const newEvents = deleteEvent(events, id);
    setEvents(newEvents);
  }, [events]);

  const value = useMemo(() => ({
    events,
    setEvents,
    currentView,
    setCurrentView,
    currentDate,
    setCurrentDate,
    selectedCategories,
    setSelectedCategories,
    selectedEventId,
    setSelectedEventId,
    isModalOpen,
    setIsModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    editingEventId,
    setEditingEventId,
    searchQuery,
    setSearchQuery,
    theme,
    toggleTheme,
    filteredEvents,
    addEvent: handleAddEvent,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent
  }), [
    events,
    setEvents,
    currentView,
    setCurrentView,
    currentDate,
    setCurrentDate,
    selectedCategories,
    setSelectedCategories,
    selectedEventId,
    setSelectedEventId,
    isModalOpen,
    setIsModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    editingEventId,
    setEditingEventId,
    searchQuery,
    setSearchQuery,
    theme,
    toggleTheme,
    filteredEvents,
    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent
  ]);

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): CalendarContextType {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
