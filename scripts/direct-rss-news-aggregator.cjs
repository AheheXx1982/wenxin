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
    
    const parser = new Parser();
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
          
          // 判断文章语言
          const hasChinese = /[\u4e00-\u9fff]/.test(item.title);
          const hasEnglish = /[a-zA-Z]/.test(item.title);
          
          // 确定文章语言
          let lang = 'zh';
          if (hasChinese && !hasEnglish) {
            lang = 'zh';
          } else if (hasEnglish && !hasChinese) {
            lang = 'en';
          } else if (hasChinese && hasEnglish) {
            // 如果同时包含中英文，根据主要语言判断
            const chineseChars = (item.title.match(/[\u4e00-\u9fff]/g) || []).length;
            const englishChars = (item.title.match(/[a-zA-Z]/g) || []).length;
            lang = chineseChars >= englishChars ? 'zh' : 'en';
          }
          
          allNews.push({
            id: item.guid || item.id || item.link || Math.random().toString(),
            title: item.title.replace(/["']/g, ''),
            content: content.replace(/["']/g, ''),
            description: description.replace(/["']/g, ''),
            date: date,
            tags: lang === 'zh' ? [...CONFIG.DEFAULT_TAGS_CN, source.name] : [...CONFIG.DEFAULT_TAGS_EN, source.name],
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
    
    logInfo(`总共获取到 ${limitedNews.length} 条新闻`);
    return limitedNews;
  } catch (error) {
    logError(`从 RSS 源获取数据时出错: ${error.message}`);
    throw error;
  }
}

// 简单的中译英函数（实际应用中应该使用翻译API）
function translateToEnglish(text) {
  // 这里只是一个示例，实际应用中应该使用翻译API
  const translations = {
    '加密货币': 'Cryptocurrency',
    '新闻': 'News',
    '暂无内容': 'No content available',
    '比特币': 'Bitcoin',
    '以太坊': 'Ethereum',
    '市场': 'Market',
    '价格': 'Price',
    '交易': 'Trading',
    '区块链': 'Blockchain',
    '数字': 'Digital',
    '货币': 'Currency',
    '金融': 'Finance',
    '投资': 'Investment',
    '分析': 'Analysis',
    '监管': 'Regulation',
    '政策': 'Policy',
    '技术': 'Technology',
    '发展': 'Development',
    '趋势': 'Trend',
    '风险': 'Risk',
    '机会': 'Opportunity'
  };
  
  // 对于标题和描述，我们只做简单的关键词替换
  let translated = text;
  for (const [chinese, english] of Object.entries(translations)) {
    translated = translated.replace(new RegExp(chinese, 'g'), english);
  }
  
  // 如果没有找到翻译，返回原文
  return translated;
}

// 简单的英译中函数（实际应用中应该使用翻译API）
function translateToChinese(text) {
  // 这里只是一个示例，实际应用中应该使用翻译API
  const translations = {
    'Cryptocurrency': '加密货币',
    'News': '新闻',
    'No content available': '暂无内容',
    'Bitcoin': '比特币',
    'Ethereum': '以太坊',
    'Market': '市场',
    'Price': '价格',
    'Trading': '交易',
    'Blockchain': '区块链',
    'Digital': '数字',
    'Currency': '货币',
    'Finance': '金融',
    'Investment': '投资',
    'Analysis': '分析',
    'Regulation': '监管',
    'Policy': '政策',
    'Technology': '技术',
    'Development': '发展',
    'Trend': '趋势',
    'Risk': '风险',
    'Opportunity': '机会'
  };
  
  // 对于标题和描述，我们只做简单的关键词替换
  let translated = text;
  for (const [english, chinese] of Object.entries(translations)) {
    translated = translated.replace(new RegExp(english, 'gi'), chinese);
  }
  
  // 如果没有找到翻译，返回原文
  return translated;
}

// 生成博客文章文件
async function generateBlogPost(post) {
  try {
    // 确定目录
    const newsDir = post.lang === 'en' ? CONFIG.NEWS_DIR_EN : CONFIG.NEWS_DIR_CN;
    
    // 清理标题，用于文件名
    const cleanTitle = post.title
      .replace(/[^\w\s\u4e00-\u9fff]/g, '') // 移除特殊字符，但保留中文
      .replace(/\s+/g, '-') // 将空格替换为连字符
      .toLowerCase();
    
    const fileName = `${cleanTitle}.md`;
    const filePath = path.join(newsDir, fileName);
    
    // 翻译标题和描述
    let title, description, tags;
    if (post.lang === 'en') {
      // 如果是英文文章，翻译成中文
      title = translateToChinese(post.title);
      description = translateToChinese(post.description);
      tags = post.tags.map(tag => translateToChinese(tag));
    } else {
      // 如果是中文文章，翻译成英文
      title = translateToEnglish(post.title);
      description = translateToEnglish(post.description);
      tags = post.tags.map(tag => translateToEnglish(tag));
    }
    
    // 清理内容中的 HTML 标签
    let cleanContent = stripHtml(post.content);
    
    // 翻译内容
    if (post.lang === 'en') {
      cleanContent = translateToChinese(cleanContent);
    } else {
      cleanContent = translateToEnglish(cleanContent);
    }
    
    // 改善内容排版 - 添加段落分隔
    cleanContent = cleanContent
      .replace(/\n{3,}/g, '\n\n') // 将多个换行符替换为两个换行符
      .replace(/([。！？])\s*([A-Z\u4e00-\u9fff])/g, '$1\n\n$2') // 在句号、感叹号、问号后添加段落分隔
      .replace(/([a-z])\.([A-Z])/g, '$1.\n\n$2') // 在英文句号后添加段落分隔
      .trim();
    
    // 构建 frontmatter
    let frontmatter = `---
title: '${title.replace(/'/g, "''")}'
description: '${description.replace(/'/g, "''")}'
date: ${post.date}
tags: [${tags.map(tag => `'${tag.replace(/'/g, "''")}'`).join(', ')}]
category: ${post.category}
${post.source ? `source: '${post.source.replace(/'/g, "''")}'` : ''}
lang: ${post.lang === 'en' ? 'zh' : 'en'}
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
    logSuccess(`已生成${post.lang === 'en' ? '中文' : '英文'}翻译文章: ${fileName}`);
    
    return filePath;
  } catch (error) {
    logError(`生成博客文章失败: ${error.message}`);
    throw error;
  }
}

// 生成原始语言版本的文章
async function generateBlogPostOriginal(post) {
  try {
    // 确定目录
    const newsDir = post.lang === 'en' ? CONFIG.NEWS_DIR_EN : CONFIG.NEWS_DIR_CN;
    
    // 清理标题，用于文件名
    const cleanTitle = post.title
      .replace(/[^\w\s\u4e00-\u9fff]/g, '') // 移除特殊字符，但保留中文
      .replace(/\s+/g, '-') // 将空格替换为连字符
      .toLowerCase();
    
    const fileName = `${cleanTitle}.md`;
    const filePath = path.join(newsDir, fileName);
    
    // 使用原始标题和描述
    const title = post.title;
    const description = post.description;
    const tags = post.tags;
    
    // 清理内容中的 HTML 标签
    let cleanContent = stripHtml(post.content);
    
    // 改善内容排版 - 添加段落分隔
    cleanContent = cleanContent
      .replace(/\n{3,}/g, '\n\n') // 将多个换行符替换为两个换行符
      .replace(/([。！？])\s*([A-Z\u4e00-\u9fff])/g, '$1\n\n$2') // 在句号、感叹号、问号后添加段落分隔
      .replace(/([a-z])\.([A-Z])/g, '$1.\n\n$2') // 在英文句号后添加段落分隔
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
    logSuccess(`已生成${post.lang === 'en' ? '英文' : '中文'}原始文章: ${fileName}`);
    
    return filePath;
  } catch (error) {
    logError(`生成原始语言博客文章失败: ${error.message}`);
    throw error;
  }
}

// 生成翻译版本的文章
async function generateBlogPostTranslated(post) {
  try {
    // 确定目录（与原始语言相反）
    const newsDir = post.lang === 'en' ? CONFIG.NEWS_DIR_CN : CONFIG.NEWS_DIR_EN;
    
    // 清理标题，用于文件名
    const cleanTitle = post.title
      .replace(/[^\w\s\u4e00-\u9fff]/g, '') // 移除特殊字符，但保留中文
      .replace(/\s+/g, '-') // 将空格替换为连字符
      .toLowerCase();
    
    const fileName = `${cleanTitle}.md`;
    const filePath = path.join(newsDir, fileName);
    
    // 翻译标题和描述
    let title, description, tags;
    if (post.lang === 'en') {
      // 如果原始是英文，翻译成中文
      title = translateToChinese(post.title);
      description = translateToChinese(post.description);
      tags = post.tags.map(tag => translateToChinese(tag));
    } else {
      // 如果原始是中文，翻译成英文
      title = translateToEnglish(post.title);
      description = translateToEnglish(post.description);
      tags = post.tags.map(tag => translateToEnglish(tag));
    }
    
    // 清理内容中的 HTML 标签
    let cleanContent = stripHtml(post.content);
    
    // 翻译内容
    if (post.lang === 'en') {
      cleanContent = translateToChinese(cleanContent);
    } else {
      cleanContent = translateToEnglish(cleanContent);
    }
    
    // 改善内容排版 - 添加段落分隔
    cleanContent = cleanContent
      .replace(/\n{3,}/g, '\n\n') // 将多个换行符替换为两个换行符
      .replace(/([。！？])\s*([A-Z\u4e00-\u9fff])/g, '$1\n\n$2') // 在句号、感叹号、问号后添加段落分隔
      .replace(/([a-z])\.([A-Z])/g, '$1.\n\n$2') // 在英文句号后添加段落分隔
      .trim();
    
    // 构建 frontmatter
    let frontmatter = `---
title: '${title.replace(/'/g, "''")}'
description: '${description.replace(/'/g, "''")}'
date: ${post.date}
tags: [${tags.map(tag => `'${tag.replace(/'/g, "''")}'`).join(', ')}]
category: ${post.category}
${post.source ? `source: '${post.source.replace(/'/g, "''")}'` : ''}
lang: ${post.lang === 'en' ? 'zh' : 'en'}
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
    logSuccess(`已生成${post.lang === 'en' ? '中文' : '英文'}翻译文章: ${fileName}`);
    
    return filePath;
  } catch (error) {
    logError(`生成翻译博客文章失败: ${error.message}`);
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
      logWarning('没有找到可发布的新闻');
      return;
    }
    
    logInfo(`准备生成 ${newsPosts.length} 篇原始语言文章和对应的翻译版本`);
    
    // 生成博客文章（原始语言和翻译版本）
    const generatedFiles = [];
    for (const post of newsPosts) {
      try {
        // 生成原始语言版本
        const originalFilePath = await generateBlogPostOriginal(post);
        generatedFiles.push(originalFilePath);
        
        // 生成翻译版本
        const translatedFilePath = await generateBlogPostTranslated(post);
        generatedFiles.push(translatedFilePath);
      } catch (error) {
        logError(`生成文章 "${post.title}" 及其翻译版本时出错: ${error.message}`);
      }
    }
    
    logSuccess(`成功生成 ${generatedFiles.length} 篇新闻文章（包括原始语言和翻译版本）`);
    
    // 显示生成的文件列表
    if (generatedFiles.length > 0) {
      logInfo('生成的文件列表:');
      generatedFiles.forEach(file => {
        const isEnglish = file.includes('/en/') || file.includes('\\en\\');
        console.log(`  - ${isEnglish ? '[英文]' : '[中文]'} ${path.basename(file)}`);
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