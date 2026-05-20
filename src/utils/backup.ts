import type { Event } from '../types';

interface BackupData {
  version: string;
  exportDate: string;
  events: Event[];
}

interface ImportResult {
  events: Event[];
  totalCount: number;
  validCount: number;
  skippedCount: number;
}

interface ValidateResult {
  isValid: boolean;
  error?: string;
}

export function exportEvents(events: Event[]): string {
  const backupData: BackupData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    events
  };
  
  return JSON.stringify(backupData, null, 2);
}

export function downloadBackup(events: Event[]): void {
  const dataStr = exportEvents(events);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `calendar-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importEvents(file: File): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as BackupData;
        
        if (!data.version || !data.events) {
          reject(new Error('无效的备份文件格式'));
          return;
        }
        
        const validEvents = data.events.filter((event): event is Event => {
          return event.id && event.title && event.date && event.startTime && event.endTime;
        });
        
        resolve({
          events: validEvents,
          totalCount: data.events.length,
          validCount: validEvents.length,
          skippedCount: data.events.length - validEvents.length
        });
      } catch (error) {
        reject(new Error('无法解析备份文件'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };
    
    reader.readAsText(file);
  });
}

export function validateBackup(file: File): Promise<ValidateResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const isValid = data.version && data.events && Array.isArray(data.events);
        resolve({ isValid, error: isValid ? undefined : '无效的备份文件' });
      } catch {
        resolve({ isValid: false, error: '无法解析文件' });
      }
    };
    
    reader.onerror = () => {
      resolve({ isValid: false, error: '读取文件失败' });
    };
    
    reader.readAsText(file);
  });
}
