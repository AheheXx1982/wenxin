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
    title: '大叔',
    alternate: '大叔',
    subtitle: '记录平凡的生活故事',
    description: '记录生活',
    author: '大叔',
    navLinks: [
      { name: '首页', href: '/' },
      { name: '按摩那点事', href: '/categories/massage' },
      { name: '何处觅知音', href: '/categories/friendship' },
      { name: '新加坡往事', href: '/categories/singapore', hot: true },
    ],
    featuredCategories: [
      {
        link: '/categories/massage',
        label: '按摩那点事',
        image: '/img/massage/1.webp',
        description: '一个按摩师傅的成长故事与心得体会',
      },
      {
        link: '/categories/friendship',
        label: '何处觅知音',
        image: '/img/friendship/1.webp',
        description: '人生路上的知音难觅与情感故事',
      },
      {
        link: '/categories/singapore',
        label: '新加坡往事',
        image: '/img/singapore/1.webp',
        description: '在异国他乡的奋斗经历与人生感悟',
      },
    ],
  },
  en: {
    title: '大叔',
    alternate: '大叔',
    subtitle: 'Options Trading & Stable Cash Flow System',
    description:
      'Focus on US stock options trading, sharing real, low-risk, replicable cash flow investment strategies, leading you into the investment world built by rationality and discipline.',
    author: '大叔',
    navLinks: [
      { name: 'Home', href: '/en' },
      { name: '按摩那点事', href: '/en/categories/massage' },
      { name: '何处觅知音', href: '/en/categories/friendship' },
      { name: '新加坡往事', href: '/en/categories/singapore', hot: true },
    ],
    featuredCategories: [
      {
        link: '/en/categories/massage',
        label: 'Massage Stories',
        image: '/img/massage/1.webp',
        description: 'A massage therapist\'s growth stories and insights',
      },
      {
        link: '/en/categories/friendship',
        label: 'Finding Soulmates',
        image: '/img/friendship/1.webp',
        description: 'The journey of finding kindred spirits in life',
      },
      {
        link: '/en/categories/singapore',
        label: 'Singapore Memories',
        image: '/img/singapore/1.webp',
        description: 'Struggles and reflections in a foreign land',
      },
    ],
  },
} as const;

// 多语言 SEO 配置
export const i18nSeoConfig = {
  zh: {
    title: '按摩大叔｜寂静猎手 · 美股期权实战与稳定现金流系统',
    description: '聚焦美股期权交易，分享真实、低风险、可复制的现金流投资策略，带你走进理性与纪律构建的投资世界。',
    keywords: 'SilentXx, 寂静猎手, 期权交易, 现金流投资, 美股期权, 投资策略, 金融博客',
  },
  en: {
    title: '按摩大叔｜寂静猎手 · Options Trading & Stable Cash Flow System',
    description:
      'Focus on US stock options trading, sharing real, low-risk, replicable cash flow investment strategies, leading you into the investment world built by rationality and discipline.',
    keywords:
      'SilentXx, 寂静猎手, Options Trading, Cash Flow Investment, US Stock Options, Investment Strategy, Financial Blog',
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
    totalSubcategoriesCount: '个子分类',

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
      期权入门与基础: '期权入门与基础',
      期权基础认知: '期权基础认知',
      期权核心参数: '期权核心参数',
      新手避坑与认知升级: '新手避坑与认知升级',
      期权策略与实战: '期权策略与实战',
      卖方核心策略: '卖方核心策略',
      买方与对冲策略: '买方与对冲策略',
      实盘拆解与复盘: '实盘拆解与复盘',
      稳定现金流系统: '稳定现金流系统',
      现金流系统构建: '现金流系统构建',
      策略组合与轮动: '策略组合与轮动',
      风险管理与回撤控制: '风险管理与回撤控制',
      期权工具箱: '期权工具箱',
      交易平台与模拟器: '交易平台与模拟器',
      行情筛选与数据: '行情筛选与数据',
      模板与效率清单: '模板与效率清单',
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
    totalSubcategoriesCount: 'subcategories',

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
      期权入门与基础: 'Options Basics',
      期权基础认知: 'Options Mindset',
      期权核心参数: 'Options Metrics',
      新手避坑与认知升级: 'Options Pitfalls',
      期权策略与实战: 'Strategies & Practice',
      卖方核心策略: 'Seller Strategies',
      买方与对冲策略: 'Hedging Strategies',
      实盘拆解与复盘: 'Trade Review',
      稳定现金流系统: 'Stable Cash Flow System',
      现金流系统构建: 'Cash Flow System Framework',
      策略组合与轮动: 'Strategy Allocation & Rotation',
      风险管理与回撤控制: 'Risk Management & Drawdown Control',
      期权工具箱: 'Options Toolbox',
      交易平台与模拟器: 'Trading Platforms & Simulation',
      行情筛选与数据: 'Screeners & Data',
      模板与效率清单: 'Templates & Checklists',
    },
  },
} as const;
