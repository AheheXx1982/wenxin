import { defaultCoverList } from '@constants/site-config';
import type { CoverImageMap } from '../types/cover';

// 定义分类到图片目录的映射（问心剑：按摩大叔 / 何处觅知音 / 南洋往事）
const categoryImageMap: CoverImageMap = {
  massage: 'massage',
  friendship: 'friendship',
  singapore: 'singapore',
};

// 根据分类路径获取该分类下的图片列表
export function getDefaultCoversForPath(path: string): string[] {
  // 移除可能的前缀（如/categories/）
  const cleanPath = path.replace(/^\/?categories\//, '');

  // 中文分类名 -> 英文路径
  const pathMapping: Record<string, string> = {
    按摩大叔: 'massage',
    何处觅知音: 'friendship',
    南洋往事: 'singapore',
    'Massage Stories': 'massage',
    Friendship: 'friendship',
    'Singapore Stories': 'singapore',
  };

  // 如果路径包含中文分类名，进行转换
  let mappedPath = cleanPath;
  Object.keys(pathMapping).forEach((chinese) => {
    mappedPath = mappedPath.replace(chinese, pathMapping[chinese]);
  });

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

  // 中文分类名 -> 英文路径
  const pathMapping: Record<string, string> = {
    按摩大叔: 'massage',
    何处觅知音: 'friendship',
    南洋往事: 'singapore',
    'Massage Stories': 'massage',
    Friendship: 'friendship',
    'Singapore Stories': 'singapore',
  };

  // 如果路径包含中文分类名，进行转换
  let mappedPath = cleanPath;
  Object.keys(pathMapping).forEach((chinese) => {
    mappedPath = mappedPath.replace(chinese, pathMapping[chinese]);
  });

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

  // 2. 最后回退到默认图片列表
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
    case 'massage':
      return ['/img/massage/1.webp', '/img/massage/2.webp', '/img/massage/3.webp'];
    case 'friendship':
      return ['/img/friendship/1.webp', '/img/friendship/2.webp', '/img/friendship/3.webp'];
    case 'singapore':
      return ['/img/singapore/1.webp', '/img/singapore/2.webp', '/img/singapore/3.webp'];
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
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 转换为32位整数
  }

  // 确保索引为非负数
  const fixedIndex = Math.abs(hash) % covers.length;
  const cover = covers[fixedIndex];
  return cover;
}
