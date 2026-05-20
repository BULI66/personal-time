import { useEffect } from 'react';
import { CalendarProvider, useCalendar } from './context/CalendarContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MonthView from './components/views/MonthView';
import WeekView from './components/views/WeekView';
import DayView from './components/views/DayView';
import YearView from './components/views/YearView';
import EventModal from './components/EventModal';
import EventDetailModal from './components/EventDetailModal';
import TodayFocus from './components/TodayFocus';
import ErrorBoundary from './components/ErrorBoundary';
import { formatDateDisplay, formatWeekDisplay, formatDayDisplay, addDaysUtil, addWeeksUtil, addMonthsUtil } from './utils/dateUtils';

function CalendarContent() {
  const { 
    currentView, 
    setCurrentView, 
    currentDate, 
    setCurrentDate, 
    setIsModalOpen,
    setIsDetailModalOpen,
    filteredEvents,
    setSelectedEventId
  } = useCalendar();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsModalOpen]);

  const handlePrev = () => {
    switch (currentView) {
      case 'year':
        setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
        break;
      case 'month':
        setCurrentDate(addMonthsUtil(currentDate, -1));
        break;
      case 'week':
        setCurrentDate(addWeeksUtil(currentDate, -1));
        break;
      case 'day':
        setCurrentDate(addDaysUtil(currentDate, -1));
        break;
    }
  };

  const handleNext = () => {
    switch (currentView) {
      case 'year':
        setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
        break;
      case 'month':
        setCurrentDate(addMonthsUtil(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeksUtil(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDaysUtil(currentDate, 1));
        break;
    }
  };

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsDetailModalOpen(true);
  };

  const renderView = () => {
    switch (currentView) {
      case 'year':
        return <YearView onEventClick={handleEventClick} />;
      case 'month':
        return <MonthView onEventClick={handleEventClick} />;
      case 'week':
        return <WeekView onEventClick={handleEventClick} />;
      case 'day':
        return <DayView onEventClick={handleEventClick} />;
      default:
        return <MonthView onEventClick={handleEventClick} />;
    }
  };

  const getDateDisplay = () => {
    switch (currentView) {
      case 'year':
        return `${currentDate.getFullYear()}年`;
      case 'month':
        return formatDateDisplay(currentDate);
      case 'week':
        return formatWeekDisplay(currentDate);
      case 'day':
        return formatDayDisplay(currentDate);
      default:
        return formatDateDisplay(currentDate);
    }
  };

  return (
    <div className="app">
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      <main className="main-container">
        <ErrorBoundary>
          <Sidebar />
        </ErrorBoundary>
        <div className="calendar-container">
          <div className="calendar-header">
            <h2 className="current-date">{getDateDisplay()}</h2>
            <div className="date-nav">
              <button className="date-nav-btn" onClick={handlePrev}>←</button>
              <button className="date-nav-btn" onClick={handleNext}>→</button>
            </div>
          </div>
          <ErrorBoundary>
            {renderView()}
          </ErrorBoundary>
        </div>
        <aside className="today-focus-sidebar">
          <ErrorBoundary>
            <TodayFocus onEventClick={handleEventClick} />
          </ErrorBoundary>
        </aside>
      </main>
      <ErrorBoundary>
        <EventModal />
      </ErrorBoundary>
      <ErrorBoundary>
        <EventDetailModal />
      </ErrorBoundary>
      
      <div className="notification" id="notification">
        <div className="notification-icon" id="notifIcon">🔔</div>
        <div className="notification-content">
          <div className="notification-title" id="notifTitle">活动提醒</div>
        </div>
        <button className="notification-close" onClick={() => {
          document.getElementById('notification')?.classList.remove('show');
        }}>×</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <CalendarProvider>
        <CalendarContent />
      </CalendarProvider>
    </ErrorBoundary>
  );
}
