# 📋 发布到 GitHub 的操作指南

## ✅ 已完成的工作

1. ✅ Electron 环境配置完成
2. ✅ Electron 主进程文件已创建 (`electron/main.js`)
3. ✅ 预加载脚本已创建 (`electron/preload.js`)
4. ✅ package.json 已配置 Electron 相关脚本
5. ✅ .gitignore 已创建
6. ✅ README.md 已创建
7. ✅ Git 仓库已初始化
8. ✅ 文件已添加到暂存区

## ⚠️ 需要您完成的操作

### 1. 配置 Git 用户信息

打开终端（PowerShell），在项目目录下运行：

```bash
# 替换为您的 GitHub 邮箱
git config user.email "your-email@example.com"

# 替换为您的名字
git config user.name "Your Name"
```

然后提交代码：

```bash
git commit -m "Initial commit: Personal Calendar App with Electron support"
```

### 2. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`personal-time`（或其他您喜欢的名称）
3. 选择 **Public**（公开）或 **Private**（私有）
4. **不要**勾选 "Initialize this repository with a README"
5. 点击 "Create repository"

### 3. 关联并推送代码

在终端中运行：

```bash
# 关联远程仓库（替换为您的仓库地址）
git remote add origin https://github.com/你的用户名/personal-time.git

# 重命名分支为 main
git branch -M main

# 推送代码
git push -u origin main
```

---

##  Electron 打包说明

由于网络原因，自动打包可能失败。您可以选择：

### 方案 A：使用国内镜像源手动下载 Electron

1. 编辑 `.npmrc` 文件（已创建）：
   ```
   electron_mirror=https://npmmirror.com/mirrors/electron/
   ```

2. 重新运行打包：
   ```bash
   npm run electron:build
   ```

### 方案 B：只打包未打包版本（快速）

```bash
# 只打包不下载 Electron
npm run build
npm run electron:pack
```

这会在 `release/win-unpacked/` 目录生成未打包的应用，可以直接运行测试。

### 方案 C：使用已构建的 Web 版本

Web 版本已经构建成功，位于 `dist/` 目录。您可以：

1. 直接将 `dist/` 目录部署到静态托管服务（如 Vercel、Netlify、GitHub Pages）
2. 用户通过浏览器访问

---

## 🌐 部署到 GitHub Pages（可选）

如果想让应用可以通过网页访问：

### 1. 安装 gh-pages

```bash
npm install gh-pages --save-dev
```

### 2. 更新 package.json

在 `scripts` 中添加：

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

在 `package.json` 顶部添加：

```json
"homepage": "https://你的用户名.github.io/personal-time",
```

### 3. 部署

```bash
npm run deploy
```

### 4. 启用 GitHub Pages

1. 进入仓库 Settings
2. 找到 "Pages" 选项卡
3. Source 选择 `gh-pages` 分支
4. 点击 Save

几分钟后，您的应用就可以通过 `https://你的用户名.github.io/personal-time` 访问了！

---

## 📝 后续更新流程

### 更新代码后发布

```bash
# 1. 修改代码
# 2. 测试功能
npm run dev

# 3. 提交更改
git add .
git commit -m "描述你的更新"

# 4. 推送到 GitHub
git push

# 5. (可选) 创建新版本
# 在 GitHub 上创建 Release，上传构建的安装包
```

### 更新 Electron 应用版本

1. 更新 `package.json` 中的版本号：
   ```json
   "version": "1.0.1"
   ```

2. 重新打包：
   ```bash
   npm run electron:build
   ```

3. 在 GitHub Releases 发布新版本，上传安装包

---

## ❓ 常见问题

### Q: 推送时提示权限错误？
A: 确保您使用的是自己的 GitHub 账号，并且有该仓库的写入权限。

### Q: 如何配置自动更新？
A: 需要：
   1. 在 `electron-builder` 配置中添加 `publish` 字段
   2. 使用 GitHub Releases 发布新版本
   3. 在应用中集成 `electron-updater`

### Q: 打包后的应用无法运行？
A: 检查：
   1. 是否完成了完整的构建流程
   2. 查看 `release/` 目录是否有输出文件
   3. 检查防火墙/杀毒软件是否阻止

---

## 📞 需要帮助？

如果您在操作过程中遇到问题，请告诉我具体是哪一步，我会提供详细指导！
