export const STORAGE_KEY = 'calendar-events';

export const CATEGORIES = {
  work: { id: 'work', name: '工作', color: '#5B7C99', icon: '💼' },
  life: { id: 'life', name: '生活', color: '#D4A088', icon: '🏠' },
  study: { id: 'study', name: '学习', color: '#6FA07C', icon: '📚' },
  health: { id: 'health', name: '健康', color: '#D99A5A', icon: '💪' },
  social: { id: 'social', name: '社交', color: '#C47676', icon: '👥' },
  other: { id: 'other', name: '其他', color: '#8A9AA8', icon: '📌' }
};

export const COLORS = [
  '#5B7C99', '#D4A088', '#6FA07C', '#D99A5A', '#C47676',
  '#9B7EBD', '#7BA5C5', '#A8C5D9', '#8FB9A8', '#D9C5A5'
];

export const REMINDER_OPTIONS = {
  0: '不提醒',
  5: '提前5分钟',
  15: '提前15分钟',
  30: '提前30分钟',
  60: '提前1小时',
  180: '提前3小时',
  720: '提前12小时',
  1440: '提前1天'
};

export const REPEAT_OPTIONS: Record<string, string> = {
  'none': '不重复',
  'daily': '每天',
  'weekly': '每周',
  'monthly': '每月',
  'yearly': '每年'
};
