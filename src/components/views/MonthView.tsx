import { useCalendar } from '../../context/CalendarContext';
import { getMonthDates, formatDate, isTodayUtil, isSameMonthUtil } from '../../utils/dateUtils';
import { CATEGORIES } from '../../utils/constants';
import type { Event } from '../../types';

interface MonthViewProps {
  onEventClick: (eventId: string) => void;
}

export default function MonthView({ onEventClick }: MonthViewProps) {
  const { currentDate, events, setCurrentDate, setCurrentView, setIsModalOpen } = useCalendar();

  const dates = getMonthDates(currentDate);
  const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return events.filter(e => {
      const displayDate = e.displayDate || e.date;
      return displayDate === dateStr;
    });
  };

  const handleDayClick = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length > 0) {
      setCurrentDate(date);
      setCurrentView('day');
    } else {
      setCurrentDate(date);
      setIsModalOpen(true);
    }
  };

  const handleEventClick = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    onEventClick(eventId);
  };

  return (
    <div className="month-view">
      <div className="month-weekdays">
        {WEEKDAYS.map(day => (
          <div key={day} className="weekday-header">
            <span className="weekday-name">{day}</span>
          </div>
        ))}
      </div>
      
      <div className="month-grid">
        {dates.map((date, index) => {
          const isCurrentMonth = isSameMonthUtil(date, currentDate);
          const isToday = isTodayUtil(date);
          const dayEvents = getEventsForDate(date);
          
          return (
            <div
              key={index}
              className={`day-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
              onClick={() => handleDayClick(date)}
            >
              <span className="day-number">{date.getDate()}</span>
              <div className="day-events">
                {dayEvents.slice(0, 3).map((event: Event) => (
                  <div
                    key={event.id}
                    className="event-bar"
                    style={{ backgroundColor: event.color }}
                    onClick={(e) => handleEventClick(e, event.id)}
                    title={event.title}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <span className="event-more">+{dayEvents.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
