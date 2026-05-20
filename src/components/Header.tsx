import { useCalendar } from '../context/CalendarContext';
import BackupManager from './BackupManager';

export default function Header() {
  const { 
    currentView, 
    setCurrentView, 
    setIsModalOpen, 
    searchQuery, 
    setSearchQuery, 
    theme, 
    toggleTheme, 
    events, 
    setEvents 
  } = useCalendar();

  const handleAddEvent = () => {
    setIsModalOpen(true);
  };

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">📅</div>
        <span className="logo-text">个人日历</span>
      </div>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="搜索活动标题或标签..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => setSearchQuery('')}>×</button>
        )}
      </div>
      <nav className="header-nav">
        <div className="view-tabs">
          <button
            className={`view-tab ${currentView === 'year' ? 'active' : ''}`}
            onClick={() => setCurrentView('year')}
          >
            年视图
          </button>
          <button
            className={`view-tab ${currentView === 'month' ? 'active' : ''}`}
            onClick={() => setCurrentView('month')}
          >
            月视图
          </button>
          <button
            className={`view-tab ${currentView === 'week' ? 'active' : ''}`}
            onClick={() => setCurrentView('week')}
          >
            周视图
          </button>
          <button
            className={`view-tab ${currentView === 'day' ? 'active' : ''}`}
            onClick={() => setCurrentView('day')}
          >
            日视图
          </button>
        </div>
        <button className="nav-btn primary" onClick={handleAddEvent}>
          + 新建活动
        </button>
        <button 
          className="theme-toggle" 
          onClick={toggleTheme} 
          title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <BackupManager events={events} onImport={setEvents} />
      </nav>
    </header>
  );
}
