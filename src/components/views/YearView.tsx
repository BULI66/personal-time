import { useCalendar } from '../../context/CalendarContext';
import { formatDate, isTodayUtil, addMonthsUtil } from '../../utils/dateUtils';
import { format, addMonths } from 'date-fns';
import { CATEGORIES } from '../../utils/constants';
import type { Event } from '../../types';

interface YearViewProps {
  onEventClick: (eventId: string) => void;
}

export default function YearView({ onEventClick }: YearViewProps) {
  const { currentDate, events, setCurrentDate, setCurrentView, setIsModalOpen } = useCalendar();

  const year = currentDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => addMonths(new Date(year, 0, 1), i));

  const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getEventsForMonth = (monthDate: Date) => {
    const monthStart = formatDate(new Date(monthDate.getFullYear(), monthDate.getMonth(), 1));
    const monthEnd = formatDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0));
    
    return events.filter(e => {
      const displayDate = e.displayDate || e.date;
      return displayDate >= monthStart && displayDate <= monthEnd;
    });
  };

  const getEventsForDay = (day: number, month: number, year: number) => {
    const dateStr = formatDate(new Date(year, month, day));
    return events.filter(e => {
      const displayDate = e.displayDate || e.date;
      return displayDate === dateStr;
    });
  };

  const handleMonthClick = (monthDate: Date) => {
    setCurrentDate(monthDate);
    setCurrentView('month');
  };

  const handleDayClick = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);
    setCurrentDate(date);
    setCurrentView('day');
  };

  const handleAddEvent = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);
    setCurrentDate(date);
    setIsModalOpen(true);
  };

  return (
    <div className="year-view">
      <div className="year-header">
        <h2 className="year-title">{year}年</h2>
      </div>
      
      <div className="year-grid">
        {months.map((monthDate, monthIndex) => {
          const monthEvents = getEventsForMonth(monthDate);
          const days = getDaysInMonth(monthDate);
          const monthName = format(monthDate, 'M月');
          
          return (
            <div 
              key={monthIndex} 
              className="month-card"
              onClick={() => handleMonthClick(monthDate)}
            >
              <h3 className="month-name">{monthName}</h3>
              <div className="month-weekdays">
                {WEEKDAYS.map(day => (
                  <span key={day} className="weekday">{day}</span>
                ))}
              </div>
              <div className="month-days">
                {days.map((day, dayIndex) => {
                  if (day === null) {
                    return <div key={dayIndex} className="day-empty" />;
                  }
                  
                  const dayEvents = getEventsForDay(day, monthIndex, year);
                  const isToday = isTodayUtil(new Date(year, monthIndex, day));
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`day-cell ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (dayEvents.length > 0) {
                          handleDayClick(day, monthIndex, year);
                        } else {
                          handleAddEvent(day, monthIndex, year);
                        }
                      }}
                    >
                      <span className="day-number">{day}</span>
                      {dayEvents.length > 0 && (
                        <div className="day-events">
                          {dayEvents.slice(0, 3).map((event: Event) => (
                            <span 
                              key={event.id}
                              className="event-dot"
                              style={{ backgroundColor: event.color }}
                              title={event.title}
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="event-more">+{dayEvents.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
