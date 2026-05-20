import { useState, useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { CATEGORIES, COLORS, REMINDER_OPTIONS, REPEAT_OPTIONS } from '../utils/constants';
import type { Event } from '../types';

export default function EventModal() {
  const { isModalOpen, setIsModalOpen, editingEventId, setEditingEventId, events, addEvent, updateEvent } = useCalendar();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState('work');
  const [color, setColor] = useState('#5B7C99');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [reminder, setReminder] = useState(15);
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('none');
  const [repeatEndDate, setRepeatEndDate] = useState('');

  useEffect(() => {
    if (editingEventId) {
      const event = events.find(e => e.id === editingEventId);
      if (event) {
        setTitle(event.title);
        setDescription(event.description || '');
        setDate(event.date);
        setStartTime(event.startTime);
        setEndTime(event.endTime);
        setCategory(event.category);
        setColor(event.color);
        setTags(event.tags || []);
        setReminder(event.reminder);
        setRepeat(event.repeat);
        setRepeatEndDate(event.repeatEndDate || '');
      }
    } else {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      resetForm();
    }
  }, [isModalOpen, editingEventId, events]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('09:00');
    setEndTime('10:00');
    setCategory('work');
    setColor('#5B7C99');
    setTags([]);
    setTagInput('');
    setReminder(15);
    setRepeat('none');
    setRepeatEndDate('');
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingEventId(null);
    resetForm();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    const eventData: Omit<Event, 'id' | 'createdAt'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      startTime,
      endTime,
      category,
      color,
      tags,
      reminder,
      repeat,
      repeatEndDate: repeat !== 'none' ? repeatEndDate || undefined : undefined
    };

    if (editingEventId) {
      updateEvent(editingEventId, eventData);
    } else {
      addEvent(eventData);
    }

    handleClose();
  };

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editingEventId ? '编辑活动' : '新建活动'}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>活动标题</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入活动标题"
              maxLength={100}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>日期</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>开始时间</label>
              <input
                type="time"
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>结束时间</label>
              <input
                type="time"
                className="form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>分类</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>颜色</label>
              <div className="color-picker">
                {COLORS.map(c => (
                  <button
                    key={c}
                    className={`color-option ${color === c ? 'selected' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>标签</label>
            <div className="tag-input-container">
              <input
                type="text"
                className="form-input tag-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入标签后按回车"
                maxLength={20}
              />
              <button className="btn btn-secondary" onClick={handleAddTag}>添加</button>
            </div>
            {tags.length > 0 && (
              <div className="tag-list">
                {tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button className="tag-remove" onClick={() => handleRemoveTag(tag)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>提醒时间</label>
            <select
              className="form-select"
              value={reminder}
              onChange={(e) => setReminder(Number(e.target.value))}
            >
              {Object.entries(REMINDER_OPTIONS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>重复设置</label>
            <select
              className="form-select"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value as 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly')}
            >
              {Object.entries(REPEAT_OPTIONS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            {repeat !== 'none' && (
              <div className="form-row" style={{ marginTop: '12px' }}>
                <div className="form-group flex-1">
                  <label>重复结束日期</label>
                  <input
                    type="date"
                    className="form-input"
                    value={repeatEndDate}
                    onChange={(e) => setRepeatEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>备注</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="添加备注信息..."
              rows={3}
              maxLength={500}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={handleClose}>取消</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {editingEventId ? '保存修改' : '创建活动'}
          </button>
        </div>
      </div>
    </div>
  );
}
