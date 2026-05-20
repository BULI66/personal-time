const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// 判断是否是开发模式
const isDev = process.env.NODE_ENV === 'development';

// 禁用原生菜单栏
Menu.setApplicationMenu(null);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    titleBarStyle: 'default',
    title: '个人时光',
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
    backgroundColor: '#ffffff'
  });

  // 加载应用
  if (isDev) {
    // 开发模式：加载 Vite 开发服务器
    mainWindow.loadURL('http://localhost:5173');
    // 打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    // 生产模式：加载构建后的 HTML
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 窗口关闭
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron 初始化完成
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出应用（macOS 除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC 处理器：读取用户数据
ipcMain.handle('read-user-data', async () => {
  const userDataPath = path.join(app.getPath('userData'), 'calendar-data.json');
  try {
    if (fs.existsSync(userDataPath)) {
      const data = fs.readFileSync(userDataPath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('读取用户数据失败:', error);
    return [];
  }
});

// IPC 处理器：保存用户数据
ipcMain.handle('save-user-data', async (event, data) => {
  const userDataPath = path.join(app.getPath('userData'), 'calendar-data.json');
  try {
    fs.writeFileSync(userDataPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('保存用户数据失败:', error);
    return false;
  }
});

// 获取应用版本
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});
