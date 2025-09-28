# 🚀 SilentXx

_Modern Static Site Generator with Component Architecture_

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-5.13.2-ff5d01?logo=astro)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.0-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://reactjs.org/)

[🌍 Live Demo](https://www.silentxx.com) • [📖 Documentation](#-project-overview) •  
[🚀 Quick Start](#-installation--deployment) • [🏗️ Architecture](#-project-structure)

---

## 📖 Project Overview

At first sight of this theme, its beauty of light and shadow was like the surging of the galaxy, intoxicating to the soul. Thanks to my double "wise eyes" of nearsightedness and presbyopia, I could still appreciate it. However, since the hostess has been too busy with work to update it, and my own technical level is quite limited, I was almost at a loss in the beginning.

Fortunately, I am not yet old, still able to toss around a little. After all, in those years I was also a reinstallation expert. After some effort, I finally achieved a little result. At least for my own use, there is not much problem. Moreover, I have made some necessary and unnecessary modifications on the basis of the original theme, to improve and enhance system performance. By rough estimate, the innovation index has already reached a five-star level~

Thanks to the original author and to Cosine for their contributions and guidance, and also to myself for being so diligent and having such strong willpower to learn. To be honest, half a month ago I didn't even know how to use GitHub or VS Code. Despite all the difficulties, my enthusiasm never waned. Sometimes, just to tweak a bit of code, this old fellow could even stay up until 4:30 in the morning. Such perseverance is enough to move even a rich lady~

Special thanks to ChatGPT, Gemini, Tongyi Lingma, and its little foreign cousin Qoder. Under my kind care and meticulous guidance, they worked together tirelessly, and in the end barely managed to hand in a passable answer. This even made my IQ skyrocket from 250 to 250+, achieving a reverse evolution from human to (program) ape. Perhaps, this is the very essence of what they call "returning to simplicity." ~

---

## 🏆 Project Features

| Feature                  | Description           | Advantage                 |
| ------------------------ | --------------------- | ------------------------- |
| 🚀 **Astro SSG**         | Static Site Generator | Fast load, SEO friendly   |
| ⚡ **Partial Hydration** | On-demand JavaScript  | Reduce bundle size        |
| 🎨 **shadcn/ui**         | Modern UI Components  | Consistent design         |
| 📱 **Responsive Design** | Multi-device support  | Perfect mobile experience |

---

## 📈 Performance Metrics

| Metric                | Score   | Description             |
| --------------------- | ------- | ----------------------- |
| 🚀 **Performance**    | 98/100  | Fast load experience    |
| ♿ **Accessibility**  | 95/100  | Accessibility friendly  |
| 🔍 **SEO**            | 100/100 | Search engine optimized |
| 📱 **Best Practices** | 96/100  | Modern standard         |

_Source: [Lighthouse Performance Test](https://developers.google.com/speed/pagespeed/insights/)_

---

## 📁 Project Structure

```plaintext
SilentXx/
├── src/                    # Source Code
│   ├── components/         # Component library
│   ├── constants/          # Constants
│   ├── content/            # Content management
│   │   └── blog/           # Blog posts
│   ├── layouts/            # Layout templates
│   ├── pages/              # Page routes
│   │   ├── rss.xml.ts      # RSS feed
│   │   └── sitemap-index.xml.ts  # Sitemap
│   └── styles/             # Style files
├── public/                 # Static assets
│   ├── fonts/              # Font files
│   └── img/                # Image assets
├── astro.config.mjs        # Astro configuration
├── tailwind.config.mjs     # Tailwind CSS configuration
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
```

---

## 📋 Requirements

- Node.js >= 18.x
- pnpm >= 10.x
- Git
- Docker (Optional, for containerized development)

---

## 🛠️ Development Commands

```bash
# Development

pnpm dev              # Start dev server
pnpm build            # Build production
pnpm preview          # Preview build
```

---

## 🔧 Installation & Deployment

```bash
# 1. Clone repo
git clone https://github.com/AheheXx1982/SilentXx.git
cd SilentXx

# 2. Install dependencies
pnpm install

# 3. Start dev server
pnpm dev

# 4. Build production
pnpm build

# 5. Preview build
pnpm preview
```

---

## 🐳 Docker Development Environment

The project has integrated Docker development environment. You can choose to use Docker for development:

```bash
# Start development environment using Docker Compose
docker-compose up

# Access the application: http://localhost:5173/
```

Docker environment features:

- Automatic hot reload
- File synchronization
- Consistent development environment
- No local Node.js environment required

---

## 🌐 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AheheXx1982/SilentXx)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/AheheXx1982/SilentXx)

---

## 🔧 Basic Config

- [src/constants/site-config.ts](src/constants/site-config.ts) modify site info

---

## 🎨 Theme Customization

```css
:root {
  --primary: 351 77% 62%;
  --primary-foreground: 355.7 100% 97.3%;
}
```

---

## 📝 Content Management

New articles go in [src/content/blog/](src/content/blog/):

```plain
---
title: 'Article Title'
description: 'Article Description'
date: 2025-01-01
category: 'Category Name'
tags: ['Tag1', 'Tag2']
---

# Content

Your Markdown content...
```

---

## 📡 RSS & Sitemap

This project supports RSS feeds and sitemap functionality:

- RSS feed URL: [https://yourdomain.com/rss.xml](https://yourdomain.com/rss.xml)
- Sitemap URL: [https://yourdomain.com/sitemap-index.xml](https://yourdomain.com/sitemap-index.xml)

These features help search engines better index your website content and provide content subscription functionality for readers.

---

## 📈 Changelog

🎯 Latest: v0.2.8 (2025-01-XX)

✨ **Version Update**

✅ **v0.28.1** - FloatingColorBalls component audio file 404 errors fixed

- Fixed audio file reference errors in FloatingColorBalls.astro component
- Successfully mapped 18 colors to 6 existing audio files
- Eliminated all audio file related 404 errors

✅ Version upgraded from v0.2.5 to v0.2.8
✅ Illusionary Thoughts page optimization: Implemented random content display feature, showing 50% random content each time the page is opened, ensuring an even number of displays to maintain page alignment and aesthetics
✅ Quote module enhancement: Added cryptocurrency-related quotes, improved Chinese-English translation
✅ RSS and Sitemap optimization: Enhanced multilingual support to ensure search engines better index website content

[📋 View full changelog → CHANGELOG.md](CHANGELOG.md)

---

## 🙏 Thanks

### Inspiration

- [Master👩🏻Cosine's Blog](https://space.cosine.ren/)
- [Grandmaster🧔🏻‍♀️Hexo Shoka](https://github.com/amehime/hexo-theme-shoka)

### Tech Support

- [Astro](https://astro.build/)
- [Vercel](https://vercel.com/)
- [shadcn/ui](https://ui.shadcn.com/)

### AI Assistant

- [Qoder](https://qoder.com/)
- [ChatGPT](https://chat.openai.com/)
- [通义灵码](https://tongyi.aliyun.com/lingma)
- [Gemini](https://gemini.google.com/)

Let's build a better tech community together!

[🔝 Back to Top](#top)

_Made with ❤️ by SilentXx Team_
_Copyright © 2020-2025 SilentXx. All rights reserved._
