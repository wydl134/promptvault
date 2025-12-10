# PromptVault - AI 提示词库 / AI Prompt Library

**美观现代化的 AI 提示词保存、分享与发现平台 / A beautiful platform for saving, sharing & discovering AI prompts**



[在线演示/Live Demo](#) • [提交 Bug](https://github.com/wydl134/promptvault/issues) • [需求建议](https://github.com/wydl134/promptvault/issues)

## 核心价值 / Core Value

- 保存整理优质提示词，告别零散记录 / Save & organize quality prompts

- 发现社区精选内容，提升 AI 使用效率 / Discover community's high-quality prompts

- 多维度筛选搜索，快速定位所需 / Search & filter by category/tags

- 一键复制+社交互动，高效且易用 / One-click copy & social interaction

## 核心功能 / Key Features

**基础功能 / Basic**

- 深色护眼主题 / Dark theme

- 智能分类体系 / Smart categories

- 公私权限控制 / Public/private switch

- 响应式适配 / Responsive design

**社交功能 / Social**

- 点赞收藏系统 / Like & favorite

- 浏览量统计 / View counter

- 用户个人主页 / User profiles

- 社区分享 / Community sharing

**技术特性 / Tech**

- TypeScript 类型安全 / Type safety

- 实时数据更新 / Real-time updates

- Supabase 安全认证 / Secure auth

- 性能优化 / Optimized performance

## 快速开始 / Quick Start

### 前置条件 / Prerequisites

Node.js 18+ | Supabase 账号 | npm/yarn

### 安装步骤 / Installation

```bash

# 1. 克隆仓库 / Clone repo
git clone https://github.com/yourusername/promptvault.git
cd promptvault

# 2. 安装依赖 / Install dependencies
npm install

# 3. 配置环境变量 / Set env (创建 .env 文件)
VITE_SUPABASE_URL=你的项目地址/your-project-url
VITE_SUPABASE_ANON_KEY=你的匿名密钥/your-anon-key

# 4. 启动开发服务 / Run dev server
npm run dev

# 5. 访问 / Visit
http://localhost:5173
```

## Supabase 配置 / Supabase Setup

1. 访问 [supabase.com](https://supabase.com) 创建项目 / Create project

2. 进入「Project Settings → API」复制 URL 和 anon key

3. 将密钥填入 .env 文件 / Add to .env

4. 数据库已自动配置，直接使用即可 / Database is pre-configured

## 技术栈 / Tech Stack

|分类 / Category|技术选型 / Tech Stack|
|---|---|
|前端 / Frontend|React 18, TypeScript, Vite, Tailwind CSS, Lucide React|
|后端 / Backend|Supabase (BaaS), PostgreSQL, RLS, Supabase Auth|
|部署 / Deployment|Vercel (推荐), Netlify|
## 部署指南 / Deployment

### Vercel 部署 (推荐) / Deploy to Vercel

1. 代码推送到 GitHub / Push code to GitHub

2. Vercel 导入仓库 / Import repo to Vercel

3. 添加环境变量 / Add env vars

4. 点击「Deploy」完成部署 / Click "Deploy"

### Netlify 部署 / Deploy to Netlify

```bash

npm run build
netlify deploy --prod --dir=dist
```

## 开发命令 / Dev Commands

```bash

npm run dev       # 启动开发服务 / Start dev server
npm run build     # 生产环境构建 / Build for production
npm run typecheck # 类型检查 / Run type check
npm run lint      # 代码检查 / Run linter
```

## 贡献指南 / Contributing

```bash

1. Fork 项目 / Fork the repo
2. 创建分支 / Create branch: git checkout -b feature/xxx
3. 提交修改 / Commit: git commit -m 'Add xxx'
4. 推送分支 / Push: git push origin feature/xxx
5. 打开 PR / Open Pull Request
```

## 开发路线图 / Roadmap

- [ ] 用户主页（头像/简介）/ User profiles with avatar/bio

- [ ] 提示词集合/文件夹 / Prompt collections/folders

- [ ] 导出功能（JSON/Markdown）/ Export function

- [ ] Chrome 扩展 / Chrome extension

- [ ] AI 提示词推荐 / AI-powered suggestions

## 许可证 / License

基于 MIT 许可证开源 / Distributed under the MIT License. See `LICENSE` for details.

由开发者打造，服务于开发者 / Built with ❤️ by developers, for developers

喜欢请点个 Star ⭐ / Give a Star if you like it!

[⬆ 返回顶部 / Back to Top](#promptvault---ai-提示词库--ai-prompt-library)

