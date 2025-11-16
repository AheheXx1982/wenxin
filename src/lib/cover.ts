import { defaultCoverList } from '@constants/site-config';
import type { CoverImageMap } from '../types/cover';

// 定义分类到图片目录的映射
const categoryImageMap: CoverImageMap = {
  'options/course': 'options/course',
  'options/strategy': 'options/strategy',
  'options/trading-journal': 'options/trading-journal',
  'options/option-selling': 'options/option-selling', // 期权卖方策略现在在options目录下
  'crypto/grid': 'crypto/grid',
  'crypto/futures': 'crypto/futures',
  'crypto/crypto-wiki': 'crypto/crypto-wiki',
  'cashflow-utopia/drip': 'cashflow-utopia/drip',
  'cashflow-utopia/asset-allocation': 'cashflow-utopia/asset-allocation',
  'cashflow-utopia/option-selling': 'options/option-selling', // 添加现金流乌托邦/期权卖方策略的映射

  // 添加一级分类映射
  'cashflow-utopia': 'cashflow-utopia',
  options: 'options',
  crypto: 'crypto',
  // 添加单级分类映射
  strategy: 'options/strategy',
  'asset-allocation': 'cashflow-utopia/asset-allocation',
  'option-selling': 'options/option-selling', // 期权卖方策略现在在options目录下
  期权卖方策略: 'options/option-selling', // 添加期权卖方策略的直接映射
  drip: 'cashflow-utopia/drip',
  futures: 'crypto/futures',
  'crypto-wiki': 'crypto/crypto-wiki',
  grid: 'crypto/grid',
  网格策略: 'crypto/grid', // 添加网格策略的直接映射
  course: 'options/course',
  'trading-journal': 'options/trading-journal',
  实盘分享: 'options/trading-journal', // 添加实盘分享的直接映射
  // 添加合约交易分类映射
  合约交易: 'crypto/futures',
  // 可以根据需要添加更多分类映射
};

// 根据分类路径获取该分类下的图片列表，按照新的优先级顺序：子目录 -> articles目录（仅无分类文章）
export function getDefaultCoversForPath(path: string): string[] {
  // 移除可能的前缀（如/categories/）
  const cleanPath = path.replace(/^\/?categories\//, '');

  // 特殊处理：将中文分类名转换为英文路径
  const pathMapping: Record<string, string> = {
    加密实验室: 'crypto',
    加密百科: 'crypto-wiki',
    现金流乌托邦: 'cashflow-utopia',
    全球高息股轮动: 'drip',
    期权卖方策略: 'option-selling',
    资产配置: 'asset-allocation',
    合约交易: 'futures',
    策略分析: 'strategy',
    期权课程: 'course',
    交易日志: 'trading-journal',
    网格交易: 'grid',
    网格策略: 'grid', // 添加网格策略映射
    实盘分享: 'trading-journal', // 添加实盘分享映射
    // 添加缺失的一级分类映射
    期权研究院: 'options',
  };

  // 如果路径包含中文分类名，进行转换
  let mappedPath = cleanPath;
  Object.keys(pathMapping).forEach((chinese) => {
    mappedPath = mappedPath.replace(chinese, pathMapping[chinese]);
  });

  // 特殊处理：如果分类是数组格式 ['加密实验室', '合约交易']，提取具体的子分类
  if (mappedPath.includes('加密实验室') && mappedPath.includes('合约交易')) {
    mappedPath = '合约交易';
  }

  // 特殊处理：如果分类是数组格式 ['加密实验室', '网格策略']，提取具体的子分类
  if (mappedPath.includes('加密实验室') && mappedPath.includes('网格策略')) {
    mappedPath = '网格策略';
  }

  // 特殊处理：如果分类是数组格式 ['期权研究院', '实盘分享']，提取具体的子分类
  if (mappedPath.includes('期权研究院') && mappedPath.includes('实盘分享')) {
    mappedPath = '实盘分享';
  }

  // 特殊处理：如果分类是数组格式 ['现金流乌托邦', '期权卖方策略']，提取具体的子分类
  if (mappedPath.includes('现金流乌托邦') && mappedPath.includes('期权卖方策略')) {
    mappedPath = '期权卖方策略';
  }

  // 对于文章列表，只从子目录获取图片
  const subDirImageDir = categoryImageMap[mappedPath];
  if (subDirImageDir) {
    const subDirImages = getImagesForDirectory(subDirImageDir);
    if (subDirImages.length > 0) {
      // 去除重复项，保持顺序
      const uniqueImages = [...new Set(subDirImages)];
      return uniqueImages;
    }
  }

  // 如果没有找到子目录图片，则回退到默认图片列表（用于无分类文章）
  // 去除重复项，保持顺序
  const uniqueImages = [...new Set(defaultCoverList)];
  return uniqueImages;
}

// 为精选分类获取图片列表，按照优先级顺序：子目录 -> 一级目录 -> articles目录
export function getFeaturedCoversForPath(path: string): string[] {
  // 移除可能的前缀（如/categories/）
  const cleanPath = path.replace(/^\/?categories\//, '');

  // 特殊处理：将中文分类名转换为英文路径
  const pathMapping: Record<string, string> = {
    加密实验室: 'crypto',
    加密百科: 'crypto-wiki',
    现金流乌托邦: 'cashflow-utopia',
    全球高息股轮动: 'drip',
    期权卖方策略: 'option-selling',
    资产配置: 'asset-allocation',
    合约交易: 'futures',
    策略分析: 'strategy',
    期权课程: 'course',
    交易日志: 'trading-journal',
    网格交易: 'grid',
    网格策略: 'grid', // 添加网格策略映射
    实盘分享: 'trading-journal', // 添加实盘分享映射
    // 添加缺失的一级分类映射
    期权研究院: 'options',
  };

  // 如果路径包含中文分类名，进行转换
  let mappedPath = cleanPath;
  Object.keys(pathMapping).forEach((chinese) => {
    mappedPath = mappedPath.replace(chinese, pathMapping[chinese]);
  });

  // 特殊处理：如果分类是数组格式 ['加密实验室', '合约交易']，提取具体的子分类
  if (mappedPath.includes('加密实验室') && mappedPath.includes('合约交易')) {
    mappedPath = '合约交易';
  }

  // 特殊处理：如果分类是数组格式 ['加密实验室', '网格策略']，提取具体的子分类
  if (mappedPath.includes('加密实验室') && mappedPath.includes('网格策略')) {
    mappedPath = '网格策略';
  }

  // 特殊处理：如果分类是数组格式 ['期权研究院', '实盘分享']，提取具体的子分类
  if (mappedPath.includes('期权研究院') && mappedPath.includes('实盘分享')) {
    mappedPath = '实盘分享';
  }

  // 特殊处理：如果分类是数组格式 ['现金流乌托邦', '期权卖方策略']，提取具体的子分类
  if (mappedPath.includes('现金流乌托邦') && mappedPath.includes('期权卖方策略')) {
    mappedPath = '期权卖方策略';
  }

  // 获取所有可能的图片列表，按照优先级顺序
  const imageLists: string[][] = [];

  // 1. 首先尝试获取子目录的图片
  const subDirImageDir = categoryImageMap[mappedPath];
  if (subDirImageDir) {
    const subDirImages = getImagesForDirectory(subDirImageDir);
    if (subDirImages.length > 0) {
      imageLists.push(subDirImages);
    }
  }

  // 2. 然后尝试获取一级目录的图片
  // 提取一级目录路径
  const firstLevelPath = mappedPath.split('/')[0];
  const firstLevelImageDir = categoryImageMap[firstLevelPath];
  if (firstLevelImageDir && firstLevelImageDir !== subDirImageDir) {
    const firstLevelImages = getImagesForDirectory(firstLevelImageDir);
    if (firstLevelImages.length > 0) {
      imageLists.push(firstLevelImages);
    }
  }

  // 3. 最后回退到默认图片列表
  imageLists.push(defaultCoverList);

  // 合并所有图片列表，保持优先级顺序
  const allImages: string[] = [];
  imageLists.forEach((list) => {
    allImages.push(...list);
  });

  // 去除重复项，保持顺序
  const uniqueImages = [...new Set(allImages)];
  return uniqueImages;
}

// 根据目录名称获取该目录下的图片列表
function getImagesForDirectory(dir: string): string[] {
  switch (dir) {
    case 'options/course':
      return [
        '/img/options/course/1.webp',
        '/img/options/course/2.webp',
        '/img/options/course/3.webp',
        '/img/options/course/4.webp',
        '/img/options/course/5.webp',
        '/img/options/course/6.webp',
        '/img/options/course/7.webp',
      ];
    case 'options/strategy':
      return [
        '/img/options/strategy/1.webp',
        '/img/options/strategy/2.webp',
        '/img/options/strategy/3.webp',
        '/img/options/strategy/4.webp',
        '/img/options/strategy/5.webp',
        '/img/options/strategy/6.webp',
        '/img/options/strategy/7.webp',
        '/img/options/strategy/8.webp',
        '/img/options/strategy/9.webp',
        '/img/options/strategy/10.webp',
      ];
    case 'options/trading-journal':
      return [
        '/img/options/trading-journal/1.webp',
        '/img/options/trading-journal/2.webp',
        '/img/options/trading-journal/3.webp',
        '/img/options/trading-journal/4.webp',
        '/img/options/trading-journal/5.webp',
        '/img/options/trading-journal/6.webp',
        '/img/options/trading-journal/7.webp',
      ];
    case 'crypto/grid':
      return [
        '/img/crypto/grid/1.webp',
        '/img/crypto/grid/2.webp',
        '/img/crypto/grid/3.webp',
        '/img/crypto/grid/4.webp',
        '/img/crypto/grid/5.webp',
        '/img/crypto/grid/6.webp',
        '/img/crypto/grid/7.webp',
        '/img/crypto/grid/8.webp',
        '/img/crypto/grid/9.webp',
      ];
    case 'crypto/futures':
      return [
        '/img/crypto/futures/1.webp',
        '/img/crypto/futures/2.webp',
        '/img/crypto/futures/3.webp',
        '/img/crypto/futures/4.webp',
        '/img/crypto/futures/5.webp',
        '/img/crypto/futures/6.webp',
        '/img/crypto/futures/7.webp',
        '/img/crypto/futures/8.webp',
      ];
    case 'crypto/crypto-wiki':
      return [
        '/img/crypto/crypto-wiki/1.webp',
        '/img/crypto/crypto-wiki/2.webp',
        '/img/crypto/crypto-wiki/3.webp',
        '/img/crypto/crypto-wiki/4.webp',
        '/img/crypto/crypto-wiki/5.webp',
        '/img/crypto/crypto-wiki/6.webp',
        '/img/crypto/crypto-wiki/7.webp',
        '/img/crypto/crypto-wiki/8.webp',
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
      ];
    case 'options/option-selling':
      return [
        '/img/options/option-selling/1.webp',
        '/img/options/option-selling/2.webp',
        '/img/options/option-selling/3.webp',
        '/img/options/option-selling/4.webp',
        '/img/options/option-selling/5.webp',
        '/img/options/option-selling/6.webp',
        '/img/options/option-selling/7.webp',
        '/img/options/option-selling/8.webp',
      ];
    case 'cashflow-utopia/drip':
      return [
        '/img/cashflow-utopia/drip/1.webp',
        '/img/cashflow-utopia/drip/2.webp',
        '/img/cashflow-utopia/drip/3.webp',
        '/img/cashflow-utopia/drip/4.webp',
        '/img/cashflow-utopia/drip/5.webp',
        '/img/cashflow-utopia/drip/6.webp',
        '/img/cashflow-utopia/drip/7.webp',
        '/img/cashflow-utopia/drip/8.webp',
        '/img/cashflow-utopia/drip/9.webp',
      ];
    case 'cashflow-utopia/asset-allocation':
      return [
        '/img/cashflow-utopia/asset-allocation/1.webp',
        '/img/cashflow-utopia/asset-allocation/2.webp',
        '/img/cashflow-utopia/asset-allocation/3.webp',
        '/img/cashflow-utopia/asset-allocation/4.webp',
        '/img/cashflow-utopia/asset-allocation/5.webp',
        '/img/cashflow-utopia/asset-allocation/6.webp',
        '/img/cashflow-utopia/asset-allocation/7.webp',
      ];
    case 'cashflow-utopia':
      return [
        '/img/cashflow-utopia/1.webp',
        '/img/cashflow-utopia/2.webp',
        '/img/cashflow-utopia/3.webp',
        '/img/cashflow-utopia/4.webp',
      ];
    case 'options':
      return ['/img/options/1.webp', '/img/options/2.webp', '/img/options/3.webp'];
    case 'stock':
    default:
      // 如果找不到特定目录的图片，返回空数组
      return [];
  }
}

// 根据分类路径获取随机图片（用于文章列表）
export function getRandomCoverForPath(path: string): string {
  const covers = getDefaultCoversForPath(path);
  const randomIndex = Math.floor(Math.random() * covers.length);
  const cover = covers[randomIndex];
  return cover;
}

// 根据分类路径获取随机图片（用于精选分类）
export function getRandomFeaturedCoverForPath(path: string): string {
  const covers = getFeaturedCoversForPath(path);
  const randomIndex = Math.floor(Math.random() * covers.length);
  const cover = covers[randomIndex];
  return cover;
}

// 根据分类路径和文章slug获取固定图片（避免刷新时图片变化）
export function getFixedCoverForPath(path: string, slug: string): string {
  const covers = getDefaultCoversForPath(path);
  
  // 基于slug生成一个固定的索引
  let hash = 0;
  const slugStr = typeof slug === 'string' ? slug : String(slug);
  for (let i = 0; i < slugStr.length; i++) {
    const char = slugStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  
  // 确保索引为非负数
  const fixedIndex = Math.abs(hash) % covers.length;
  const cover = covers[fixedIndex];
  return cover;
}