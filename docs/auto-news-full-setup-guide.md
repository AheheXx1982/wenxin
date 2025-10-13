# Auto-News 完整自动化设置指南

## 目录

1. [系统概述](#系统概述)
2. [准备工作](#准备工作)
3. [Notion 配置](#notion-配置)
4. [GitHub 配置](#github-配置)
5. [本地开发环境配置](#本地开发环境配置)
6. [测试和验证](#测试和验证)
7. [故障排除](#故障排除)

## 系统概述

Auto-News 是一个基于 [finaldie/auto-news](https://github.com/finaldie/auto-news) 的自动新闻聚合系统，可以定时抓取最新的加密货币新闻并自动发布到您的网站。

### 工作流程

```plain
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

## 准备工作

### 系统要求

- Node.js >= 18.x
- npm 或 pnpm
- Docker (可选，用于本地测试)
- GitHub 账户
- Notion 账户

### 项目结构

确保您的项目具有以下结构：

```plain
your-project/
├── .github/
│   └── workflows/
│       └── auto-news.yml
├── scripts/
│   ├── enhanced-generate-news-posts.js
│   ├── notion-config.js
│   ├── setup-auto-news.cjs
│   └── test-news-aggregation.cjs
├── src/
│   └── content/
│       └── blog/
│           └── crypto-news/
├── docs/
│   ├── auto-news-setup.md
│   └── auto-news-full-setup-guide.md
├── package.json
└── .env.example
```

## Notion 配置

### 1. 创建 Notion 集成

1. 访问 [Notion 开发者门户](https://www.notion.so/my-integrations)
2. 点击 "Create new integration"
3. 填写集成名称（例如："Auto-News Integration"）
4. 选择相应的工作区
5. 点击 "Submit" 创建集成
6. 复制 "Internal Integration Token"（即 NOTION_TOKEN）

### 2. 创建新闻数据库

1. 在 Notion 中创建一个新的页面作为入口页面
2. 记录页面 URL，从中提取页面 ID（NOTION_ENTRY_PAGE_ID）
3. 在该页面中创建一个数据库，用于存储新闻文章

### 3. 配置数据库结构

新闻数据库应包含以下属性：

| 属性名    | 类型         | 说明     |
| --------- | ------------ | -------- |
| Title     | Title        | 新闻标题 |
| Content   | Text         | 新闻内容 |
| Date      | Date         | 发布日期 |
| Tags      | Multi-select | 标签     |
| Category  | Select       | 分类     |
| Summary   | Text         | 摘要     |
| Source    | URL          | 来源链接 |
| Published | Checkbox     | 发布状态 |

### 4. 授权集成访问页面

1. 打开入口页面
2. 点击右上角的 "Share" 按钮
3. 在 "Invite" 下拉菜单中选择您创建的集成
4. 点击 "Invite" 授权访问

## GitHub 配置

### 1. 配置 Secrets

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加以下 secrets：

- `NOTION_TOKEN`: Notion 集成 token
- `NOTION_ENTRY_PAGE_ID`: Notion 入口页面 ID
- `NOTION_DATABASE_ID`: Notion 数据库 ID
- `OPENAI_API_KEY`: OpenAI API 密钥（可选，用于新闻摘要）

### 2. 启用 GitHub Actions

确保 GitHub Actions 已启用，工作流文件 `.github/workflows/auto-news.yml` 会自动被识别和运行。

## 本地开发环境配置

### 1. 安装依赖

```bash
# 安装项目依赖
npm install

# 或者使用 pnpm
pnpm install
```

### 2. 配置环境变量

```bash
# 复制示例配置文件
cp .env.example .env

# 编辑 .env 文件，填写您的实际配置
```

.env 文件内容示例：

```env
# Notion 配置
NOTION_TOKEN=your_notion_integration_token
NOTION_ENTRY_PAGE_ID=your_notion_entry_page_id
NOTION_DATABASE_ID=your_notion_database_id

# OpenAI 配置 (可选)
OPENAI_API_KEY=your_openai_api_key
LLM_PROVIDER=openai
OPENAI_MODEL=gpt-4o-mini
```

### 3. 可用的脚本命令

```bash
# 运行自动化设置脚本
pnpm setup-news

# 生成新闻文章
pnpm generate-news

# 生成测试新闻文章
pnpm test-news
```

## 测试和验证

### 1. 运行自动化设置脚本

```bash
pnpm setup-news
```

该脚本将引导您完成 Notion 数据库的创建和配置。

### 2. 生成测试新闻

```bash
pnpm test-news
```

这将生成一些示例新闻文章，用于测试和验证系统功能。

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:3000/categories/crypto-news` 查看生成的新闻文章。

### 4. 手动运行新闻生成脚本

```bash
pnpm generate-news
```

这将从 Notion 数据库获取最新的新闻并生成博客文章。

## 故障排除

### 常见问题

#### 1. Notion API 访问权限问题

**问题**: 出现 "Unauthorized" 或 "Restricted resource" 错误

**解决方案**:

- 确保 Notion 集成已正确创建并复制了正确的 token
- 确保集成已被授权访问相应的页面和数据库
- 检查 NOTION_ENTRY_PAGE_ID 和 NOTION_DATABASE_ID 是否正确

#### 2. 环境变量未设置

**问题**: 出现 "Environment variable not set" 错误

**解决方案**:

- 确保 .env 文件已创建并正确填写
- 确保在 GitHub Actions 中设置了相应的 secrets

#### 3. GitHub Actions 工作流未运行

**问题**: 工作流未按预期运行

**解决方案**:

- 检查 .github/workflows/auto-news.yml 文件是否存在且格式正确
- 确保 GitHub Actions 已启用
- 检查工作流触发条件（cron 表达式）

#### 4. 新闻文章未生成

**问题**: 运行脚本后未生成新闻文章

**解决方案**:

- 检查 Notion 数据库中是否有标记为 "Published" 的文章
- 检查数据库属性名称是否与配置文件中的映射一致
- 查看脚本运行日志以获取更多错误信息

### 日志查看

#### 本地开发

运行脚本时会输出详细的日志信息，包括：

- 信息日志 (ℹ️): 显示操作进度
- 成功日志 (✅): 显示成功完成的操作
- 警告日志 (⚠️): 显示需要注意的问题
- 错误日志 (❌): 显示错误信息

#### GitHub Actions

1. 进入仓库的 Actions 选项卡
2. 选择 "Auto News Aggregator" 工作流
3. 查看最近的运行记录
4. 点击具体的运行记录查看详细日志

### 调试技巧

1. **使用测试脚本**: 运行 `pnpm test-news` 生成示例数据进行测试
2. **检查 Notion 数据库**: 确保数据库结构和数据格式正确
3. **验证环境变量**: 确保所有必需的环境变量都已正确设置
4. **查看工作流日志**: 在 GitHub Actions 中查看详细的运行日志

## 扩展功能

### 自定义新闻源

Auto-News 支持多种新闻源：

1. **RSS 源**: 在 Notion 配置页面中添加您关注的加密货币新闻 RSS 源
2. **Reddit**: 配置 Reddit API token 来获取相关讨论
3. **Twitter**: 配置 Twitter Developer token 来获取推文（需要付费账户）

### 多语言支持

当前脚本支持中英文新闻生成，可以通过修改脚本来支持更多语言。

### 自定义过滤规则

可以通过修改 Auto-News 配置来过滤不相关的内容，只保留您感兴趣的新闻。

## 维护建议

1. **定期检查 Notion 数据库**: 确保新闻质量和数据完整性
2. **监控 GitHub Actions**: 定期检查工作流运行状态
3. **更新依赖**: 定期更新项目依赖以获取最新功能和安全修复
4. **备份配置**: 定期备份重要的配置文件和环境变量

## 参考资料

- [Notion API 文档](https://developers.notion.com/)
- [Auto-News GitHub 仓库](https://github.com/finaldie/auto-news)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
