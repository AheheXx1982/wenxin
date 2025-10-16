# 中英文内容分发策略

## 概述

本项目采用严格的中英文内容分发策略，确保中文版网站只显示中文内容，英文版网站只显示英文内容。

## 内容分发规则

### 英文内容处理
- 所有从 RSS 源获取的英文文章只发布到英文版网站目录：`/src/content/blog/en/crypto-news`
- 中文版网站目录 `/src/content/blog/crypto-news` 不会包含任何英文文章

### 中文内容处理
- 中文文章只发布到中文版网站目录：`/src/content/blog/crypto-news`
- 英文版网站可以显示中文文章的英文翻译版本

## 技术实现

### 脚本说明

使用 `chinese-english-rss-aggregator.cjs` 脚本处理内容分发：

```bash
# 运行内容分发脚本
node scripts/chinese-english-rss-aggregator.cjs
```

### 验证脚本

使用 `test-chinese-content.cjs` 脚本验证内容分发是否正确：

```bash
# 验证中英文内容分发
node scripts/test-chinese-content.cjs
```

### 清理脚本

使用 `cleanup-english-articles-in-chinese.cjs` 脚本清理错误分发的内容：

```bash
# 清理中文目录中的英文文章
node scripts/cleanup-english-articles-in-chinese.cjs
```

## 目录结构

```
src/content/blog/
├── crypto-news/          # 中文文章目录
└── en/crypto-news/       # 英文文章目录
```

## GitHub Actions 集成

工作流文件 `.github/workflows/direct-rss-news.yml` 使用新的聚合脚本确保正确的内容分发。

## 常见问题

### 为什么中文版网站不能显示英文文章？

为了保持网站的语言纯净性，确保用户在中文版网站上只看到中文内容，提升用户体验。

### 英文版网站会显示中文文章吗？

是的，英文版网站可以显示中文文章的英文翻译版本，以服务国际用户。

### 如何添加中文内容源？

目前系统主要处理英文 RSS 源。要添加中文内容源，需要：

1. 在脚本中添加中文 RSS 源
2. 修改语言检测逻辑
3. 确保内容正确分发到相应目录