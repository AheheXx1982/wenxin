#!/usr/bin/env node

/**
 * 从 Notion 获取聚合的新闻并生成博客文章的脚本
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');

// Notion API 配置
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// 初始化 Notion 客户端
const notion = new Client({
  auth: NOTION_TOKEN,
});

// 新闻文章目录
const NEWS_DIR = path.join(__dirname, '../src/content/blog/crypto-news');

// 创建目录（如果不存在）
if (!fs.existsSync(NEWS_DIR)) {
  fs.mkdirSync(NEWS_DIR, { recursive: true });
}

// 从 Notion 获取数据的函数
async function fetchNewsFromNotion() {
  try {
    // 查询 Notion 数据库
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ]
    });
    
    // 转换 Notion 数据为博客文章格式
    const newsPosts = response.results.map(page => {
      // 获取页面属性
      const properties = page.properties;
      
      // 提取标题
      const title = properties.Title?.title?.[0]?.plain_text || '未命名文章';
      
      // 提取内容（假设在页面的正文属性中）
      const content = properties.Content?.rich_text?.[0]?.plain_text || '';
      
      // 提取日期
      const date = properties.Date?.date?.start || new Date().toISOString().split('T')[0];
      
      // 提取标签
      const tags = properties.Tags?.multi_select?.map(tag => tag.name) || [];
      
      // 提取分类
      const category = properties.Category?.select?.name || 'crypto-news';
      
      return {
        id: page.id,
        title: title,
        content: content,
        date: date,
        tags: tags,
        category: category
      };
    });
    
    return newsPosts;
  } catch (error) {
    console.error('❌ 从 Notion 获取数据时出错:', error);
    throw error;
  }
}

// 生成博客文章文件
function generateBlogPost(post) {
  const fileName = `${post.title.replace(/\s+/g, '-').toLowerCase()}.md`;
  const filePath = path.join(NEWS_DIR, fileName);
  
  const frontmatter = `---
title: "${post.title}"
description: "最新的加密货币新闻"
date: ${post.date}
tags: [${post.tags.map(tag => `"${tag}"`).join(', ')}]
category: ${post.category}
---

${post.content}
`;

  fs.writeFileSync(filePath, frontmatter);
  console.log(`✅ 已生成新闻文章: ${fileName}`);
}

// 主函数
async function main() {
  try {
    console.log('🔍 开始获取最新的加密货币新闻...');
    
    // 从 Notion 获取新闻
    const newsPosts = await fetchNewsFromNotion();
    
    console.log(`📁 获取到 ${newsPosts.length} 篇新闻文章`);
    
    // 生成博客文章
    for (const post of newsPosts) {
      generateBlogPost(post);
    }
    
    console.log('✅ 所有新闻文章已生成完成');
  } catch (error) {
    console.error('❌ 生成新闻文章时出错:', error);
    process.exit(1);
  }
}

// 执行主函数
main();