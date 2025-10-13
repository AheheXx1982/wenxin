# 直接 RSS 新闻聚合系统

## 简介

直接 RSS 新闻聚合系统是一个简化版的新闻聚合解决方案，它直接从 RSS 源获取新闻内容并生成 Markdown 文件，无需依赖 Notion 数据库。这个系统更加轻量级，易于配置和维护。

## 系统架构

```plain
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│                 │    │                  │    │                  │
│   RSS 源         │───▶│  RSS 聚合脚本     │───▶│  网站内容目录     │
│                 │    │                  │    │                  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
                                                              │
                                                              ▼
                                               ┌──────────────────┐
                                               │                  │
                                               │  GitHub Actions  │
                                               │                  │
                                               └──────────────────┘
```

## 特性

- 🚀 **轻量级**: 无需 Notion 配置，直接从 RSS 源获取数据
- 🕐 **定时抓取**: 每天自动抓取最新的加密货币新闻
- 📝 **自动发布**: 自动生成 Markdown 格式的博客文章并发布
- 🌐 **多源聚合**: 支持多个 RSS 源
- 📊 **智能过滤**: 自动过滤重复内容

## 配置

### RSS 源配置

RSS 源在脚本中配置，可以通过修改 `scripts/direct-rss-news-aggregator.js` 文件中的 `RSS_SOURCES` 数组来添加或删除 RSS 源：

```javascript
const CONFIG = {
  // RSS 源列表
  RSS_SOURCES: [
    {
      url: 'https://rss.coinmarketcap.com/cn/top.xml',
      name: 'CoinMarketCap',
    },
    {
      url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
      name: 'CoinDesk',
    },
    {
      url: 'https://cointelegraph.com/rss',
      name: 'CoinTelegraph',
    },
  ],
  // ... 其他配置
};
```

### 可用的脚本命令

```bash
# 生成新闻文章（从 RSS 源）
pnpm generate-news

# 生成测试新闻文章
pnpm test-news
```

## 工作原理

1. **数据抓取**: 脚本定时从配置的 RSS 源获取最新的新闻
2. **内容处理**: 解析 RSS 内容，提取标题、摘要、正文等信息
3. **格式转换**: 将新闻内容转换为符合网站格式的 Markdown 文章
4. **文件生成**: 将 Markdown 文件保存到 `src/content/blog/crypto-news/` 目录
5. **自动提交**: GitHub Actions 自动提交并发布到网站

## 自定义配置

### 添加新的 RSS 源

在 `scripts/direct-rss-news-aggregator.cjs` 文件中，找到 `RSS_SOURCES` 数组并添加新的 RSS 源：

```javascript
RSS_SOURCES: [
  // ... 现有的 RSS 源
  {
    url: 'https://your-new-rss-source.com/rss',
    name: 'Your Source Name',
  },
];
```

### 调整获取数量

可以通过修改 `MAX_NEWS_COUNT` 配置来调整每次获取的新闻数量：

```javascript
// 限制获取的新闻数量
MAX_NEWS_COUNT: 10;
```

### 自定义标签和分类

可以通过修改 `DEFAULT_TAGS` 和 `DEFAULT_CATEGORY` 配置来自定义默认的标签和分类：

```javascript
// 默认标签和分类
DEFAULT_TAGS: ['加密货币', '新闻'],
DEFAULT_CATEGORY: 'crypto-news'
```

## 故障排除

### 常见问题

#### 1. RSS 源无法访问

**问题**: 出现网络错误或 RSS 源无法解析

**解决方案**:

- 检查 RSS 源 URL 是否正确
- 确保 RSS 源可以正常访问
- 检查网络连接

#### 2. 生成的文章内容不完整

**问题**: 生成的文章内容缺失或格式不正确

**解决方案**:

- 检查 RSS 源的内容结构
- 调整内容提取逻辑
- 查看脚本日志获取更多信息

#### 3. GitHub Actions 工作流未运行

**问题**: 工作流未按预期运行

**解决方案**:

- 检查 `.github/workflows/direct-rss-news.yml` 文件是否存在且格式正确
- 确保 GitHub Actions 已启用
- 检查工作流触发条件（cron 表达式）

## 维护建议

1. **定期检查 RSS 源**: 确保配置的 RSS 源仍然有效
2. **监控 GitHub Actions**: 定期检查工作流运行状态
3. **更新依赖**: 定期更新项目依赖以获取最新功能和安全修复
4. **调整配置**: 根据需要调整 RSS 源和获取数量

## 与 Notion 版本的比较

| 特性       | 直接 RSS 版本 | Notion 版本      |
| ---------- | ------------- | ---------------- |
| 配置复杂度 | 简单          | 复杂             |
| 依赖服务   | 无            | Notion           |
| 设置时间   | 快速          | 需要 Notion 配置 |
| 数据管理   | 直接生成文件  | 通过 Notion 管理 |
| 灵活性     | 较低          | 较高             |
| 维护成本   | 低            | 中等             |

## 迁移指南

如果您之前使用的是 Notion 版本，可以通过以下步骤迁移到直接 RSS 版本：

1. 禁用或删除旧的 `auto-news.yml` 工作流
2. 确保新的 `direct-rss-news.yml` 工作流已启用
3. 更新 `package.json` 中的 `generate-news` 脚本
4. 根据需要调整 RSS 源配置

## 参考资料

- [RSS 规范](https://www.rssboard.org/rss-specification)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
