import { useCalendar } from '../context/CalendarContext';
import { CATEGORIES } from '../utils/constants';

export default function Sidebar() {
  const { selectedCategories, setSelectedCategories, setCurrentView, setCurrentDate, setIsModalOpen } = useCalendar();

  const allCategories = Object.keys(CATEGORIES);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setCurrentView('day');
  };

  const handleAddEvent = () => {
    setIsModalOpen(true);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <button className="nav-btn primary full-width" onClick={handleAddEvent}>
          + 新建活动
        </button>
        <button className="nav-btn secondary full-width" onClick={handleToday}>
          📌 今天
        </button>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">活动分类</h3>
        <div className="category-list">
          {allCategories.map(catId => {
            const category = CATEGORIES[catId as keyof typeof CATEGORIES];
            const isSelected = selectedCategories.includes(catId);
            return (
              <button
                key={catId}
                className={`category-item ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleCategory(catId)}
              >
                <span 
                  className="category-color" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">快捷导航</h3>
        <div className="nav-list">
          <button className="nav-item" onClick={() => { setCurrentView('year'); }}>
            📅 年视图
          </button>
          <button className="nav-item" onClick={() => { setCurrentView('month'); }}>
            📆 月视图
          </button>
          <button className="nav-item" onClick={() => { setCurrentView('week'); }}>
            📋 周视图
          </button>
          <button className="nav-item" onClick={() => { setCurrentView('day'); }}>
            📝 日视图
          </button>
        </div>
      </div>
    </aside>
  );
}
