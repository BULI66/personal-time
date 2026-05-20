# 个人时光 - Personal Time 

一款功能丰富的个人日历管理应用，基于 React + TypeScript + Electron 开发。

## ✨ 功能特性

### 📋 核心功能
- ️ **多视图展示** - 月视图、周视图、日视图、年视图
- 📝 **活动管理** - 创建、编辑、删除每日活动安排
- ️ **分类标记** - 工作、生活、学习等分类
-  **活动提醒** - 可设置提前提醒时间
- 🔄 **重复活动** - 支持每天/每周/每月/每年重复
- 🔍 **搜索功能** - 按标题和标签实时搜索

### 🎨 UI/UX
- 🌓 **深色模式** - 支持浅色/深色主题切换
- ️ **拖拽操作** - 支持拖拽调整活动时间和大小
- 📱 **移动端优化** - 响应式设计，支持触摸手势
- ✨ **动画效果** - 流畅的过渡和交互动画
-  **今日焦点** - 显示今日活动概览

### ⚡ 性能优化
- 🚀 **虚拟滚动** - 优化长列表渲染
- 💾 **缓存策略** - 智能缓存重复计算结果
- 📦 **懒加载** - 按需加载资源

### 🔒 数据安全
- 💾 **本地存储** - 数据完全存储在本地
- 🔐 **加密存储** - AES-GCM 加密算法保护数据
- 📤 **数据备份** - 支持导出/导入 JSON 备份文件

### 💻 跨平台
- ️ **桌面应用** - Electron 打包，支持 Windows/macOS/Linux
-  **Web 版本** - 浏览器直接运行

## 📥 下载应用

### 🖥️ Windows 下载
- 前往 [GitHub Releases](https://github.com/BULI66/personal-time/releases) 下载最新版本
- 下载 `Personal-Time-Setup-x.x.x.exe` 安装包
- 运行安装程序即可使用

### 📱 Web 版本
- 直接在浏览器中访问：[GitHub Pages](#)（待部署）
- 或使用开发模式运行：
  ```bash
  npm install
  npm run dev
  ```

## 🔧 开发指南

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **日期处理**: date-fns
- **状态管理**: React Context API
- **测试框架**: Vitest + Testing Library
- **桌面应用**: Electron 42 + electron-builder

## 📁 项目结构

```
personal-time/
├── electron/           # Electron 主进程
│   ├── main.cjs      # 主进程入口
│   └── preload.js     # 预加载脚本
├── src/
│   ├── components/    # React 组件
│   │   ├── views/     # 视图组件
│   │   └── ...
│   ├── context/       # Context 管理
│   ├── types/         # TypeScript 类型定义
│   ├── utils/         # 工具函数
│   └── main.tsx       # 应用入口
├── public/            # 静态资源
├── dist/              # 构建输出
├── release/           # Electron 打包输出
└── package.json
```

## 🚀 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# Electron 开发模式
npm run electron:dev

# Electron 打包
npm run electron:pack    # 快速打包（测试用）
npm run electron:build   # 完整打包（发布用）

# 预览构建结果
npm run preview

# 运行测试
npm test
```

## 📝 使用说明

### 编辑活动
- 点击活动卡片查看详情
- 双击活动卡片直接编辑

### 拖拽调整
- 拖动活动卡片可调整时间
- 拖动边缘可调整活动时长

### 搜索活动
- 在顶部搜索框输入关键词
- 支持按标题和标签搜索

### 切换视图
- 年视图：查看全年概览
- 月视图：查看整月活动
- 周视图：查看一周安排（支持拖拽）
- 日视图：查看单日详情（支持拖拽）

### 深色模式
- 点击右上角 /☀️ 按钮切换主题

### 数据备份
1. 点击侧边栏"备份管理"
2. 导出备份：下载 JSON 文件
3. 导入备份：选择 JSON 文件恢复

## 📄 许可证

MIT License

## ‍💻 作者

BuLi

---

**享受您的个人时光管理！** ⏰✨
