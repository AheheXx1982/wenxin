#!/usr/bin/env node

/**
 * 测试新闻聚合功能的脚本
 */

const fs = require('fs');
const path = require('path');

// 测试数据
const testData = [
  {
    id: 'test-1',
    title: '比特币价格突破新高',
    content: '比特币价格今日突破历史新高，达到前所未有的水平。市场分析师认为这可能是由于机构投资者的大量买入所致。技术指标显示，比特币的上涨趋势可能会持续一段时间，但投资者仍需谨慎关注市场波动。',
    date: new Date().toISOString().split('T')[0],
    tags: ['比特币', '加密货币', '市场分析'],
    category: 'crypto-news'
  },
  {
    id: 'test-2',
    title: '以太坊2.0升级进展',
    content: '以太坊2.0的升级正在按计划进行，预计将大幅提升网络的处理能力和降低交易费用。开发者社区对这次升级充满期待，认为它将为去中心化应用的发展提供更好的基础设施支持。',
    date: new Date().toISOString().split('T')[0],
    tags: ['以太坊', '区块链', '技术升级'],
    category: 'crypto-news'
  },
  {
    id: 'test-3',
    title: '监管机构对稳定币的新规定',
    content: '多个国家的金融监管机构正在制定针对稳定币的新规定，旨在保护投资者并维护金融稳定。这些规定可能会影响稳定币的发行和使用，市场参与者正在密切关注监管动态。',
    date: new Date().toISOString().split('T')[0],
    tags: ['稳定币', '监管', '政策'],
    category: 'crypto-news'
  }
];

// 新闻文章目录
const NEWS_DIR = path.join(__dirname, '../src/content/blog/crypto-news');

// 创建目录（如果不存在）
if (!fs.existsSync(NEWS_DIR)) {
  fs.mkdirSync(NEWS_DIR, { recursive: true });
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
  console.log(`✅ 已生成测试新闻文章: ${fileName}`);
}

// 主函数
async function main() {
  try {
    console.log('🔍 开始生成测试新闻文章...');
    
    // 生成测试博客文章
    for (const post of testData) {
      generateBlogPost(post);
    }
    
    console.log('✅ 所有测试新闻文章已生成完成');
    console.log('💡 您可以通过以下命令启动开发服务器来查看效果:');
    console.log('   pnpm dev');
  } catch (error) {
    console.error('❌ 生成测试新闻文章时出错:', error);
    process.exit(1);
  }
}

// 执行主函数
main();