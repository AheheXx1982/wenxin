#!/usr/bin/env node

/**
 * 直接 RSS 新闻聚合器
 * 从 RSS 源直接获取新闻并生成 Markdown 文件
 */

const fs = require('fs').promises;
const path = require('path');
const Parser = require('rss-parser');
const { encode } = require('html-entities');

// 配置
const CONFIG = {
  // RSS 源列表
  RSS_SOURCES: [
    {
      url: 'https://rss.coinmarketcap.com/cn/top.xml',
      name: 'CoinMarketCap'
    },
    {
      url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
      name: 'CoinDesk'
    },
    {
      url: 'https://cointelegraph.com/rss',
      name: 'CoinTelegraph'
    }
  ],
  
  // 新闻文章目录
  NEWS_DIR: path.join(__dirname, '../src/content/blog/crypto-news'),
  
  // 默认标签和分类
  DEFAULT_TAGS: ['加密货币', '新闻'],
  DEFAULT_CATEGORY: 'crypto-news',
  
  // 限制获取的新闻数量
  MAX_NEWS_COUNT: 10
};

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

// 从 RSS 源获取新闻
async function fetchNewsFromRSS() {
  try {
    logInfo('开始从 RSS 源获取新闻...');
    
    const parser = new Parser();
    const allNews = [];
    
    // 遍历所有 RSS 源
    for (const source of CONFIG.RSS_SOURCES) {
      try {
        logInfo(`正在获取 ${source.name} 的新闻...`);
        const feed = await parser.parseURL(source.url);
        
        // 处理每个新闻项
        for (const item of feed.items.slice(0, CONFIG.MAX_NEWS_COUNT)) {
          // 提取内容（如果有）
          const content = item['content:encoded'] || item.content || item.summary || '暂无内容';
          
          // 提取日期
          const date = item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
          
          // 提取来源链接
          const sourceUrl = item.link || '';
          
          // 提取摘要（如果有）
          const description = stripHtml(item.summary || content.substring(0, 100) + '...').substring(0, 150).replace(/[^a-zA-Z0-9\u4e00-\u9fff\s.,!?]/g, '').replace(/["']/g, '');
          
          allNews.push({
            id: item.guid || item.id || item.link || Math.random().toString(),
            title: (item.title || '未命名文章').replace(/["']/g, ''),
            content: content.replace(/["']/g, ''),
            description: description.replace(/["']/g, ''),
            date: date,
            tags: [...CONFIG.DEFAULT_TAGS, source.name],
            category: CONFIG.DEFAULT_CATEGORY,
            source: sourceUrl.replace(/["']/g, '')
          });
        }
        
        logSuccess(`从 ${source.name} 获取到 ${feed.items.length} 条新闻`);
      } catch (error) {
        logError(`获取 ${source.name} 的新闻时出错: ${error.message}`);
      }
    }
    
    // 按日期排序，最新的在前面
    allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 限制总数
    const limitedNews = allNews.slice(0, CONFIG.MAX_NEWS_COUNT);
    
    logInfo(`总共获取到 ${limitedNews.length} 条新闻`);
    return limitedNews;
  } catch (error) {
    logError(`从 RSS 源获取数据时出错: ${error.message}`);
    throw error;
  }
}

// 清理 HTML 标签
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
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
    
    // 清理内容中的 HTML 标签
    const cleanContent = stripHtml(post.content);
    
    // 构建 frontmatter
    const frontmatter = `---
title: '${post.title.replace(/'/g, "''")}'
description: '${post.description.replace(/'/g, "''")}'
date: ${post.date}
tags: [${post.tags.map(tag => `'${tag.replace(/'/g, "''")}'`).join(', ')}]
category: ${post.category}
${post.source ? `source: '${post.source.replace(/'/g, "''")}'` : ''}
---

${cleanContent}
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
    
    // 从 RSS 源获取新闻
    const newsPosts = await fetchNewsFromRSS();
    
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
      generatedFiles.forEach(file => {
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
  fetchNewsFromRSS,
  generateBlogPost,
  main
};