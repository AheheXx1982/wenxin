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

When I first encountered this theme, its play of light and shadow was as dazzling as a surging galaxy, leaving me utterly enchanted. Thanks to my dual "wisdom eyes" of nearsightedness and presbyopia, I could appreciate its charm. However, since the hostess has been too busy with work to update it, and my own technical skills are rather limited, I was almost at a loss at the beginning.

Fortunately, I’m not too old yet and still able to tinker around. After some effort, I finally achieved a modest result. At least it works fine for my own use. Moreover, I made a few necessary and optional tweaks to the original theme to improve and enhance system performance. By my rough estimation, this spirit of innovation already deserves a five-star rating~

Thanks to the original author and to Cosine for their contributions and guidance, and also to myself for being diligent and so eager to learn. To be honest, just half a month ago I didn’t even know how to use GitHub or VS Code. Despite all the difficulties, my passion has never wavered. Sometimes, just to fix a piece of code, this “old fellow” could still stay up until 4:30 in the morning—truly proving that age is no barrier, and that the old ox still has plenty of strength left~

Special thanks to ChatGPT, Gemini, Tongyi Lingma, and its foreign cousin Qoder. Under my warm care and meticulous guidance, they worked together in harmony and finally managed to deliver a barely acceptable answer sheet. This even made my IQ soar instantly from 250 to 250+, marking a reverse evolution from human to (programming) ape. Perhaps this is what people mean by the true essence of “returning to simplicity.” ~

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

## 📈 Changelog

🎯 Latest: v0.0.1 (2025-08-29)

✨ **Initial Release**

✅ Astro 5.13.2 Core Framework
✅ shadcn/ui Modern UI Component Library
✅ Responsive Design
✅ SEO Optimization
✅ Alien-themed 404 Page

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
