# Auto-News 自动新闻聚合系统设置指南

## 简介

Auto-News 是一个基于 [finaldie/auto-news](https://github.com/finaldie/auto-news) 的自动新闻聚合系统，可以定时抓取最新的加密货币新闻并自动发布到您的网站。

## 系统架构

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│                 │    │                  │    │                  │
│   RSS 源/其他    │───▶│  Auto-News 容器  │───▶│    Notion DB     │
│   新闻源         │    │                  │    │                  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
                                                              │
                                                              ▼
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│                 │    │                  │    │                  │
│  GitHub Actions │───▶│ 生成脚本处理器    │───▶│  网站内容目录     │
│   定时任务       │    │                  │    │                  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
```

## 设置步骤

### 1. 准备 Notion 环境

1. 创建一个新的 Notion 页面作为主入口页面
2. 在 Notion 中创建集成（Integration）并获取 token
3. 记录主入口页面的页面 ID

### 2. 配置 GitHub Secrets

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加以下 secrets：

- `NOTION_TOKEN`: Notion 集成 token
- `NOTION_ENTRY_PAGE_ID`: Notion 主入口页面 ID
- `OPENAI_API_KEY`: OpenAI API 密钥（用于新闻摘要生成）
- `NOTION_DATABASE_ID`: Notion 数据库 ID（用于读取聚合的新闻）

### 3. 配置新闻源

Auto-News 支持多种新闻源：

1. **RSS 源**: 在 Notion 配置页面中添加您关注的加密货币新闻 RSS 源
2. **Reddit**: 配置 Reddit API token 来获取相关讨论
3. **Twitter**: 配置 Twitter Developer token 来获取推文（需要付费账户）

### 4. 自定义配置

您可以在 `.github/workflows/auto-news.yml` 中调整以下配置：

- 聚合频率：修改 `cron` 表达式来更改运行频率
- LLM 模型：在 env 文件中更改 `OPENAI_MODEL` 来使用不同的模型
- 其他提供商：可以切换到 Google Gemini 或 Ollama

## 工作流说明

### auto-news.yml

该工作流包含两个主要任务：

1. **aggregate-news**: 运行 Auto-News Docker 容器来抓取和聚合新闻
2. **publish-news**: 从 Notion 数据库中读取聚合的新闻并生成博客文章

## 生成的新闻文章

脚本会自动生成符合您网站格式的 Markdown 文章，并放置在 `src/content/blog/crypto-news/` 目录中。

## 自定义新闻生成脚本

`scripts/generate-news-posts.js` 脚本负责：

1. 从 Notion 数据库中读取聚合的新闻
2. 将新闻转换为符合网站格式的 Markdown 文章
3. 保存到内容目录中

您可以根据需要修改此脚本以适应不同的内容结构或添加额外的处理逻辑。

## 故障排除

### 常见问题

1. **新闻未生成**: 检查 Notion 集成权限和页面访问权限
2. **API 限制**: 如果使用免费的 OpenAI API，可能会遇到速率限制
3. **Docker 容器错误**: 检查环境变量配置是否正确

### 日志查看

可以通过 GitHub Actions 的运行日志来查看详细信息：

1. 进入仓库的 Actions 选项卡
2. 选择 Auto News Aggregator 工作流
3. 查看最近的运行记录

## 扩展功能

### 添加更多新闻源

在 Notion 配置页面中可以添加更多类型的新闻源：

- YouTube 频道
- 网页文章
- 个人 Journal 笔记

### 多语言支持

当前脚本支持中英文新闻生成，可以通过修改脚本来支持更多语言。

### 自定义过滤规则

可以通过修改 Auto-News 配置来过滤不相关的内容，只保留您感兴趣的新闻。

## 维护建议

1. 定期检查 Notion 数据库中的新闻质量
2. 根据需要调整 LLM 模型以获得更好的摘要效果
3. 监控 GitHub Actions 的运行状态，确保自动化流程正常工作

## 测试脚本

项目提供了测试脚本 `scripts/test-news-aggregation.js`，可以生成示例新闻文章用于测试和开发：

```bash
# 生成测试新闻文章
pnpm test-news
```

## 🚀 自动化设置 / Automated Setup

项目提供了一个自动化设置脚本，可以帮助您快速配置整个新闻聚合系统：

```bash
# 运行自动化设置脚本
pnpm setup-news
```

该脚本将引导您完成以下步骤：

1. 创建 .env.example 配置文件模板
2. 更新 README 文档
3. 创建 Notion 数据库结构
4. 添加示例数据
5. 提供下一步操作指南