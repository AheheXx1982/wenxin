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
  'crypto/crypto-news': 'crypto/crypto-news', // 加密风向标使用独立的图片目录
  'cashflow-utopia/drip': 'cashflow-utopia/drip',
  'cashflow-utopia/asset-allocation': 'cashflow-utopia/asset-allocation',
  'cashflow-utopia/option-selling': 'options/option-selling', // 添加现金流乌托邦/期权卖方策略的映射
  'new-world-explore/ai': 'new-world-explore/ai',
  'new-world-explore/quantum-universe': 'new-world-explore/quantum-universe',

  // 添加一级分类映射
  'cashflow-utopia': 'cashflow-utopia',
  'new-world-explore': 'new-world-explore',
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
  'crypto-news': 'crypto/crypto-news', // 加密风向标使用独立的图片目录
  grid: 'crypto/grid',
  网格策略: 'crypto/grid', // 添加网格策略的直接映射
  course: 'options/course',
  'trading-journal': 'options/trading-journal',
  实盘分享: 'options/trading-journal', // 添加实盘分享的直接映射
  ai: 'new-world-explore/ai',
  // 添加合约交易分类映射
  合约交易: 'crypto/futures',
  // 添加加密风向标直接映射
  加密风向标: 'crypto/crypto-news',
  // 可以根据需要添加更多分类映射
};

// 根据分类路径获取该分类下的图片列表，按照新的优先级顺序：子目录 -> articles目录（仅无分类文章）
export function getDefaultCoversForPath(path: string): string[] {
  // 移除可能的前缀（如/categories/）
  const cleanPath = path.replace(/^\/?categories\//, '');

  // 特殊处理：将中文分类名转换为英文路径
  const pathMapping: Record<string, string> = {
    新世界探索: 'new-world-explore',
    量子宇宙: 'quantum-universe',
    智能进化: 'ai',
    加密风向标: 'crypto-news', // 更新加密风向标的映射
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

  // 特殊处理：如果分类是数组格式 ['新世界探索', '加密风向标']，提取具体的子分类
  if (mappedPath.includes('新世界探索') && mappedPath.includes('加密风向标')) {
    mappedPath = 'crypto-news'; // 直接映射到crypto-news
    console.log('检测到加密风向标分类，转换为:', mappedPath);
  }

  // 特殊处理：直接处理加密风向标分类
  if (mappedPath === '加密风向标') {
    mappedPath = 'crypto-news';
    console.log('加密风向标直接映射为:', mappedPath);
  }

  // 特殊处理：处理加密风向标分类
  if (mappedPath === 'crypto-news') {
    console.log('加密风向标最终映射为:', mappedPath);
  } else if (mappedPath.includes('crypto-news') && mappedPath !== 'crypto-news') {
    mappedPath = 'crypto-news';
    console.log('加密风向标包含crypto-news，重新映射为:', mappedPath);
  } else {
    console.log('映射后的路径不是crypto-news:', mappedPath);
  }

  // 特殊处理：确保加密风向标正确映射
  if (mappedPath.includes('加密风向标') || mappedPath.includes('crypto-news')) {
    mappedPath = 'crypto-news';
    console.log('确保加密风向标映射为:', mappedPath);
  }

  // 特殊处理：处理新世界探索/加密风向标路径
  if (mappedPath === 'new-world-explore/加密风向标') {
    mappedPath = 'crypto-news';
    console.log('处理新世界探索/加密风向标路径，映射为:', mappedPath);
  }

  // 特殊处理：处理new-world-explore/crypto-news路径
  if (mappedPath === 'new-world-explore/crypto-news') {
    mappedPath = 'crypto-news';
    console.log('处理new-world-explore/crypto-news路径，映射为:', mappedPath);
  }

  // 特殊处理：处理包含加密风向标的路径
  if (mappedPath.includes('加密风向标')) {
    mappedPath = 'crypto-news';
    console.log('处理包含加密风向标的路径，映射为:', mappedPath);
  }

  // 特殊处理：处理包含new-world-explore和crypto-news的路径
  if (mappedPath.includes('new-world-explore') && mappedPath.includes('crypto-news')) {
    mappedPath = 'crypto-news';
    console.log('处理包含new-world-explore和crypto-news的路径，映射为:', mappedPath);
  }

  // 特殊处理：处理包含new-world-explor和crypto-news的路径（处理可能的拼写错误）
  if (mappedPath.includes('new-world-explor') && mappedPath.includes('crypto-news')) {
    mappedPath = 'crypto-news';
    console.log('处理包含new-world-explor和crypto-news的路径，映射为:', mappedPath);
  }

  // 特殊处理：处理包含new-world和crypto-news的路径
  if (mappedPath.includes('new-world') && mappedPath.includes('crypto-news')) {
    mappedPath = 'crypto-news';
    console.log('处理包含new-world和crypto-news的路径，映射为:', mappedPath);
  }

  // 特殊处理：处理包含explor和crypto-news的路径
  if (mappedPath.includes('explor') && mappedPath.includes('crypto-news')) {
    mappedPath = 'crypto-news';
    console.log('处理包含explor和crypto-news的路径，映射为:', mappedPath);
  }

  // 特殊处理：处理包含world和crypto-news的路径
  if (mappedPath.includes('world') && mappedPath.includes('crypto-news')) {
    mappedPath = 'crypto-news';
    console.log('处理包含world和crypto-news的路径，映射为:', mappedPath);
  }

  // 特殊处理：处理包含crypto和news的路径
  if (mappedPath.includes('crypto') && mappedPath.includes('news') && !mappedPath.includes('crypto-news')) {
    mappedPath = 'crypto-news';
    console.log('处理包含crypto和news的路径，映射为:', mappedPath);
  }

  // 特殊处理：处理包含crypt和news的路径
  if (mappedPath.includes('crypt') && mappedPath.includes('news')) {
    mappedPath = 'crypto-news';
    console.log('处理包含crypt和news的路径，映射为:', mappedPath);
  }

  // 调试信息
  console.log(`Processing path: ${path}`);
  console.log(`Clean path: ${cleanPath}`);
  console.log(`Mapped path: ${mappedPath}`);
  console.log(`Category image map keys:`, Object.keys(categoryImageMap));

  // 对于文章列表，只从子目录获取图片
  const subDirImageDir = categoryImageMap[mappedPath];
  console.log(`Subdir image dir: ${subDirImageDir}`);
  if (subDirImageDir) {
    const subDirImages = getImagesForDirectory(subDirImageDir);
    console.log(`Subdir images: ${subDirImages.length}`);
    console.log(`Subdir images content:`, subDirImages);
    if (subDirImages.length > 0) {
      // 去除重复项，保持顺序
      const uniqueImages = [...new Set(subDirImages)];
      console.log(`Final images: ${uniqueImages.length}`);
      console.log(`Returning images:`, uniqueImages);
      return uniqueImages;
    } else {
      console.log(`No images found in directory: ${subDirImageDir}`);
    }
  } else {
    console.log(`No mapping found for path: ${mappedPath}`);
  }

  // 如果没有找到子目录图片，则回退到默认图片列表（用于无分类文章）
  console.log(`Default images: ${defaultCoverList.length}`);
  // 去除重复项，保持顺序
  const uniqueImages = [...new Set(defaultCoverList)];
  console.log(`Final images: ${uniqueImages.length}`);
  console.log(`Returning default images:`, uniqueImages);
  return uniqueImages;
}

// 为精选分类获取图片列表，按照优先级顺序：子目录 -> 一级目录 -> articles目录
export function getFeaturedCoversForPath(path: string): string[] {
  // 移除可能的前缀（如/categories/）
  const cleanPath = path.replace(/^\/?categories\//, '');

  // 特殊处理：将中文分类名转换为英文路径
  const pathMapping: Record<string, string> = {
    新世界探索: 'new-world-explore',
    量子宇宙: 'quantum-universe',
    智能进化: 'ai',
    加密风向标: 'crypto-news', // 更新加密风向标的映射
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
  console.log(`Subdir image dir: ${subDirImageDir}`);
  if (subDirImageDir) {
    const subDirImages = getImagesForDirectory(subDirImageDir);
    console.log(`Subdir images: ${subDirImages.length}`);
    if (subDirImages.length > 0) {
      imageLists.push(subDirImages);
    }
  }

  // 2. 然后尝试获取一级目录的图片
  // 提取一级目录路径
  const firstLevelPath = mappedPath.split('/')[0];
  const firstLevelImageDir = categoryImageMap[firstLevelPath];
  console.log(`First level path: ${firstLevelPath}`);
  console.log(`First level image dir: ${firstLevelImageDir}`);
  if (firstLevelImageDir && firstLevelImageDir !== subDirImageDir) {
    const firstLevelImages = getImagesForDirectory(firstLevelImageDir);
    console.log(`First level images: ${firstLevelImages.length}`);
    if (firstLevelImages.length > 0) {
      imageLists.push(firstLevelImages);
    }
  }

  // 3. 最后回退到默认图片列表
  imageLists.push(defaultCoverList);
  console.log(`Default images: ${defaultCoverList.length}`);

  // 合并所有图片列表，保持优先级顺序
  const allImages: string[] = [];
  imageLists.forEach((list) => {
    allImages.push(...list);
  });

  // 去除重复项，保持顺序
  const uniqueImages = [...new Set(allImages)];
  console.log(`Final images: ${uniqueImages.length}`);
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
    case 'crypto/crypto-news':
      return [
        '/img/crypto/crypto-news/1.webp',
        '/img/crypto/crypto-news/2.webp',
        '/img/crypto/crypto-news/3.webp',
        '/img/crypto/crypto-news/4.webp',
        '/img/crypto/crypto-news/5.webp',
        '/img/crypto/crypto-news/6.webp',
        '/img/crypto/crypto-news/7.webp',
        '/img/crypto/crypto-news/8.webp',
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
    case 'new-world-explore/ai':
      return [
        '/img/new-world-explore/ai/1.webp',
        '/img/new-world-explore/ai/2.webp',
        '/img/new-world-explore/ai/3.webp',
        '/img/new-world-explore/ai/4.webp',
        '/img/new-world-explore/ai/5.webp',
        '/img/new-world-explore/ai/6.webp',
        '/img/new-world-explore/ai/7.webp',
      ];
    case 'new-world-explore/quantum-universe':
      return [
        '/img/new-world-explore/quantum-universe/1.webp',
        '/img/new-world-explore/quantum-universe/2.webp',
        '/img/new-world-explore/quantum-universe/3.webp',
        '/img/new-world-explore/quantum-universe/4.webp',
        '/img/new-world-explore/quantum-universe/5.webp',
      ];

    case 'cashflow-utopia':
      return [
        '/img/cashflow-utopia/1.webp',
        '/img/cashflow-utopia/2.webp',
        '/img/cashflow-utopia/3.webp',
        '/img/cashflow-utopia/4.webp',
      ];
    case 'new-world-explore':
      return ['/img/new-world-explore/1.webp', '/img/new-world-explore/2.webp'];
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

  // 调试信息
  // console.log(`Random cover for path "${path}": ${cover}`);

  return cover;
}

// 根据分类路径获取随机图片（用于精选分类）
export function getRandomFeaturedCoverForPath(path: string): string {
  const covers = getFeaturedCoversForPath(path);
  const randomIndex = Math.floor(Math.random() * covers.length);
  const cover = covers[randomIndex];

  // 调试信息
  // console.log(`Random featured cover for path "${path}": ${cover}`);

  return cover;
}
