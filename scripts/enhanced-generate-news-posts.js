#!/usr/bin/env node

/**
 * 增强版新闻生成脚本
 * 从 Notion 数据库获取聚合的新闻并生成博客文章
 */

const fs = require('fs').promises;
const path = require('path');
const { Client } = require('@notionhq/client');
const { propertyMapping, defaults } = require('./notion-config');

// 配置
const CONFIG = {
  // Notion API 配置
  NOTION_TOKEN: process.env.NOTION_TOKEN,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,

  // 新闻文章目录
  NEWS_DIR: path.join(__dirname, '../src/content/blog/crypto-news'),

  // 默认标签和分类
  DEFAULT_TAGS: ['加密货币', '新闻'],
  DEFAULT_CATEGORY: 'crypto-news',

  // 限制获取的新闻数量
  MAX_NEWS_COUNT: 10,
};

// 初始化 Notion 客户端
const notion = new Client({
  auth: CONFIG.NOTION_TOKEN,
});

// 日志函数
function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logWarning(message) {
  console.warn(`⚠️  ${message}`);
}

function logError(message) {
  console.error(`❌ ${message}`);
}

// 确保目录存在
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    logInfo(`确保目录存在: ${dirPath}`);
  } catch (error) {
    logError(`创建目录失败: ${dirPath}`);
    throw error;
  }
}

// 从 Notion 获取新闻数据
async function fetchNewsFromNotion() {
  try {
    logInfo('开始从 Notion 数据库获取新闻...');

    if (!CONFIG.NOTION_DATABASE_ID) {
      throw new Error('NOTION_DATABASE_ID 环境变量未设置');
    }

    // 查询 Notion 数据库
    const response = await notion.databases.query({
      database_id: CONFIG.NOTION_DATABASE_ID,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
      filter: {
        property: propertyMapping.published,
        checkbox: {
          equals: true,
        },
      },
      page_size: CONFIG.MAX_NEWS_COUNT,
    });

    logInfo(`从 Notion 获取到 ${response.results.length} 条新闻`);

    // 转换 Notion 数据为博客文章格式
    const newsPosts = response.results.map((page) => {
      // 获取页面属性
      const properties = page.properties;

      // 提取标题
      const title = properties[propertyMapping.title]?.title?.[0]?.plain_text || '未命名文章';

      // 提取内容
      const content =
        properties[propertyMapping.content]?.rich_text?.[0]?.plain_text ||
        properties[propertyMapping.summary]?.rich_text?.[0]?.plain_text ||
        '暂无内容';

      // 提取日期
      const date = properties[propertyMapping.date]?.date?.start || new Date().toISOString().split('T')[0];

      // 提取标签
      const tags = properties[propertyMapping.tags]?.multi_select?.map((tag) => tag.name) || [...defaults.tags];

      // 提取分类
      const category = properties[propertyMapping.category]?.select?.name || defaults.category;

      // 提取摘要
      const description = properties[propertyMapping.summary]?.rich_text?.[0]?.plain_text || content.substring(0, 100) + '...';

      // 提取来源链接
      const source = properties[propertyMapping.source]?.url || '';

      return {
        id: page.id,
        title: title,
        content: content,
        description: description,
        date: date,
        tags: tags,
        category: category,
        source: source,
      };
    });

    return newsPosts;
  } catch (error) {
    logError(`从 Notion 获取数据时出错: ${error.message}`);
    throw error;
  }
}

// 生成博客文章文件
async function generateBlogPost(post) {
  try {
    // 清理标题，用于文件名
    const cleanTitle = post.title
      .replace(/[^\w\s\u4e00-\u9fff]/g, '') // 移除特殊字符，但保留中文
      .replace(/\s+/g, '-') // 将空格替换为连字符
      .toLowerCase();

    const fileName = `${cleanTitle}.md`;
    const filePath = path.join(CONFIG.NEWS_DIR, fileName);

    // 构建 frontmatter
    const frontmatter = `---
title: "${post.title}"
description: "${post.description}"
date: ${post.date}
tags: [${post.tags.map((tag) => `"${tag}"`).join(', ')}]
category: ${post.category}
${post.source ? `source: "${post.source}"` : ''}
---

${post.content}
`;

    // 写入文件
    await fs.writeFile(filePath, frontmatter, 'utf8');
    logSuccess(`已生成新闻文章: ${fileName}`);

    return filePath;
  } catch (error) {
    logError(`生成博客文章失败: ${error.message}`);
    throw error;
  }
}

// 主函数
async function main() {
  try {
    logInfo('开始生成新闻文章...');

    // 确保新闻目录存在
    await ensureDirectoryExists(CONFIG.NEWS_DIR);

    // 从 Notion 获取新闻
    const newsPosts = await fetchNewsFromNotion();

    if (newsPosts.length === 0) {
      logWarning('没有找到可发布的新闻');
      return;
    }

    logInfo(`准备生成 ${newsPosts.length} 篇新闻文章`);

    // 生成博客文章
    const generatedFiles = [];
    for (const post of newsPosts) {
      try {
        const filePath = await generateBlogPost(post);
        generatedFiles.push(filePath);
      } catch (error) {
        logError(`生成文章 "${post.title}" 时出错: ${error.message}`);
      }
    }

    logSuccess(`成功生成 ${generatedFiles.length} 篇新闻文章`);

    // 显示生成的文件列表
    if (generatedFiles.length > 0) {
      logInfo('生成的文件列表:');
      generatedFiles.forEach((file) => {
        console.log(`  - ${path.basename(file)}`);
      });
    }
  } catch (error) {
    logError(`生成新闻文章时出错: ${error.message}`);
    process.exit(1);
  }
}

// 执行主函数
if (require.main === module) {
  main();
}

// 导出函数供其他模块使用
module.exports = {
  fetchNewsFromNotion,
  generateBlogPost,
  main,
};
