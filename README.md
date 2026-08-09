# 🚀 问心 / WenXin

_问心｜一个纯血天蝎的精神自留地 · 以心为镜，以剑为锋，既问本心，亦斩执念_

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-7.1.3-ff5d01?logo=astro)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3.3-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://reactjs.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

[🌍 Live Demo](https://wenxin.silentxx.com) • [📖 English Docs](./README_EN.md) •
[🚀 Quick Start](#-安装部署--installation--deployment) • [🏗️ Architecture](#-项目结构--project-structure)

---

## 📖 项目简介 / Project Overview

**问心**（WenXin）是 SilentXx 生态下的**个人精神自留地**，一个纯血天蝎的生活随笔、投资思考与情感记录站。

品牌结构：

- **顶部 LOGO**：SilentXx（与主站统一的品牌标识）
- **网站名**：问心（banner / SEO）
- **作者名**：问心剑（侧边栏 / 署名）

内容栏目：
| 栏目 | URL | 内容 |
|------|-----|------|
| 🏠 首页 | `/` | 最新内容流 |
| 📈 投资 × AI | `/invest` | 投资思考与 AI 话题 |
| ✨ 瞬间 | `/insight` | 生活随笔 / 心情记录 |
| 💆 按摩大叔 | `/massage` | 按摩店日常 |
| 🌏 南洋往事 | `/nanyang` | 新加坡生活故事 |
| 🎵 何处觅知音 | `/kindred` | 情感与共鸣 |

---

## ✨ 核心功能 / Key Features

| 功能                 | 说明                                                    |
| -------------------- | ------------------------------------------------------- |
| 🚀 **Astro 7 SSG**   | 静态站点生成，极速加载                                  |
| 🌐 **双语**          | 中文为主 + 英文基础页                                   |
| 🤖 **问心-AI 助手**  | 天蝎风陪伴 AI（persona: wenxin），聊天 + 知识库搜索合一 |
| 🎵 **音乐播放器**    | 黑胶风格悬浮播放器，最小化卡通脸                        |
| 🗺️ **标签图谱**      | Obsidian 风格 SVG 力导向关系图谱                        |
| 🌊 **瀑布流视图**    | 瞬间栏目小红书风格瀑布流 + 列表切换                     |
| 📱 **响应式设计**    | 移动端适配 + 抽屉菜单                                   |
| 📰 **RSS + Sitemap** | 全站 Feed + Sitemap                                     |

---

## 🏗️ 项目结构 / Project Structure

```plaintext
wenxin/
├── src/
│   ├── components/         # 组件库（播放器/AI助手/瀑布流/图谱）
│   ├── constants/          # 配置（site-config/i18n/category）
│   ├── content/
│   │   └── blog/           # 内容（瞬间/按摩/南洋/知音等）
│   ├── layouts/            # 布局模板
│   ├── lib/                # 核心库（content/cover/i18n）
│   ├── pages/              # 页面路由 + RSS/Sitemap 端点
│   │   ├── [slug].astro    # 顶级栏目动态路由（/invest /insight 等）
│   │   ├── rss.xml.ts      # 中文 RSS Feed
│   │   ├── sitemap-index.xml.ts  # 全站 Sitemap
│   │   └── article/        # 文章详情
│   └── styles/             # 样式文件
├── public/
│   ├── images/posts/       # 瞬间文章配图（生活内容）
│   ├── img/                # 栏目封面图
│   └── videos/             # 视频素材
├── astro.config.mjs        # Astro 配置
├── _config.yml             # Shoka 分类映射（category_map）
└── package.json            # 项目依赖
```

---

## 📋 环境要求 / Requirements

- Node.js >= 22.12
- pnpm >= 10.x
- Git

---

## 🛠️ 开发命令 / Development Commands

```bash
# 开发环境
pnpm dev              # 启动开发服务器（localhost:4321）

# 构建生产版本
pnpm build            # 静态构建（输出到 dist/）

# 预览构建结果
pnpm preview
```

---

## 🔧 安装部署 / Installation & Deployment

```bash
# 1. 克隆项目
git clone https://github.com/AheheXx1982/wenxin.git
cd wenxin

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 构建生产版本
pnpm build
```

**部署架构**：

- **前端**：Vercel（GitHub main 分支自动部署 → `wenxin.silentxx.com`）
- **AI 助手后端**：与主站共用 Railway companion（persona: wenxin 分支）
- **数据库**：无（静态站点 + JSON 数据文件）

---

## 🤖 问心-AI 助手

- **人设**：天蝎座、外冷内热、陪伴模式为主、说话像写随笔、不推买卖
- **技术**：与主站共用 FastAPI + DeepSeek 后端，通过 `persona: 'wenxin'` 切换人格
- **能力**：聊天 + 知识库搜索合一（输入即搜，命中显示文章卡片）

---

## 📈 更新日志 / Changelog

🎯 **当前版本: v1.1.0 (2026-08-09)**

### v1.1.0 — 全站清理与优化 / Site Cleanup & Optimization

- ✅ **去加密化**：彻底清理加密货币残留，图片统一生活/文化主题（webp）
- ✅ **RSS 修复**：修复自指 bug，中文 Feed 恢复正常（20 条）
- ✅ **Sitemap 升级**：补全全部栏目页/分类页（167 URL，0 破损）
- ✅ **域名修正**：site 配置从 silentxx.com → wenxin.silentxx.com
- ✅ **品牌定案**：顶部 LOGO=SilentXx，网站名=问心，作者名=问心剑
- ✅ **AI 助手**：问心剑 persona 上线，搜索 + 聊天合一
- ✅ **瞬间内容**：SOUL/朋友圈社交内容导入管道上线（130+ 篇文章）
- ✅ **构建健壮**：399 页面成功构建，零错误

### v0.5.0 — 站点重构 (2026-08-02)

- ✅ **栏目重构**：开心乐园/神级音乐删除，新增瞬间/投资×AI
- ✅ **瀑布流**：小红书风格瞬间视图上线
- ✅ **标签图谱**：关系图谱 + 标签云双视图

---

## 🛠️ 技术文档 / Technical Docs

- [技术文档 0.5.md](技术文档%200.5.md) — 完整更新日志与架构演进
- [搭建文档.md](搭建文档.md) — 搭建记录
- [docs/cover-images.md](docs/cover-images.md) — 封面图片系统

---

## 🙏 致谢 / Thanks

### 核心灵感 / Inspiration

- [余弦の博客](https://space.cosine.ren/)
- [Hexo Shoka](https://github.com/amehime/hexo-theme-shoka)

### 技术支持 / Tech Support

- [Astro](https://astro.build/) • [Vercel](https://vercel.com/) • [Railway](https://railway.app/) • [DeepSeek](https://deepseek.com/)

_Made with ❤️ by 问心剑_
_Copyright © 2020-2026 SilentXx. All rights reserved._
