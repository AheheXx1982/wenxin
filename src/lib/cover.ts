import { defaultCoverList } from '@constants/site-config';
import type { CoverImageMap } from '../types/cover';

// 定义分类到图片目录的映射
const categoryImageMap: CoverImageMap = {
  'options/course': 'options',
  'options/strategy': 'options/strategy',
  'options/trading-journal': 'options/trading-journal',
  'crypto/grid': 'crypto/grid',
  'crypto/futures': 'crypto/futures',
  'crypto/crypto-wiki': 'crypto/crypto-wiki',
  'cashflow-utopia/option-selling': 'cashflow-utopia/option-selling',
  'cashflow-utopia/drip': 'cashflow-utopia/drip',
  'cashflow-utopia/asset-allocation': 'cashflow-utopia/asset-allocation',
  'new-world-explore': 'new-world-explore',
  'new-world-explore/ai': 'new-world-explore/ai',
  'new-world-explore/crypto-news': 'crypto', // crypto-news 直接使用 crypto 目录的图片
  'new-world-explore/quantum-universe': 'new-world-explore/quantum-universe',
  // 添加缺失的分类映射
  'cashflow-utopia': 'cashflow-utopia',
  options: 'options',
  // 添加单级分类映射
  strategy: 'options/strategy',
  'asset-allocation': 'cashflow-utopia/asset-allocation',
  'option-selling': 'cashflow-utopia/option-selling',
  drip: 'cashflow-utopia/drip',
  futures: 'crypto/futures',
  'crypto-wiki': 'crypto/crypto-wiki',
  grid: 'crypto/grid',
  // 可以根据需要添加更多分类映射
};

// 为新世界探索的子分类定义默认图片列表
// 这些列表将在对应目录中添加图片后被替换
const newWorldExploreDefaults = {
  'new-world-explore': [
    '/img/new-world-explore/1.webp',
    '/img/new-world-explore/2.webp',
    '/img/new-world-explore/3.webp',
    '/img/new-world-explore/4.webp',
    '/img/new-world-explore/5.webp',
  ],
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

  // 特殊处理：将中文分类名转换为英文路径
  const pathMapping: Record<string, string> = {
    新世界探索: 'new-world-explore',
    量子宇宙: 'quantum-universe',
    智能进化: 'ai',
    加密风向标: 'crypto-news',
    加密实验室: 'crypto',
    加密百科: 'crypto-wiki',
    现金流乌托邦: 'cashflow-utopia',
    全球高息股轮动: 'drip',
    期权卖方策略: 'option-selling',
    资产配置: 'asset-allocation',
    合约交易: 'futures',
    策略分析: 'strategy',
    // 添加缺失的一级分类映射
    期权研究院: 'options',
  };

  // 如果路径包含中文分类名，进行转换
  let mappedPath = cleanPath;
  Object.keys(pathMapping).forEach((chinese) => {
    mappedPath = mappedPath.replace(chinese, pathMapping[chinese]);
  });

  // 查找匹配的分类映射
  const imageDir = categoryImageMap[mappedPath];

  // 调试信息
  console.log(`Path: ${path}, Clean path: ${cleanPath}, Mapped path: ${mappedPath}, Image dir: ${imageDir}`);

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
      case 'options/strategy':
        return ['/img/options/strategy/1.webp', '/img/options/strategy/2.webp', '/img/options/strategy/3.webp'];
      case 'options/trading-journal':
        return ['/img/options/trading-journal/1.webp'];
      case 'crypto/grid':
        return ['/img/crypto/grid/1.webp', '/img/crypto/grid/2.webp'];
      case 'crypto/futures':
        return ['/img/crypto/futures/1.webp', '/img/crypto/futures/2.webp'];
      case 'crypto/crypto-wiki':
        return ['/img/crypto/crypto-wiki/1.webp', '/img/crypto/crypto-wiki/2.webp', '/img/crypto/crypto-wiki/3.webp'];
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
        return ['/img/cashflow-utopia/option-selling/1.webp', '/img/cashflow-utopia/option-selling/2.webp'];
      case 'cashflow-utopia/drip':
        return ['/img/cashflow-utopia/drip/1.webp', '/img/cashflow-utopia/drip/2.webp'];
      case 'cashflow-utopia/asset-allocation':
        return ['/img/cashflow-utopia/asset-allocation/1.webp', '/img/cashflow-utopia/asset-allocation/2.webp'];
      case 'cashflow-utopia':
        // 为现金流乌托邦一级分类返回特定图片列表
        return ['/img/cashflow-utopia/1.webp', '/img/cashflow-utopia/2.webp'];
      case 'new-world-explore':
        // 为新世界探索一级分类返回特定图片列表
        return newWorldExploreDefaults['new-world-explore'];
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
  const cover = covers[randomIndex];

  // 调试信息
  // console.log(`Random cover for path "${path}": ${cover}`);

  return cover;
}
