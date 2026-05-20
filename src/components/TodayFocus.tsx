import { useCalendar } from '../context/CalendarContext';
import { formatDate, isTodayUtil } from '../utils/dateUtils';
import { CATEGORIES } from '../utils/constants';
import type { Event } from '../types';

interface TodayFocusProps {
  onEventClick: (eventId: string) => void;
}

export default function TodayFocus({ onEventClick }: TodayFocusProps) {
  const { events, setCurrentView, setCurrentDate } = useCalendar();

  const today = new Date();
  const todayStr = formatDate(today);
  
  const todayEvents = events
    .filter(e => {
      const displayDate = e.displayDate || e.date;
      return displayDate === todayStr;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const now = new Date();
  
  const currentEvent = todayEvents.find(e => {
    const [startHour, startMin] = e.startTime.split(':').map(Number);
    const [endHour, endMin] = e.endTime.split(':').map(Number);
    const eventStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMin);
    const eventEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMin);
    return now >= eventStart && now <= eventEnd;
  });

  const upcomingEvents = todayEvents.filter(e => {
    const [hours, minutes] = e.startTime.split(':').map(Number);
    const eventTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    return eventTime > now;
  });

  const completedEvents = todayEvents.filter(e => {
    const [hours, minutes] = e.endTime.split(':').map(Number);
    const eventEndTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    return eventEndTime <= now;
  });

  const handleViewToday = () => {
    setCurrentDate(new Date());
    setCurrentView('day');
  };

  const getEventCategory = (event: Event) => {
    return CATEGORIES[event.category as keyof typeof CATEGORIES];
  };

  const formatTimeRemaining = (event: Event) => {
    const [hours, minutes] = event.startTime.split(':').map(Number);
    const eventTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    const diff = eventTime.getTime() - now.getTime();
    const minutesRemaining = Math.floor(diff / 60000);
    
    if (minutesRemaining < 60) {
      return `${minutesRemaining}分钟后`;
    }
    const hoursRemaining = Math.floor(minutesRemaining / 60);
    return `${hoursRemaining}小时${minutesRemaining % 60}分钟后`;
  };

  return (
    <div className="today-focus">
      <div className="today-header" onClick={handleViewToday}>
        <h3 className="today-title">
          📌 {isTodayUtil(today) ? '今天' : formatDate(today)}
        </h3>
        <p className="today-date">
          {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][today.getDay()]}
        </p>
      </div>

      {currentEvent && (
        <div className="current-event">
          <span className="event-badge current">进行中</span>
          <div 
            className="event-card" 
            style={{ borderLeftColor: currentEvent.color }}
            onClick={() => onEventClick(currentEvent.id)}
          >
            <h4 className="event-title">{currentEvent.title}</h4>
            <p className="event-time">
              {currentEvent.startTime} - {currentEvent.endTime}
            </p>
            {currentEvent.tags && currentEvent.tags.length > 0 && (
              <div className="event-tags">
                {currentEvent.tags.map(tag => (
                  <span key={tag} className="event-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {upcomingEvents.length > 0 && (
        <div className="upcoming-section">
          <h4 className="section-title">
            <span className="section-icon">⏳</span> 待办事项
          </h4>
          <div className="event-list">
            {upcomingEvents.map(event => (
              <div 
                key={event.id} 
                className="event-item"
                onClick={() => onEventClick(event.id)}
              >
                <span 
                  className="event-dot" 
                  style={{ backgroundColor: event.color }}
                />
                <div className="event-info">
                  <h5 className="event-title-small">{event.title}</h5>
                  <div className="event-meta">
                    <span className="event-time-small">
                      {event.startTime} - {event.endTime}
                    </span>
                    <span className="event-remaining">
                      {formatTimeRemaining(event)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {completedEvents.length > 0 && (
        <div className="completed-section">
          <h4 className="section-title">
            <span className="section-icon">✅</span> 已完成
          </h4>
          <div className="event-list completed">
            {completedEvents.map(event => (
              <div 
                key={event.id} 
                className="event-item"
                onClick={() => onEventClick(event.id)}
              >
                <span className="event-dot completed" />
                <div className="event-info">
                  <h5 className="event-title-small completed">{event.title}</h5>
                  <span className="event-time-small completed">
                    {event.startTime} - {event.endTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {todayEvents.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎉</div>
          <p className="empty-text">今日无事</p>
          <p className="empty-hint">享受悠闲时光吧！</p>
        </div>
      )}

      <div className="stats-section">
        <div className="stat-item">
          <div className="stat-value">{todayEvents.length}</div>
          <div className="stat-label">总活动</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{upcomingEvents.length}</div>
          <div className="stat-label">待完成</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{completedEvents.length}</div>
          <div className="stat-label">已完成</div>
        </div>
      </div>
    </div>
  );
}
