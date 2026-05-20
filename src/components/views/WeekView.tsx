import { useState, useRef, useCallback } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { getWeekDates, formatDate, calculateEventPosition } from '../../utils/dateUtils';
import type { Event } from '../../types';

interface WeekViewProps {
  onEventClick: (eventId: string) => void;
}

export default function WeekView({ onEventClick }: WeekViewProps) {
  const { currentDate, events, setIsModalOpen, updateEvent } = useCalendar();
  
  const [draggingEvent, setDraggingEvent] = useState<Event | null>(null);
  const [dragType, setDragType] = useState<'move' | 'resize' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOriginal, setDragOriginal] = useState({ top: 0, height: 0, date: '' });
  const containerRef = useRef<HTMLDivElement>(null);

  const weekDates = getWeekDates(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDay = (date: Date) => {
    const dateStr = formatDate(date);
    return events.filter(e => {
      const displayDate = e.displayDate || e.date;
      return displayDate === dateStr;
    });
  };

  const getEventPosition = (event: Event) => {
    const position = calculateEventPosition(event);
    return {
      top: `${position.top}px`,
      height: `${Math.max(position.height, 30)}px`
    };
  };

  const handleEventMouseDown = (e: React.MouseEvent, event: Event, type: 'move' | 'resize') => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    setDraggingEvent(event);
    setDragType(type);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragOriginal({
      top: rect.top - containerRect.top,
      height: rect.height,
      date: event.displayDate || event.date
    });
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingEvent || !dragType || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const yDiff = e.clientY - dragStart.y;
    const xDiff = e.clientX - dragStart.x;
    
    if (dragType === 'move') {
      const dayWidth = containerRect.width / 7;
      const dayIndex = Math.max(0, Math.min(6, Math.floor((e.clientX - containerRect.left) / dayWidth)));
      const newDate = formatDate(weekDates[dayIndex]);
      
      const newTop = Math.max(0, Math.min(1440 - 30, dragOriginal.top + yDiff));
      const minutes = Math.round(newTop);
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const newStartTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      
      const [endHour, endMin] = draggingEvent.endTime.split(':').map(Number);
      const duration = (endHour * 60 + endMin) - (minutes / 60 * 60 + minutes % 60);
      const endMinutes = Math.min(1440, minutes + duration);
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      const newEndTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
      
      updateEvent(draggingEvent.id, {
        date: newDate,
        startTime: newStartTime,
        endTime: newEndTime
      });
    } else if (dragType === 'resize') {
      const newHeight = Math.max(30, Math.min(1440 - dragOriginal.top, dragOriginal.height + yDiff));
      const duration = Math.round(newHeight);
      const [startHour, startMin] = draggingEvent.startTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = Math.min(1440, startMinutes + duration);
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      const newEndTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
      
      updateEvent(draggingEvent.id, { endTime: newEndTime });
    }
  }, [draggingEvent, dragType, dragStart, dragOriginal, weekDates, updateEvent]);

  const handleMouseUp = useCallback(() => {
    setDraggingEvent(null);
    setDragType(null);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleCellClick = (date: Date) => {
    setIsModalOpen(true);
  };

  return (
    <div className="week-view" ref={containerRef}>
      <div className="week-header">
        {weekDates.map((date, index) => (
          <div key={index} className="day-header">
            <span className="day-name">
              {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]}
            </span>
            <span className="day-date">{date.getDate()}</span>
          </div>
        ))}
      </div>
      
      <div className="week-body">
        {hours.map(hour => (
          <div key={hour} className="hour-row">
            <div className="hour-label">
              {hour.toString().padStart(2, '0')}:00
            </div>
            {weekDates.map((date, dayIndex) => {
              const dayEvents = getEventsForDay(date);
              return (
                <div 
                  key={dayIndex} 
                  className="day-column"
                  onClick={() => handleCellClick(date)}
                >
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className="event-block"
                      style={{
                        ...getEventPosition(event),
                        backgroundColor: event.color
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event.id);
                      }}
                      onMouseDown={(e) => handleEventMouseDown(e, event, 'move')}
                    >
                      <span className="event-title">{event.title}</span>
                      <div 
                        className="resize-handle"
                        onMouseDown={(e) => handleEventMouseDown(e, event, 'resize')}
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
