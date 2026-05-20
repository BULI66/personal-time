const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  readUserData: () => ipcRenderer.invoke('read-user-data'),
  saveUserData: (data) => ipcRenderer.invoke('save-user-data', data),
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
});
