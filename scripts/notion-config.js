/**
 * Notion 数据库配置
 * 定义 Notion 数据库中属性的映射关系
 */

module.exports = {
  // 数据库属性映射
  propertyMapping: {
    title: 'Title', // 标题属性
    content: 'Content', // 内容属性
    date: 'Date', // 日期属性
    tags: 'Tags', // 标签属性
    category: 'Category', // 分类属性
    summary: 'Summary', // 摘要属性
    source: 'Source', // 来源链接属性
    published: 'Published', // 发布状态属性
  },

  // 默认值
  defaults: {
    tags: ['加密货币', '新闻'],
    category: 'crypto-news',
    published: true,
  },

  // 支持的标签选项
  supportedTags: ['比特币', '以太坊', '稳定币', '监管', '市场分析', '技术升级', 'DeFi', 'NFT', '加密货币', '新闻'],

  // 支持的分类选项
  supportedCategories: [
    'crypto-news', // 加密新闻
    'market-analysis', // 市场分析
    'regulation', // 监管政策
    'technology', // 技术发展
    'defi', // DeFi
    'nft', // NFT
  ],
};
