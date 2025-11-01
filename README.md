# 🚀 SilentXx / 寂静猎手

_Modern Static Site Generator with Component Architecture_  
_基于 Astro 的现代化静态站点生成器，集成先进的组件架构_

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-5.13.2-ff5d01?logo=astro)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.0-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://reactjs.org/)

[🌍 Live Demo](https://www.silentxx.com) • [📖 中文文档](#-项目前言--project-overview) • [📖 English Docs](./README_EN.md) •  
[🚀 Quick Start](#-安装部署--installation--deployment) • [🏗️ Architecture](#-项目结构--project-structure) • [📰 Auto News](#-自动新闻聚合--auto-news-aggregation)

---

## 📖 项目前言 / Project Overview

初见此主题，其光影之美宛若星河涌动，令人心神皆醉，多亏了自己这双近视又老花的双重慧眼，只是由于女主人工作太忙无暇更新，而本人技术水平又十分有限，刚开始几乎无从下手。

好在人还未老，尚能折腾几下，再怎么说，想当年咱也是个重装高手，费了些功夫，终于也算有了一点小小成果，至少自己用起来是没多大问题了，并且我还在原主题的基础上进行了一些必要与非必要的修改，以完善和增强系统性能，创新指数粗略估计已经达到 5 颗星水平~

At first sight of this theme, its beauty of light and shadow was like the surging of the galaxy, intoxicating to the soul. Thanks to my double “wise eyes” of nearsightedness and presbyopia, I could still appreciate it. However, since the hostess has been too busy with work to update it, and my own technical level is quite limited, I was almost at a loss in the beginning.

Fortunately, I am not yet old, still able to toss around a little. After all, in those years I was also a reinstallation expert. After some effort, I finally achieved a little result. At least for my own use, there is not much problem. Moreover, I have made some necessary and unnecessary modifications on the basis of the original theme, to improve and enhance system performance. By rough estimate, the innovation index has already reached a five-star level~

感谢原作者和余弦的贡献与指导，也感谢勤劳又学习意志超强的自己，坦白讲，半个月前我还不懂怎么使用 GitHub 和 VS Code，尽管困难重重，但我的热情却从丝毫不减，有时候为了修改代码，我老人家居然还能熬夜到凌晨四点半，这种锲而不舍的精神足以感动富婆~

Thanks to the original author and to Cosine for their contributions and guidance, and also to myself for being so diligent and having such strong willpower to learn. To be honest, half a month ago I didn't even know how to use GitHub or VS Code. Despite all the difficulties, my enthusiasm never waned. Sometimes, just to tweak a bit of code, this old fellow could even stay up until 4:30 in the morning. Such perseverance is enough to move even a rich lady~

特别感谢 ChatGPT、Gemini，通义灵码以及他的外国小表弟 Qoder，在我的亲切关怀与悉心指导下，它们通力协作，辛勤耕耘，最终还是勉强交出了一份能看的答卷，也让我的智商从 250 瞬间飙升至 250+，实现了从人类到（程序）猿类的反向进化，也许，这就是所谓"返璞归真"的内涵本质~

Special thanks to ChatGPT, Gemini, Tongyi Lingma, and its little foreign cousin Qoder. Under my kind care and meticulous guidance, they worked together tirelessly, and in the end barely managed to hand in a passable answer. This even made my IQ skyrocket from 250 to 250+, achieving a reverse evolution from human to (program) ape. Perhaps, this is the very essence of what they call "returning to simplicity." ~

---

## 🏆 项目特色 / Project Features

| 特性 / Feature                        | 说明 / Description                   | 优势 / Advantage                             |
| ------------------------------------- | ------------------------------------ | -------------------------------------------- |
| 🚀 **Astro SSG**                      | 静态站点生成 / Static Site Generator | 极速加载，SEO 友好 / Fast load, SEO friendly |
| ⚡ **部分水合 / Partial Hydration**   | 按需 JavaScript / On-demand JS       | 减少包大小 / Reduce bundle size              |
| 🎨 **shadcn/ui**                      | 现代化组件库 / Modern UI Components  | 一致的设计语言 / Consistent design           |
| 📱 **响应式设计 / Responsive Design** | 多设备适配 / Multi-device support    | 完美移动端体验 / Perfect mobile experience   |

---

## 📈 性能指标 / Performance Metrics

| 指标 / Metric                    | 分数 / Score | 说明 / Description                     |
| -------------------------------- | ------------ | -------------------------------------- |
| 🚀 **性能 / Performance**        | 98/100       | 极速加载体验 / Fast load experience    |
| ♿ **可访问性 / Accessibility**  | 95/100       | 无障碍友好 / Accessibility friendly    |
| 🔍 **SEO**                       | 100/100      | 搜索引擎优化 / Search engine optimized |
| 📱 **最佳实践 / Best Practices** | 96/100       | 现代化标准 / Modern standard           |

_数据来源 / Source: [Lighthouse Performance Test](https://developers.google.com/speed/pagespeed/insights/)_

---

## 📁 项目结构 / Project Structure

```plaintext
SilentXx/
├── src/                    # 源代码 / Source Code
│   ├── components/         # 组件库 / Component library
│   ├── constants/          # 常量配置 / Constants
│   ├── content/            # 内容管理 / Content management
│   │   └── blog/           # 博客文章 / Blog posts
│   ├── layouts/            # 布局模板 / Layout templates
│   ├── pages/              # 页面路由 / Page routes
│   │   ├── rss.xml.ts      # RSS订阅 / RSS feed
│   │   └── sitemap-index.xml.ts  # 站点地图 / Sitemap
│   └── styles/             # 样式文件 / Style files
├── public/                 # 静态资源 / Static assets
│   ├── fonts/              # 字体文件 / Font files
│   └── img/                # 图片资源 / Image assets
├── astro.config.mjs        # Astro 配置 / Astro configuration
├── tailwind.config.mjs     # Tailwind CSS 配置 / Tailwind CSS configuration
├── package.json            # 项目依赖 / Project dependencies
└── tsconfig.json           # TypeScript 配置 / TypeScript configuration
```

---

## 📋 环境要求 / Requirements

- Node.js >= 18.x
- pnpm >= 10.x
- Git
- Docker (可选，用于容器化开发) / Docker (Optional, for containerized development)

---

## 🔧 环境变量配置 / Environment Variables

要使用 Auto-News 系统，您需要配置以下环境变量：

```bash
# 复制 .env.example 文件并重命名为 .env
cp .env.example .env

# 编辑 .env 文件，填写您的实际值
```

详细配置说明请查看 [.env.example](.env.example) 文件。

---

## 🛠️ 开发命令 / Development Commands

```bash
# 开发环境 / Development

pnpm dev              # 启动开发服务器 / Start dev server
pnpm build            # 构建生产版本 / Build production
pnpm preview          # 预览构建结果 / Preview build
```

---

## 🔧 安装部署 / Installation & Deployment

```bash
# 1. 克隆项目 / Clone repo
git clone https://github.com/AheheXx1982/SilentXx.git
cd SilentXx

# 2. 安装依赖 / Install dependencies
pnpm install

# 3. 启动开发服务器 / Start dev server
pnpm dev

# 4. 构建生产版本 / Build production
pnpm build

# 5. 预览构建结果 / Preview build
pnpm preview
```

---

## 🐳 Docker 开发环境 / Docker Development Environment

项目已集成 Docker 开发环境，您可以选择使用 Docker 进行开发：

```bash
# 使用 Docker Compose 启动开发环境
docker-compose up

# 访问应用: http://localhost:5173/
```

Docker 环境特点：

- 自动热重载 / Automatic hot reload
- 文件同步 / File synchronization
- 一致的开发环境 / Consistent development environment
- 无需本地 Node.js 环境 / No local Node.js environment required

---

## 🔧 基本配置 / Basic Config

- [src/constants/site-config.ts](src/constants/site-config.ts) 修改站点信息 / modify site info

---

## 🎨 主题定制 / Theme Customization

```css
:root {
  --primary: 351 77% 62%;
  --primary-foreground: 355.7 100% 97.3%;
}
```

---

## 📝 内容管理 / Content Management

新文章放在 [src/content/blog/](src/content/blog/):

## ``plain

title: '文章标题 / Title'
description: '文章描述 / Description'
date: 2025-01-01
category: '分类名称 / Category'
tags: ['标签 1 / Tag1', '标签 2 / Tag2']

---

# 文章内容 / Content

你的 Markdown 内容...

````plain

## 📰 自动新闻聚合 / Auto News Aggregation

本项目集成了基于 [finaldie/auto-news](https://github.com/finaldie/auto-news) 的自动新闻聚合系统，可以定时抓取最新的加密货币新闻并自动发布到网站。

### 工作原理 / How it works

#### 直接 RSS 聚合系统

1. 使用 GitHub Actions 定时运行新闻聚合任务
2. 直接从 RSS 源获取最新的新闻
3. 将新闻内容转换为 Markdown 格式的博客文章
4. 自动提交并发布到网站

#### Notion 集成系统

1. 使用 GitHub Actions 定时运行新闻聚合任务
2. 通过 Docker 容器运行 Auto-News 来抓取和处理新闻
3. 将聚合的新闻存储在 Notion 数据库中
4. 从 Notion 数据库生成 Markdown 格式的博客文章
5. 自动提交并发布到网站

### 配置说明 / Configuration

详细配置说明请查看 [docs/auto-news-setup.md](docs/auto-news-setup.md)

完整自动化设置指南请查看 [docs/auto-news-full-setup-guide.md](docs/auto-news-full-setup-guide.md)

### 手动生成新闻 / Manual Generation

```bash
# 手动生成新闻文章
pnpm generate-news
````

---

## 📡 RSS 与 站点地图 / RSS & Sitemap

本项目支持 RSS 订阅和站点地图功能：

- RSS 订阅地址: [https://yourdomain.com/rss.xml](https://yourdomain.com/rss.xml)
- 站点地图地址: [https://yourdomain.com/sitemap-index.xml](https://yourdomain.com/sitemap-index.xml)

这些功能有助于搜索引擎更好地索引您的网站内容，并为读者提供内容订阅功能。

---

## 📰 自动新闻聚合 / Auto News Aggregation

本项目集成了两种自动新闻聚合系统：

### 1. 直接 RSS 聚合系统（推荐）

直接从 RSS 源获取新闻并生成 Markdown 文件，无需依赖外部服务。

- 🚀 **轻量级**: 无需 Notion 配置，直接从 RSS 源获取数据
- 🕐 **定时抓取**: 每天自动抓取最新的加密货币新闻
- 📝 **自动发布**: 自动生成 Markdown 格式的博客文章并发布
- 🌐 **多源聚合**: 支持多个 RSS 源
- 📊 **智能过滤**: 自动过滤重复内容

详细说明请查看 [docs/direct-rss-news-aggregator.md](docs/direct-rss-news-aggregator.md)

### 2. Notion 集成系统（高级）

基于 [finaldie/auto-news](https://github.com/finaldie/auto-news) 的自动新闻聚合系统，可以定时抓取最新的加密货币新闻并自动发布到网站。

- 🕐 **定时抓取**: 每天自动抓取最新的加密货币新闻
- 🤖 **AI 摘要**: 使用 LLM 自动生成新闻摘要
- 📝 **自动发布**: 自动生成 Markdown 格式的博客文章并发布
- 🌐 **多源聚合**: 支持 RSS、Reddit、Twitter 等多种新闻源
- 📊 **智能过滤**: 过滤不相关的内容，只保留感兴趣的新闻

### 工作原理 / How it works

#### 直接 RSS 聚合系统

1. 使用 GitHub Actions 定时运行新闻聚合任务
2. 直接从 RSS 源获取最新的新闻
3. 将新闻内容转换为 Markdown 格式的博客文章
4. 自动提交并发布到网站

#### 中英文内容处理

- 英文文章只发布到英文版网站 (/src/content/blog/en/crypto-news)
- 中文版网站不会显示英文文章，确保语言内容的纯净性
- 系统会自动区分和分发不同语言的内容

#### Notion 集成系统

1. 使用 GitHub Actions 定时运行新闻聚合任务
2. 通过 Docker 容器运行 Auto-News 来抓取和处理新闻
3. 将聚合的新闻存储在 Notion 数据库中
4. 从 Notion 数据库生成 Markdown 格式的博客文章
5. 自动提交并发布到网站

### 配置说明 / Configuration

详细配置说明请查看 [docs/auto-news-setup.md](docs/auto-news-setup.md)

完整自动化设置指南请查看 [docs/auto-news-full-setup-guide.md](docs/auto-news-full-setup-guide.md)

### 手动生成新闻 / Manual Generation

```bash
# 手动生成新闻文章
pnpm generate-news

# 测试工作流配置
pnpm test-workflow

# 测试中文内容分发
pnpm test-chinese-content
```

### 工作流状态 / Workflow Status

当前工作流设置：
- ⏰ **定时运行**: 每天 UTC 0:00 和 12:00（北京时间 8:00 和 20:00）
- 👍 **手动触发**: 支持在 GitHub Actions 页面手动触发
- 🔒 **权限配置**: 已配置写入权限，可自动提交新文章
- 🚨 **重复检测**: 自动跳过已存在的文章，避免重复

如需手动触发工作流：
1. 访问 GitHub 仓库的 Actions 页面
2. 选择 "Direct RSS News Aggregator" 工作流
3. 点击 "Run workflow" 按钮
4. 选择分支（通常是 main）并点击 "Run workflow"

## 📈 更新日志 / Changelog

🎯 最新版本 / Latest: v0.2.8 (2025-01-XX)

✨ **版本更新** / **Version Update**

✅ **v0.28.1** - 彩色球组件音频文件 404 错误修复 / FloatingColorBalls component audio file 404 errors fixed

- 修复了 FloatingColorBalls.astro 组件中的音频文件引用错误 / Fixed audio file reference errors in FloatingColorBalls.astro component
- 将 18 种颜色成功映射到 6 个现有音频文件 / Successfully mapped 18 colors to 6 existing audio files
- 消除了所有音频文件相关的 404 错误 / Eliminated all audio file related 404 errors

✅ 版本号从 v0.2.5 升级到 v0.2.8 / Version upgraded from v0.2.5 to v0.2.8
✅ 幻念集页面优化：实现随机展示内容功能，每次打开页面显示 50%随机内容，确保展示数量为偶数以保持页面对齐美观
✅ 名人名言模块增强：新增加密货币领域名言，完善中英文对照
✅ RSS 和 Sitemap 优化：完善多语言支持，确保搜索引擎更好地索引网站内容

[📋 查看完整更新历史 → CHANGELOG.md](CHANGELOG.md)

---

## 🙏 致谢 / Thanks

### 核心灵感 / Inspiration

- [师傅👩🏻余弦の博客](https://space.cosine.ren/)
- [太师傅🧔🏻‍♀️Hexo Shoka](https://github.com/amehime/hexo-theme-shoka)

### 技术支持 / Tech Support

- [Astro](https://astro.build/)
- [Vercel](https://vercel.com/)
- [shadcn/ui](https://ui.shadcn.com/)

### AI 助手 / AI Assistant

- [Qoder](https://qoder.com/)
- [ChatGPT](https://chat.openai.com/)
- [通义灵码](https://tongyi.aliyun.com/lingma)
- [Gemini](https://gemini.google.com/)

让我们一起构建更好的技术社区！ / Let's build a better tech community together!

[🔝 Back to Top](#top)

_Made with ❤️ by SilentXx Team_
_Copyright © 2020-2025 SilentXx. All rights reserved._
