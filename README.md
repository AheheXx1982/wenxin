# 🚀 SilentXx / 寂静猎手

_Modern Static Site Generator with Component Architecture_  
_基于 Astro 的现代化静态站点生成器，集成先进的组件架构_

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-5.13.2-ff5d01?logo=astro)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.0-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://reactjs.org/)

[🌍 Live Demo](https://www.silentxx.com) • [📖 中文文档](#-项目前言--project-overview) • [📖 English Docs](./README_EN.md) •  
[🚀 Quick Start](#-安装部署--installation--deployment) • [🏗️ Architecture](#-项目结构--project-structure)

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

## 🌐 一键部署 / One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AheheXx1982/SilentXx)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/AheheXx1982/SilentXx)

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

```plain
---
title: '文章标题 / Title'
description: '文章描述 / Description'
date: 2025-01-01
category: '分类名称 / Category'
tags: ['标签 1 / Tag1', '标签 2 / Tag2']
---

# 文章内容 / Content

你的 Markdown 内容...
```

---

## 📡 RSS 与 站点地图 / RSS & Sitemap

本项目支持 RSS 订阅和站点地图功能：

- RSS 订阅地址: [https://yourdomain.com/rss.xml](https://yourdomain.com/rss.xml)
- 站点地图地址: [https://yourdomain.com/sitemap-index.xml](https://yourdomain.com/sitemap-index.xml)

这些功能有助于搜索引擎更好地索引您的网站内容，并为读者提供内容订阅功能。

---

## 📈 更新日志 / Changelog

🎯 最新版本 / Latest: v0.1.0 (2025-09-11)

✨ **版本更新** / **Version Update**

✅ 版本号从 v0.0.1 升级到 v0.1.0 / Version upgraded from v0.0.1 to v0.1.0

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
