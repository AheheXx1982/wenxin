// 多语言配置常量
export const LANGUAGES = {
  zh: '简体中文',
  en: 'English',
} as const;

export type Language = keyof typeof LANGUAGES;

export const DEFAULT_LANGUAGE: Language = 'zh';

// 语言切换路径映射
export const getLanguagePath = (lang: Language, path: string = '') => {
  if (lang === DEFAULT_LANGUAGE) {
    return path || '/';
  }
  return `/${lang}${path}`;
};

// 从路径中提取语言代码
export const getLanguageFromPath = (path: string): Language => {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && Object.keys(LANGUAGES).includes(firstSegment)) {
    return firstSegment as Language;
  }

  return DEFAULT_LANGUAGE;
};

// 移除路径中的语言前缀
export const removeLanguagePrefix = (path: string): string => {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && Object.keys(LANGUAGES).includes(firstSegment)) {
    return '/' + segments.slice(1).join('/');
  }

  return path;
};

// 多语言站点配置
export const i18nSiteConfig = {
  zh: {
    title: 'SilentXx｜寂静猎手',
    alternate: 'SilentXx',
    subtitle: '期权加密实战 · 理性现金流系统',
    description: '聚焦美股期权与加密货币交易，分享真实、低风险、可复制的现金流投资策略，带你走进理性与纪律构建的投资世界。',
    author: 'SilentXx',
    navLinks: [
      { name: '首页', href: '/' },
      { name: '课程', href: '/categories/options/course' },
      { name: '实盘', href: '/categories/options/trading-journal' },
      { name: '关于', href: '/about' },
      { name: '幻念集', href: '/illusionary-thoughts' },
    ],
    featuredCategories: [
      {
        link: '/categories/options/course',
        label: '期权课程',
        image: '/img/options/1.webp',
        description: '期权课程',
      },
      {
        link: '/categories/options/trading-journal',
        label: '实盘分享',
        image: '/img/options/2.webp',
        description: '实盘交易记录',
      },
      {
        link: '/categories/crypto/crypto-wiki',
        label: '加密百科',
        image: '/img/crypto/1.webp',
        description: '加密货币百科全书',
      },
      {
        link: '/categories/crypto/grid',
        label: '网格策略',
        image: '/img/crypto/grid/1.webp',
        description: '网格策略',
      },
      {
        link: '/categories/crypto/futures',
        label: '合约交易',
        image: '/img/crypto/7.webp',
        description: '合约交易',
      },
      {
        link: '/categories/cashflow-utopia/option-selling',
        label: '期权卖方策略',
        image: '/img/options/3.webp',
        description: '期权卖方策略',
      },
      {
        link: '/categories/cashflow-utopia/drip',
        label: '全球高息股轮动',
        image: '/img/cashflow-utopia/4.webp',
        description: '全球高息股轮动',
      },
      {
        link: '/categories/new-world-explore/ai',
        label: '智能进化',
        image: '/img/new-world-explore/ai/3.webp',
        description: 'AI人工智能',
      },
      {
        link: '/categories/new-world-explore/crypto-news',
        label: '加密风向标',
        image: '/img/crypto/crypto-news/2.webp',
        description: '加密货币新闻',
      },
      {
        link: '/categories/new-world-explore/quantum-universe',
        label: '量子宇宙',
        image: '/img/new-world-explore/quantum-universe/5.webp',
        description: '探索量子计算的前沿科技',
      },
    ],
  },
  en: {
    title: 'SilentXx｜寂静猎手',
    alternate: 'SilentXx',
    subtitle: 'Options & Crypto Trading · Rational Cash Flow System',
    description:
      'Focus on US stock options and cryptocurrency trading, sharing real, low-risk, replicable cash flow investment strategies, leading you into the investment world built by rationality and discipline.',
    author: 'SilentXx',
    navLinks: [
      { name: 'Home', href: '/en' },
      { name: 'Course', href: '/en/categories/options/course' },
      { name: 'Live Trading', href: '/en/categories/options/trading-journal' },
      { name: 'About', href: '/en/about' },
      { name: 'Thoughts', href: '/en/illusionary-thoughts' },
    ],
    featuredCategories: [
      {
        link: '/en/categories/options/course',
        label: 'Options Course',
        image: '/img/options/1.webp',
        description: 'Options Course',
      },
      {
        link: '/en/categories/options/trading-journal',
        label: 'Live Trading',
        image: '/img/options/2.webp',
        description: 'Live trading records',
      },
      {
        link: '/en/categories/crypto/crypto-wiki',
        label: 'Crypto Wiki',
        image: '/img/crypto/1.webp',
        description: 'Cryptocurrency encyclopedia',
      },
      {
        link: '/en/categories/crypto/grid',
        label: 'Grid Strategy',
        image: '/img/crypto/grid/1.webp',
        description: 'Grid Strategy',
      },
      {
        link: '/en/categories/crypto/futures',
        label: 'Futures Trading',
        image: '/img/crypto/7.webp',
        description: 'Futures Trading',
      },
      {
        link: '/en/categories/cashflow-utopia/option-selling',
        label: 'Option Selling Strategy',
        image: '/img/options/3.webp',
        description: 'Option Selling Strategy',
      },
      {
        link: '/en/categories/cashflow-utopia/drip',
        label: 'Global High-Yield Stock Rotation',
        image: '/img/cashflow-utopia/4.webp',
        description: 'Global High-Yield Stock Rotation',
      },
      {
        link: '/en/categories/new-world-explore/ai',
        label: 'AI Evolution',
        image: '/img/new-world-explore/ai/3.webp',
        description: 'Artificial Intelligence',
      },
      {
        link: '/en/categories/new-world-explore/crypto-news',
        label: 'Crypto Trends',
        image: '/img/crypto/crypto-news/2.webp',
        description: 'Cryptocurrency news',
      },
      {
        link: '/en/categories/new-world-explore/quantum-universe',
        label: 'Quantum Universe',
        image: '/img/new-world-explore/quantum-universe/5.webp',
        description: 'Exploring the frontier technology of quantum computing',
      },
    ],
  },
} as const;

// 多语言 SEO 配置
export const i18nSeoConfig = {
  zh: {
    title: 'SilentXx｜寂静猎手 - 期权加密实战 · 理性现金流系统',
    description: '聚焦美股期权与加密货币交易，分享真实、低风险、可复制的现金流投资策略，带你走进理性与纪律构建的投资世界。',
    keywords: 'SilentXx, 寂静猎手, 期权交易, 加密货币, 现金流投资, 美股期权, 投资策略, 金融博客',
  },
  en: {
    title: 'SilentXx｜寂静猎手 - Options & Crypto Trading · Rational Cash Flow System',
    description:
      'Focus on US stock options and cryptocurrency trading, sharing real, low-risk, replicable cash flow investment strategies, leading you into the investment world built by rationality and discipline.',
    keywords:
      'SilentXx, 寂静猎手, Options Trading, Cryptocurrency, Cash Flow Investment, US Stock Options, Investment Strategy, Financial Blog',
  },
} as const;

// 通用界面文本
export const i18nUI = {
  zh: {
    // 导航
    toggleTheme: '切换主题',
    toggleLanguage: '切换语言',

    // 文章
    readingTime: '阅读时间',
    minutes: '分钟',
    publishedOn: '发布于',
    updatedOn: '更新于',
    tags: '标签',
    categories: '分类',

    // 分页
    previousPage: '上一页',
    nextPage: '下一页',
    page: '第',
    pageOf: '页，共',
    pages: '页',

    // 搜索
    search: '搜索',
    searchPlaceholder: '搜索文章...',
    noResults: '没有找到相关文章',

    // 通用
    loading: '加载中...',
    error: '出错了',
    retry: '重试',
    close: '关闭',
    backToTop: '回到顶部',

    // 页面标题
    aboutTitle: '关于',
    thoughtsTitle: '幻念集',
    categoriesTitle: '分类',

    // 侧边栏
    siteOverview: '站点概览',
    tableOfContents: '文章目录',
    navigationMenu: '导航菜单',

    // 页脚
    footerLabel: '网站页脚',
    subscribeRSS: '订阅 RSS',
    siteStatistics: '网站统计',
    basedOn: '基于',

    // 精选分类
    featuredCategories: '精选分类',
    postList: '文章列表',
    articlesCount: '篇文章',
    subcategoriesCount: '个子分类',
    moreInfo: 'more...',

    // 分类页面
    home: '首页',
    totalCategoriesCount: '目前共计',
    categoriesUnit: '个分类',
    subcategoriesCount: '个子分类',

    // 归档页面
    archives: '归档',
    archivesDescription: '文章归档',
    totalArticlesCount: '目前共计',
    articlesUnit: '篇文章',
    articlesInYear: '篇文章',

    // 标签页面
    allTags: '全部标签',
    tagsDescription: '所有文章标签',
    totalTagsCount: '目前共计',
    tagsUnit: '个标签',

    // 404
    notFoundTitle: '页面未找到',
    notFoundMessage: '抱歉，您要访问的页面不存在。',
    backToHome: '返回首页',

    // 分类名称翻译
    categoryNames: {
      期权研究院: '期权研究院',
      期权课程: '期权课程',
      策略分析: '策略分析',
      实盘分享: '实盘分享',
      加密实验室: '加密实验室',
      网格策略: '网格策略',
      合约交易: '合约交易',
      加密百科: '加密百科',
      现金流乌托邦: '现金流乌托邦',
      期权卖方策略: '期权卖方策略',
      全球高息股轮动: '全球高息股轮动',
      资产配置: '资产配置',
      新世界探索: '新世界探索',
      智能进化: '智能进化',
      量子宇宙: '量子宇宙',
      加密风向标: '加密风向标',
    },
  },
  en: {
    // Navigation
    toggleTheme: 'Toggle Theme',
    toggleLanguage: 'Toggle Language',

    // Article
    readingTime: 'Reading Time',
    minutes: 'minutes',
    publishedOn: 'Published on',
    updatedOn: 'Updated on',
    tags: 'Tags',
    categories: 'Categories',

    // Pagination
    previousPage: 'Previous',
    nextPage: 'Next',
    page: 'Page',
    pageOf: 'of',
    pages: 'pages',

    // Search
    search: 'Search',
    searchPlaceholder: 'Search articles...',
    noResults: 'No articles found',

    // Common
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Retry',
    close: 'Close',
    backToTop: 'Back to Top',

    // Page titles
    aboutTitle: 'About',
    thoughtsTitle: 'Thoughts',
    categoriesTitle: 'Categories',

    // Sidebar
    siteOverview: 'Site Overview',
    tableOfContents: 'Table of Contents',
    navigationMenu: 'Navigation Menu',

    // Footer
    footerLabel: 'Website Footer',
    subscribeRSS: 'Subscribe RSS',
    siteStatistics: 'Site Statistics',
    basedOn: 'Based on',

    // Featured Categories
    featuredCategories: 'Featured Categories',
    postList: 'Article List',
    articlesCount: 'articles',
    subcategoriesCount: 'subcategories',
    moreInfo: 'more...',

    // Category page
    home: 'Home',
    totalCategoriesCount: 'Total',
    categoriesUnit: 'categories',
    subcategoriesCount: 'subcategories',

    // Archives page
    archives: 'Archives',
    archivesDescription: 'Article archives',
    totalArticlesCount: 'Total',
    articlesUnit: 'articles',
    articlesInYear: 'articles',

    // Tags page
    allTags: 'All Tags',
    tagsDescription: 'All article tags',
    totalTagsCount: 'Total',
    tagsUnit: 'tags',

    // 404
    notFoundTitle: 'Page Not Found',
    notFoundMessage: 'Sorry, the page you are looking for does not exist.',
    backToHome: 'Back to Home',

    // 分类名称翻译
    categoryNames: {
      期权研究院: 'Options Academy',
      期权课程: 'Options Course',
      策略分析: 'Strategy Analysis',
      实盘分享: 'Live Trading',
      加密实验室: 'Crypto Lab',
      网格策略: 'Grid Strategy',
      合约交易: 'Futures Trading',
      加密百科: 'Crypto Wiki',
      现金流乌托邦: 'Cash Flow Utopia',
      期权卖方策略: 'Option Selling Strategy',
      全球高息股轮动: 'Global High-Yield Stock Rotation',
      资产配置: 'Asset Allocation',
      新世界探索: 'New World Exploration',
      智能进化: 'AI Evolution',
      量子宇宙: 'Quantum Universe',
      加密风向标: 'Crypto Trends',
    },
  },
} as const;
