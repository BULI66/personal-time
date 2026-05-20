import { 
  format, 
  parseISO, 
  isSameDay, 
  isToday,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameMonth
} from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN/index.js';
import type { Event } from '../types';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function parseDateStr(str: string): Date {
  return parseISO(str);
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

export function formatDateTime(date: Date): string {
  return format(date, 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
}

export function formatDateDisplay(date: Date): string {
  return format(date, 'yyyy年M月', { locale: zhCN });
}

export function formatWeekDisplay(date: Date): string {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  const startMonth = format(start, 'M');
  const endMonth = format(end, 'M');
  const startDay = format(start, 'd');
  const endDay = format(end, 'd');
  const year = format(start, 'yyyy');
  
  if (startMonth === endMonth) {
    return `${year}年${startMonth}月${startDay}日 - ${endDay}日`;
  }
  return `${year}年${startMonth}月${startDay}日 - ${endMonth}月${endDay}日`;
}

export function formatDayDisplay(date: Date): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[getDay(date)];
  return `${format(date, 'yyyy年M月d日', { locale: zhCN })} ${weekday}`;
}

export function getWeekDates(date: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 0 }),
    end: endOfWeek(date, { weekStartsOn: 0 })
  });
}

export function getMonthDates(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const firstDayOfWeek = startOfWeek(monthStart, { weekStartsOn: 0 });
  const lastDayOfWeek = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  return eachDayOfInterval({
    start: firstDayOfWeek,
    end: lastDayOfWeek
  });
}

export function isSameDayUtil(d1: Date, d2: Date): boolean {
  return isSameDay(d1, d2);
}

export function isTodayUtil(date: Date): boolean {
  return isToday(date);
}

export function isSameMonthUtil(d1: Date, d2: Date): boolean {
  return isSameMonth(d1, d2);
}

export function addDaysUtil(date: Date, days: number): Date {
  return addDays(date, days);
}

export function addWeeksUtil(date: Date, weeks: number): Date {
  return addWeeks(date, weeks);
}

export function addMonthsUtil(date: Date, months: number): Date {
  return addMonths(date, months);
}

export function getHoursOfDay(): number[] {
  return Array.from({ length: 24 }, (_, i) => i);
}

export function calculateEventPosition(event: Event): { top: number; height: number } {
  const [startHour, startMin] = event.startTime.split(':').map(Number);
  const [endHour, endMin] = event.endTime.split(':').map(Number);
  
  return {
    top: startHour * 60 + startMin,
    height: Math.max((endHour - startHour) * 60 + (endMin - startMin), 30)
  };
}

export function generateRepeatingDates(event: Event): string[] {
  if (!event.repeat || event.repeat === 'none') {
    return [event.date];
  }

  const dates: string[] = [];
  const startDate = parseISO(event.date);
  const endDate = event.repeatEndDate ? parseISO(event.repeatEndDate) : addYears(startDate, 1);
  let currentDate = startDate;

  while (currentDate <= endDate) {
    dates.push(formatDate(currentDate));
    
    switch (event.repeat) {
      case 'daily':
        currentDate = addDays(currentDate, 1);
        break;
      case 'weekly':
        currentDate = addWeeks(currentDate, 1);
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, 1);
        break;
      case 'yearly':
        currentDate = addYears(currentDate, 1);
        break;
      default:
        break;
    }
  }

  return dates;
}
