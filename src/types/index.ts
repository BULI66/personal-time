export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  color: string;
  tags: string[];
  reminder: number;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  repeatEndDate?: string;
  createdAt: number;
  updatedAt?: number;
  displayDate?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface CalendarContextType {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  currentView: 'year' | 'month' | 'week' | 'day';
  setCurrentView: React.Dispatch<React.SetStateAction<'year' | 'month' | 'week' | 'day'>>;
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedEventId: string | null;
  setSelectedEventId: React.Dispatch<React.SetStateAction<string | null>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingEventId: string | null;
  setEditingEventId: React.Dispatch<React.SetStateAction<string | null>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
}
