type SiteConfig = {
  title: string; // 网站标题名称（banner 上）
  alternate?: string; // 网站英文短名
  subtitle?: string; // 副标题
  name: string; // 作者名称
  description?: string; // 站点简介（一段话）
  avatar?: string; // 站点头像 logo.png or url
  showLogo?: boolean; // 是否显示 logo，否则用 alternate 当·logo
  author?: string; // 文章作者
  // theme
  enableJSGridCover?: boolean; // 是否启用 color4bg 的背景 (写了不舍得扔)
  site: string; // 站点线上域名 用于 RSS 生成等

  featuredCategories?: {
    link: string;
    image: string;
    label?: string;
    description?: string;
  }[];

  navLinks?: {
    name: string;
    href: string;
  }[];
};

// 社交媒体配置类型
type SocialPlatform = {
  url: string;
  icon: string;
  color: string; // default bg-primary/20
};

type SocialConfig = {
  github?: SocialPlatform;
  google?: SocialPlatform;
  twitter?: SocialPlatform;
  zhihu?: SocialPlatform;
  music?: SocialPlatform;
  weibo?: SocialPlatform;
  about?: SocialPlatform;
  email?: SocialPlatform;
  facebook?: SocialPlatform;
  stackoverflow?: SocialPlatform;
  youtube?: SocialPlatform;
  instagram?: SocialPlatform;
  skype?: SocialPlatform;
  douban?: SocialPlatform;
  bilibili?: SocialPlatform;
  rss?: SocialPlatform;
  Tiger?: SocialPlatform;
};

// TODO: change to backend

// https://shoka.lostyu.me/computer-science/note/theme-shoka-doc/config/
export const siteConfig: SiteConfig = {
  title: '寂静猎手', // 网站名称
  alternate: 'SilentXx', // 网站名称
  subtitle: '期权加密实战 · 理性现金流系统', // 副标题
  name: 'SilentXx',
  description: '聚焦美股期权与加密货币交易，分享真实、低风险、可复制的现金流投资策略，带你走进理性与纪律构建的投资世界。', // 站点简介（一段话）
  avatar: '/img/SilentXx.webp', // 站点头像 logo.png or url
  showLogo: true, // 是否显示 logo 否则用 title
  author: 'SilentXx', // 作者名称

  enableJSGridCover: false, // 是否启用 color4bg 的背景
  site: 'https://www.silentxx.com',

  // 添加 navLinks 配置
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
};

// 社交媒体配置
// https://icon-sets.iconify.design/ri/
export const socialConfig: SocialConfig = {
  github: {
    url: 'https://github.com/ahehexx1982/SilentXx',
    icon: 'ri:github-fill',
    color: '#191717',
  },
  bilibili: {
    url: 'https://www.gateweb.xyz/share/VLRAXQONUW',
    icon: 'ri:btc-fill',
    color: '#1e88e5',
  },
  Tiger: {
    url: 'https://www.laohu8.com/personal/3565567621777483/',
    icon: 'ri:stock-fill', // 使用股票线性图标
    color: '#da708a',
  },
  music: {
    url: 'https://music.douyin.com/qishui/share/playlist?playlist_id=7310550250141696009',
    icon: 'ri:netease-cloud-music-line', // 使用通用音乐线性图标
    color: '#e60026',
  },
  twitter: {
    url: 'https://x.com/AheheXx?s=09',
    icon: 'ri:twitter-fill',
    color: '#4b9ae4',
  },
  rss: {
    url: '/rss.xml',
    icon: 'ri:rss-line',
    color: '#ff6600',
  },
  // #google: https://plus.google.com/yourname || google
  // # about: https://about.me/amehime || address-card || "#3b5998"
  // #facebook: https://www.facebook.com/yourname || facebook
  // #stackoverflow: https://stackoverflow.com/yourname || stack-overflow
  // #youtube: https://youtube.com/yourname || youtube
  // #instagram: https://instagram.com/yourname || instagram
  // #skype: skype:yourname?call|chat || skype
  // #douban: https://www.douban.com/people/yourname/ || douban
  // # weibo: https://weibo.com/amehime || weibo || "#ea716e"
};

const { title, alternate, subtitle } = siteConfig;
export const seoConfig = {
  title: `${alternate ? alternate + '｜' : ''}${title}${subtitle ? ' - ' + subtitle : ''}`,
  description: '聚焦美股期权与加密货币交易，分享真实、低风险、可复制的现金流投资策略，带你走进理性与纪律构建的投资世界。',
  keywords: 'SilentXx, 寂静猎手, 期权交易, 加密货币, 现金流投资, 美股期权, 投资策略, 金融博客',
  url: 'https://www.silentxx.com/',
};

// 注意：此列表作为默认的随机图片列表使用
// 对于特定分类的文章，系统会根据分类路径从对应的图片目录获取随机图片
// 图片获取优先级：子目录 -> 一级目录 -> articles目录
// 一级目录的图片正在更新中，以确保与各主题的相关性并避免与其他目录重复
// 请参见 src/lib/cover.ts 中的 getDefaultCoversForPath 和 getRandomCoverForPath 函数
export const defaultCoverList = [
  '/img/articles/1.webp',
  '/img/articles/2.webp',
  '/img/articles/3.webp',
  '/img/articles/4.webp',
  '/img/articles/5.webp',
  '/img/articles/6.webp',
  '/img/articles/7.webp',
  '/img/articles/8.webp',
  '/img/articles/9.webp',
  '/img/articles/10.webp',
  '/img/articles/11.webp',
];
