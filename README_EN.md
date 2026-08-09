# 🚀 WenXin / 问心

_A Scorpio's Personal Space · A mirror to the heart, a blade to the edge — ask the heart within, sever the attachments_

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-7.1.3-ff5d01?logo=astro)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3.3-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://reactjs.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

[🌍 Live Demo](https://wenxin.silentxx.com) • [📖 中文文档](./README.md) •
[🚀 Quick Start](#-installation--deployment) • [🏗️ Architecture](#-project-structure)

---

## 📖 Project Overview

**WenXin** (问心) is a **personal spiritual sanctuary** within the SilentXx ecosystem — a place for life essays, investment reflections, and emotional records from a pure-blooded Scorpio.

**Brand Structure**:

- **Top Logo**: SilentXx (unified brand with main site)
- **Site Name**: 问心 (WenXin — banner/SEO)
- **Author Name**: 问心剑 (WenXinJian — sidebar/signature)

**Content Sections**:
| Section | URL | Content |
|---------|-----|---------|
| 🏠 Home | `/` | Latest content feed |
| 📈 Invest × AI | `/invest` | Investing thoughts & AI topics |
| ✨ Moments | `/insight` | Life essays / moods |
| 💆 Massage Uncle | `/massage` | Massage shop daily life |
| 🌏 Nanyang Stories | `/nanyang` | Singapore life stories |
| 🎵 Kindred Souls | `/kindred` | Emotions & resonance |

---

## ✨ Key Features

| Feature                    | Description                                                            |
| -------------------------- | ---------------------------------------------------------------------- |
| 🚀 **Astro 7 SSG**         | Static site generation, blazing fast                                   |
| 🌐 **Bilingual**           | Chinese primary + English base pages                                   |
| 🤖 **WenXin AI Assistant** | Scorpio-style companion AI (persona: wenxin), unified chat + KB search |
| 🎵 **Music Player**        | Vinyl-style floating player, minimized cartoon face                    |
| 🗺️ **Tag Graph**           | Obsidian-style SVG force-directed relationship graph                   |
| 🌊 **Waterfall View**      | Xiaohongshu-style masonry for Moments + list toggle                    |
| 📱 **Responsive Design**   | Mobile adaptation + drawer menu                                        |
| 📰 **RSS + Sitemap**       | Full-site feeds + sitemap                                              |

---

## 🏗️ Project Structure

```plaintext
wenxin/
├── src/
│   ├── components/         # Components (player/AI/waterfall/graph)
│   ├── constants/          # Config (site-config/i18n/category)
│   ├── content/
│   │   └── blog/           # Content (moments/massage/nanyang/kindred)
│   ├── layouts/            # Layout templates
│   ├── lib/                # Core libraries (content/cover/i18n)
│   ├── pages/              # Page routes + RSS/Sitemap endpoints
│   │   ├── [slug].astro    # Top-level section dynamic route
│   │   ├── rss.xml.ts      # Chinese RSS Feed
│   │   ├── sitemap-index.xml.ts  # Full-site Sitemap
│   │   └── article/        # Article details
│   └── styles/             # Style files
├── public/
│   ├── images/posts/       # Moments article images (life content)
│   ├── img/                # Section cover images
│   └── videos/             # Video assets
├── astro.config.mjs        # Astro configuration
├── _config.yml             # Shoka category mapping
└── package.json            # Project dependencies
```

---

## 📋 Requirements

- Node.js >= 22.12
- pnpm >= 10.x
- Git

---

## 🛠️ Development Commands

```bash
# Development
pnpm dev              # Start dev server (localhost:4321)

# Build production
pnpm build            # Static build (output to dist/)

# Preview build
pnpm preview
```

---

## 🔧 Installation & Deployment

```bash
# 1. Clone repo
git clone https://github.com/AheheXx1982/wenxin.git
cd wenxin

# 2. Install dependencies
pnpm install

# 3. Start dev server
pnpm dev

# 4. Build production
pnpm build
```

**Deployment Architecture**:

- **Frontend**: Vercel (auto-deploy from GitHub main → `wenxin.silentxx.com`)
- **AI Assistant Backend**: Shared Railway companion (persona: wenxin branch)
- **Database**: None (static site + JSON data files)

---

## 🤖 WenXin AI Assistant

- **Persona**: Scorpio, cold outside warm inside, companion-first, writes like essays, never recommends trades
- **Tech**: Shared FastAPI + DeepSeek backend with main site, persona switching via `persona: 'wenxin'`
- **Capabilities**: Unified chat + KB search (input searches first, hits show article cards)

---

## 📈 Changelog

🎯 **Current Version: v1.1.0 (2026-08-09)**

### v1.1.0 — Site Cleanup & Optimization

- ✅ **Crypto Removal**: Fully cleaned crypto residue, unified images to life/culture themes (webp)
- ✅ **RSS Fix**: Fixed self-referencing bug; Chinese feed restored (20 items)
- ✅ **Sitemap Upgrade**: Added all section/category pages (167 URLs, 0 broken)
- ✅ **Domain Fix**: site config corrected from silentxx.com → wenxin.silentxx.com
- ✅ **Brand Finalized**: Top logo=SilentXx, site name=问心, author=问心剑
- ✅ **AI Assistant**: WenXinJian persona live, unified search + chat
- ✅ **Moments Content**: SOUL/social import pipeline (130+ articles)
- ✅ **Build Health**: 399 pages built successfully, zero errors

### v0.5.0 — Site Restructure (2026-08-02)

- ✅ **Section Restructure**: Removed happy/music sections, added Moments/Invest×AI
- ✅ **Waterfall**: Xiaohongshu-style Moments view
- ✅ **Tag Graph**: Relationship graph + tag cloud dual view

---

## 🛠️ Technical Documentation

- [技术文档 0.5.md](技术文档%200.5.md) — Full changelog & architecture evolution (Chinese)
- [搭建文档.md](搭建文档.md) — Build notes (Chinese)
- [docs/cover-images.md](docs/cover-images.md) — Cover image system

---

## 🙏 Thanks

### Inspiration

- [余弦の博客](https://space.cosine.ren/)
- [Hexo Shoka](https://github.com/amehime/hexo-theme-shoka)

### Tech Support

- [Astro](https://astro.build/) • [Vercel](https://vercel.com/) • [Railway](https://railway.app/) • [DeepSeek](https://deepseek.com/)

_Made with ❤️ by 问心剑_
_Copyright © 2020-2026 SilentXx. All rights reserved._
