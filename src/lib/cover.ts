import { defaultCoverList } from '@constants/site-config';
import type { CoverImageMap } from '@/types/cover';

// 定义分类到图片目录的映射
const categoryImageMap: CoverImageMap = {
  'options/course': 'options',
  'options/strategy': 'options',
  'options/trading-journal': 'options',
  'crypto/grid': 'crypto',
  'crypto/futures': 'crypto',
  'crypto/crypto-wiki': 'crypto',
  'cashflow-utopia/option-selling': 'cashflow-utopia/option-selling',
  'cashflow-utopia/drip': 'cashflow-utopia/drip',
  'cashflow-utopia/asset-allocation': 'cashflow-utopia/asset-allocation',
  'new-world-explore/ai': 'new-world-explore/ai',
  'new-world-explore/crypto-news': 'crypto', // crypto-news 直接使用 crypto 目录的图片
  'new-world-explore/quantum-universe': 'new-world-explore/quantum-universe',
  // 可以根据需要添加更多分类映射
};

// 为新世界探索的子分类定义默认图片列表
// 这些列表将在对应目录中添加图片后被替换
const newWorldExploreDefaults = {
  ai: [
    '/img/new-world-explore/ai/1.webp',
    '/img/new-world-explore/ai/2.webp',
    '/img/new-world-explore/ai/3.webp',
    '/img/new-world-explore/ai/4.webp',
    '/img/new-world-explore/ai/5.webp',
    '/img/new-world-explore/ai/6.webp',
    '/img/new-world-explore/ai/7.webp',
  ],
  'quantum-universe': [
    '/img/new-world-explore/quantum-universe/1.webp',
    '/img/new-world-explore/quantum-universe/2.webp',
    '/img/new-world-explore/quantum-universe/3.webp',
    '/img/new-world-explore/quantum-universe/4.webp',
    '/img/new-world-explore/quantum-universe/5.webp',
  ],
};

// 根据分类路径获取该分类下的图片列表
export function getDefaultCoversForPath(path: string): string[] {
  // 移除可能的前缀（如/categories/）
  const cleanPath = path.replace(/^\/?categories\//, '');

  // 查找匹配的分类映射
  const imageDir = categoryImageMap[cleanPath];

  if (imageDir) {
    // 根据分类返回对应的图片列表
    switch (imageDir) {
      case 'options':
        return [
          '/img/options/1.webp',
          '/img/options/2.webp',
          '/img/options/3.webp',
          '/img/options/4.webp',
          '/img/options/5.webp',
          '/img/options/6.webp',
          '/img/options/7.webp',
          '/img/options/8.webp',
          '/img/options/9.webp',
          '/img/options/10.webp',
        ];
      case 'crypto':
        return [
          '/img/crypto/1.webp',
          '/img/crypto/2.webp',
          '/img/crypto/3.webp',
          '/img/crypto/4.webp',
          '/img/crypto/5.webp',
          '/img/crypto/6.webp',
          '/img/crypto/7.webp',
          '/img/crypto/8.webp',
          '/img/crypto/9.webp',
          '/img/crypto/10.webp',
          '/img/crypto/11.webp',
          '/img/crypto/12.webp',
          '/img/crypto/13.webp',
          '/img/crypto/14.webp',
          '/img/crypto/15.webp',
        ];
      case 'stock':
        return [
          '/img/stock/1.webp',
          '/img/stock/2.webp',
          '/img/stock/3.webp',
          '/img/stock/4.webp',
          '/img/stock/5.webp',
          '/img/stock/6.webp',
          '/img/stock/7.webp',
          '/img/stock/8.webp',
          '/img/stock/9.webp',
          '/img/stock/10.jpg',
          '/img/stock/11.webp',
        ];
      case 'cashflow-utopia/option-selling':
        return ['/img/cashflow-utopia/option-selling/1.webp'];
      case 'cashflow-utopia/drip':
        return ['/img/cashflow-utopia/drip/1.webp'];
      case 'cashflow-utopia/asset-allocation':
        return ['/img/cashflow-utopia/asset-allocation/1.webp'];
      case 'new-world-explore/ai':
        // 为AI分类返回特定图片列表
        return newWorldExploreDefaults['ai'];
      case 'new-world-explore/quantum-universe':
        // 为量子宇宙分类返回特定图片列表
        return newWorldExploreDefaults['quantum-universe'];
      default:
        // 如果找不到特定分类的图片，返回默认图片列表
        return defaultCoverList;
    }
  }

  // 如果没有匹配的分类，返回默认图片列表
  return defaultCoverList;
}

// 根据分类路径获取随机图片
export function getRandomCoverForPath(path: string): string {
  const covers = getDefaultCoversForPath(path);
  const randomIndex = Math.floor(Math.random() * covers.length);
  return covers[randomIndex];
}
