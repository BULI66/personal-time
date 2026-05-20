import { useState, useRef } from 'react';
import { downloadBackup, importEvents } from '../utils/backup';
import type { Event } from '../types';

interface BackupManagerProps {
  events: Event[];
  onImport: React.Dispatch<React.SetStateAction<Event[]>>;
}

export default function BackupManager({ events, onImport }: BackupManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    loading?: boolean;
    success?: boolean;
    error?: boolean;
    message?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    downloadBackup(events);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus({ loading: true });
      const result = await importEvents(file);
      
      onImport(result.events);
      setImportStatus({
        success: true,
        message: `成功导入 ${result.validCount} 个活动，跳过 ${result.skippedCount} 个无效条目`
      });
    } catch (error) {
      setImportStatus({
        error: true,
        message: error instanceof Error ? error.message : '导入失败'
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    setIsOpen(false);
    setImportStatus(null);
  };

  return (
    <>
      <button 
        className="backup-btn"
        onClick={() => setIsOpen(true)}
        title="数据备份"
      >
        💾
      </button>

      {isOpen && (
        <div className="backup-modal-overlay" onClick={handleClose}>
          <div className="backup-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">数据备份与恢复</h3>
              <button className="modal-close" onClick={handleClose}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="backup-section">
                <h4>导出数据</h4>
                <p className="section-desc">将所有活动数据导出为JSON文件进行备份</p>
                <button className="btn btn-primary" onClick={handleExport}>
                  导出备份
                </button>
              </div>

              <div className="backup-section">
                <h4>导入数据</h4>
                <p className="section-desc">从之前导出的备份文件恢复数据</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <button 
                  className="btn btn-secondary" 
                  onClick={triggerFileInput}
                  disabled={importStatus?.loading}
                >
                  {importStatus?.loading ? '导入中...' : '选择备份文件'}
                </button>
              </div>

              {importStatus && (
                <div className={`status-message ${importStatus.success ? 'success' : importStatus.error ? 'error' : 'loading'}`}>
                  {importStatus.loading ? '正在导入...' : importStatus.message}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={handleClose}>
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
