#!/usr/bin/env node

/**
 * 中英文 RSS 新闻聚合器
 * 正确处理中英文内容分发
 */

const fs = require('fs').promises;
const path = require('path');
const Parser = require('rss-parser');

// 配置
const CONFIG = {
  // RSS 源列表（目前都是英文源）
  RSS_SOURCES: [
    {
      url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
      name: 'CoinDesk'
    },
    {
      url: 'https://cryptoslate.com/feed/',
      name: 'CryptoSlate'
    },
    {
      url: 'https://decrypt.co/feed',
      name: 'Decrypt'
    }
  ],
  
  // 新闻文章目录
  NEWS_DIR_CN: path.join(__dirname, '../src/content/blog/crypto-news'),
  NEWS_DIR_EN: path.join(__dirname, '../src/content/blog/en/crypto-news'),
  
  // 默认标签和分类
  DEFAULT_TAGS_CN: ['加密货币', '新闻'],
  DEFAULT_TAGS_EN: ['Cryptocurrency', 'News'],
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

// 清理 HTML 标签
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
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

// 确保所有需要的目录存在
async function ensureAllDirectoriesExist() {
  await ensureDirectoryExists(CONFIG.NEWS_DIR_CN);
  await ensureDirectoryExists(CONFIG.NEWS_DIR_EN);
}

// 从 RSS 源获取新闻
async function fetchNewsFromRSS() {
  try {
    logInfo('开始从 RSS 源获取新闻...');
    
    const parser = new Parser({
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const allNews = [];
    
    // 遍历所有 RSS 源
    for (const source of CONFIG.RSS_SOURCES) {
      try {
        logInfo(`正在获取 ${source.name} 的新闻...`);
        const feed = await parser.parseURL(source.url);
        
        // 处理每个新闻项
        for (const item of feed.items.slice(0, CONFIG.MAX_NEWS_COUNT)) {
          // 跳过没有标题的文章
          if (!item.title) {
            continue;
          }
          
          // 提取内容（如果有）
          const content = item['content:encoded'] || item.content || item.summary || '暂无内容';
          
          // 提取日期
          const date = item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
          
          // 提取来源链接
          const sourceUrl = item.link || '';
          
          // 提取摘要（如果有）
          const description = stripHtml(item.summary || content.substring(0, 100) + '...').substring(0, 150).replace(/[^a-zA-Z0-9\u4e00-\u9fff\s.,!?]/g, '').replace(/["']/g, '');
          
          // 提取图片（如果有）
          let imageUrl = '';
          if (item.enclosure && item.enclosure.url) {
            imageUrl = item.enclosure.url;
          } else if (item.media && item.media.thumbnail && item.media.thumbnail.url) {
            imageUrl = item.media.thumbnail.url;
          } else if (content) {
            // 从内容中提取第一张图片
            const imgMatch = content.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/i);
            if (imgMatch && imgMatch[1]) {
              imageUrl = imgMatch[1];
            }
          }
          
          // 由于所有RSS源都是英文的，我们将所有文章标记为英文
          const lang = 'en';
          
          // 只处理包含英文的文章（因为RSS源都是英文的）
          if (!/[a-zA-Z]/.test(item.title)) {
            continue;
          }
          
          allNews.push({
            id: item.guid || item.id || item.link || Math.random().toString(),
            title: item.title.replace(/["']/g, ''),
            content: content.replace(/["']/g, ''),
            description: description.replace(/["']/g, ''),
            date: date,
            tags: [...CONFIG.DEFAULT_TAGS_EN, source.name],
            category: CONFIG.DEFAULT_CATEGORY,
            source: sourceUrl.replace(/["']/g, ''),
            image: imageUrl,
            lang: lang
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
    
    logInfo(`总共获取到 ${limitedNews.length} 条英文新闻`);
    return limitedNews;
  } catch (error) {
    logError(`从 RSS 源获取数据时出错: ${error.message}`);
    throw error;
  }
}

// 检查文件是否已存在
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// 生成博客文章文件
async function generateBlogPost(post) {
  try {
    // 确定目录 - 英文文章只发布到英文版网站
    const newsDir = CONFIG.NEWS_DIR_EN;
    
    // 清理标题，用于文件名
    const cleanTitle = post.title
      .replace(/[^\w\s\u4e00-\u9fff]/g, '') // 移除特殊字符，但保留中文
      .replace(/\s+/g, '-') // 将空格替换为连字符
      .toLowerCase()
      .substring(0, 100); // 限制文件名长度
    
    const fileName = `${cleanTitle}.md`;
    const filePath = path.join(newsDir, fileName);
    
    // 检查文件是否已存在
    if (await fileExists(filePath)) {
      logInfo(`文章已存在，跳过: ${fileName}`);
      return null;
    }
    
    // 使用原始标题和描述
    const title = post.title;
    const description = post.description;
    const tags = post.tags;
    
    // 清理内容中的 HTML 标签
    let cleanContent = stripHtml(post.content);
    
    // 改善内容排版 - 添加段落分隔
    cleanContent = cleanContent
      .replace(/\n{3,}/g, '\n\n') // 将多个换行符替换为两个换行符
      .replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2') // 在英文句号、感叹号、问号后添加段落分隔
      .trim();
    
    // 构建 frontmatter
    let frontmatter = `---
title: '${title.replace(/'/g, "''")}'
description: '${description.replace(/'/g, "''")}'
date: ${post.date}
tags: [${tags.map(tag => `'${tag.replace(/'/g, "''")}'`).join(', ')}]
category: ${post.category}
${post.source ? `source: '${post.source.replace(/'/g, "''")}'` : ''}
lang: ${post.lang}
`;

    // 如果有图片，添加到 frontmatter
    if (post.image) {
      frontmatter += `image: '${post.image.replace(/'/g, "''")}'\n`;
    }

    frontmatter += `---

`;

    // 如果有图片，在内容前添加图片
    if (post.image) {
      frontmatter += `![新闻图片](${post.image})\n\n`;
    }

    frontmatter += cleanContent;
    
    // 写入文件
    await fs.writeFile(filePath, frontmatter, 'utf8');
    logSuccess(`已生成英文文章: ${fileName}`);
    
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
    
    // 确保所有目录存在
    await ensureAllDirectoriesExist();
    
    // 从 RSS 源获取新闻
    const newsPosts = await fetchNewsFromRSS();
    
    if (newsPosts.length === 0) {
      logWarning('没有找到可发布的英文新闻');
      return;
    }
    
    logInfo(`准备生成 ${newsPosts.length} 篇英文文章`);
    
    // 生成博客文章（只生成英文版本）
    const generatedFiles = [];
    let skippedCount = 0;
    for (const post of newsPosts) {
      try {
        // 只生成英文版本
        const filePath = await generateBlogPost(post);
        if (filePath) {
          generatedFiles.push(filePath);
        } else {
          skippedCount++;
        }
      } catch (error) {
        logError(`生成文章 "${post.title}" 时出错: ${error.message}`);
      }
    }
    
    if (skippedCount > 0) {
      logInfo(`跳过了 ${skippedCount} 篇已存在的文章`);
    }
    
    logSuccess(`成功生成 ${generatedFiles.length} 篇英文新闻文章`);
    
    // 显示生成的文件列表
    if (generatedFiles.length > 0) {
      logInfo('生成的文件列表:');
      generatedFiles.forEach(file => {
        console.log(`  - [英文] ${path.basename(file)}`);
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