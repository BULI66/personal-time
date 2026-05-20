import { useCalendar } from '../context/CalendarContext';
import { CATEGORIES, REMINDER_OPTIONS, REPEAT_OPTIONS } from '../utils/constants';
import type { Event } from '../types';

export default function EventDetailModal() {
  const { isDetailModalOpen, setIsDetailModalOpen, selectedEventId, events, deleteEvent, setIsModalOpen, setEditingEventId } = useCalendar();

  const event = events.find(e => e.id === selectedEventId);

  const handleClose = () => {
    setIsDetailModalOpen(false);
    setSelectedEventId(null);
  };

  const handleEdit = () => {
    if (event) {
      setEditingEventId(event.id);
      setIsModalOpen(true);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (event && window.confirm('确定要删除这个活动吗？')) {
      deleteEvent(event.id);
      handleClose();
    }
  };

  if (!isDetailModalOpen || !event) return null;

  const category = CATEGORIES[event.category as keyof typeof CATEGORIES];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">活动详情</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <div className="modal-body event-detail">
          <div className="event-header">
            <span 
              className="event-category-badge" 
              style={{ backgroundColor: event.color }}
            >
              {category.icon} {category.name}
            </span>
            <h3 className="event-title">{event.title}</h3>
          </div>

          <div className="event-info">
            <div className="info-row">
              <span className="info-label">📅 日期</span>
              <span className="info-value">{event.date}</span>
            </div>
            <div className="info-row">
              <span className="info-label">⏰ 时间</span>
              <span className="info-value">{event.startTime} - {event.endTime}</span>
            </div>
            {event.repeat !== 'none' && (
              <div className="info-row">
                <span className="info-label">🔄 重复</span>
                <span className="info-value">{REPEAT_OPTIONS[event.repeat]}</span>
              </div>
            )}
            {event.repeatEndDate && (
              <div className="info-row">
                <span className="info-label">📆 重复结束</span>
                <span className="info-value">{event.repeatEndDate}</span>
              </div>
            )}
            <div className="info-row">
              <span className="info-label">🔔 提醒</span>
              <span className="info-value">{REMINDER_OPTIONS[event.reminder]}</span>
            </div>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="event-tags-section">
              <span className="section-label">标签</span>
              <div className="tag-list">
                {event.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {event.description && (
            <div className="event-description">
              <span className="section-label">备注</span>
              <p>{event.description}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={handleClose}>关闭</button>
          <button className="btn btn-secondary" onClick={handleEdit}>编辑</button>
          <button className="btn btn-danger" onClick={handleDelete}>删除</button>
        </div>
      </div>
    </div>
  );
}
