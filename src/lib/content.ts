import { categoryMap } from '@constants/category';
import { getCollection, type CollectionEntry } from 'astro:content';
import { getRandomCoverForPath } from '@lib/cover';
import type { Language } from '@constants/i18n';

import type { BlogPost } from 'types/blog';

export async function getSortedPosts(lang?: Language, excludeIntro: boolean = false): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog');

  // 确保始终返回数组，即使没有文章
  if (!posts || !Array.isArray(posts)) {
    return [];
  }

  // 根据语言筛选文章
  const filteredPosts = lang
    ? posts.filter((post) => {
        const postLang = post.data.lang || 'zh';
        return postLang === lang;
      })
    : posts.filter((post) => {
        const postLang = post.data.lang || 'zh';
        return postLang === 'zh'; // 默认显示中文文章
      });

  // 排除介绍文章（如果需要）
  const finalPosts = excludeIntro 
    ? filteredPosts.filter((post) => {
        const isIntroArticle = post.slug.endsWith('/index') || post.slug.includes('/index');
        return !isIntroArticle;
      })
    : filteredPosts;

  // 按日期排序
  const sortedPosts = finalPosts.sort((a: BlogPost, b: BlogPost) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });

  return sortedPosts;
}

// 新增函数：从所有文章中随机获取指定数量的文章
export async function getRandomPosts(count: number, lang?: Language): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getSortedPosts(lang, true);

  // Fisher-Yates 洗牌算法随机打乱文章顺序
  const shuffled = [...posts];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 返回指定数量的文章
  return shuffled.slice(0, count);
}

// 新增函数：获取每个分类下的最新文章
export async function getLatestPostsByCategory(lang?: Language): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getSortedPosts(lang, true);

  // 按分类分组文章
  const categoryMap: Record<string, CollectionEntry<'blog'>[]> = {};

  posts.forEach((post) => {
    const { categories } = post.data;
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      // 无分类文章归为默认分类
      const key = 'uncategorized';
      if (!categoryMap[key]) categoryMap[key] = [];
      categoryMap[key].push(post);
      return;
    }

    // 处理嵌套分类格式，如 ['现金流乌托邦', '期权卖方策略']
    let categoryKey: string;
    if (Array.isArray(categories[0])) {
      categoryKey = categories[0].join('/');
    } else {
      // 处理单级分类格式
      categoryKey = categories[0] as string;
    }

    if (!categoryMap[categoryKey]) categoryMap[categoryKey] = [];
    categoryMap[categoryKey].push(post);
  });

  // 从每个分类中选取最新的文章
  const latestPosts: CollectionEntry<'blog'>[] = [];
  Object.values(categoryMap).forEach((categoryPosts) => {
    if (categoryPosts.length > 0) {
      // 取该分类下最新的文章
      latestPosts.push(categoryPosts[0]);
    }
  });

  // 按日期排序，确保最新的文章在前面
  return latestPosts.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });
}

// 新增函数：从每个分类的最新文章中随机选择指定数量的文章
export async function getRandomLatestPosts(count: number, lang?: Language): Promise<CollectionEntry<'blog'>[]> {
  const latestPosts = await getLatestPostsByCategory(lang);

  // Fisher-Yates 洗牌算法随机打乱文章顺序
  const shuffled = [...latestPosts];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 返回指定数量的文章
  return shuffled.slice(0, count);
}

// 为文章获取对应分类的随机封面图片
export function getPostCoverImage(post: BlogPost): string {
  const { categories, cover } = post.data;

  // 优先使用文章 frontmatter 中指定的 cover 图片
  if (cover) {
    return cover;
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    // 处理嵌套分类格式
    if (Array.isArray(categories[0])) {
      // 例如: ['新世界探索', '智能进化']
      const categoryPath = categories[0].join('/');
      const path = `/categories/${categoryPath}`;
      console.log(`获取嵌套分类图片: ${path}`);
      console.log(`分类详情:`, categories[0]);

      // 特殊处理加密风向标分类
      if (categoryPath === '新世界探索/加密风向标') {
        console.log('特殊处理加密风向标分类');
        const result = getRandomCoverForPath('/categories/crypto-news');
        console.log(`获取到的图片: ${result}`);
        return result;
      }

      const result = getRandomCoverForPath(path);
      console.log(`获取到的图片: ${result}`);
      return result;
    } else {
      // 处理单级分类格式
      // 例如: '期权研究院'
      const path = `/categories/${categories[0]}`;
      console.log(`获取单级分类图片: ${path}`);
      const result = getRandomCoverForPath(path);
      console.log(`获取到的图片: ${result}`);
      return result;
    }
  }

  // 如果没有分类信息，返回默认图片
  console.log('没有分类信息，返回默认图片');
  return '/img/banner.webp';
}

export const getAllTags = (posts: BlogPost[]) => {
  return posts.reduce<Record<string, number>>((acc, post) => {
    const postTags = post.data.tags || [];
    postTags.forEach((tag: string) => {
      if (!acc[tag]) {
        acc[tag] = 0;
      }
      acc[tag]++;
    });
    return acc;
  }, {});
};

export const getPostCount = async () => {
  const posts = await getSortedPosts(undefined, true);
  return posts && Array.isArray(posts) ? posts.length : 0;
};

export type Category = {
  name: string;
  children?: Category[];
};

export async function getCategoryList(lang?: Language): Promise<{ categories: Category[]; countMap: { [key: string]: number } }> {
  // 获取指定语言的文章，默认为中文
  const allBlogPosts = await getSortedPosts(lang, false);

  // 确保始终有数组进行处理
  if (!allBlogPosts || !Array.isArray(allBlogPosts)) {
    return { categories: [], countMap: {} };
  }

  const countMap: { [key: string]: number } = {};
  const resCategories: Category[] = [];

  // 统计每个分类的文章数量，排除介绍文章
  for (let i = 0; i < allBlogPosts.length; ++i) {
    const post = allBlogPosts[i];
    const { catalog, categories } = post.data;
    if (!catalog || !categories?.length) {
      continue;
    }

    // 排除介绍文章（通常是index.md文件）
    // 判断逻辑：如果slug的最后一部分与分类的最后一部分相同，则为介绍文章
    let isIntroArticle = false;
    if (Array.isArray(categories[0]) && categories[0].length > 0) {
      // 对于嵌套分类，检查slug的最后一部分是否与分类的最后一部分相同
      const deepestCategory = categories[0][categories[0].length - 1];
      const slugParts = post.slug.split('/');
      const lastSlugPart = slugParts[slugParts.length - 1];
      
      // 如果slug的最后一部分与分类名称相同，则为介绍文章
      isIntroArticle = lastSlugPart === deepestCategory;
    } else if (typeof categories[0] === 'string') {
      // 对于简单分类，检查slug的最后一部分是否与分类名称相同
      const slugParts = post.slug.split('/');
      const lastSlugPart = slugParts[slugParts.length - 1];
      isIntroArticle = lastSlugPart === categories[0];
    }

    if (Array.isArray(categories[0]) && categories[0].length) {
      // 对于嵌套分类，只统计最深层的分类
      // categories[0] = ['期权研究院', '实盘分享'] 只统计 '实盘分享'
      const deepestCategory = categories[0][categories[0].length - 1];
      
      // 只有非介绍文章才计入统计
      if (!isIntroArticle) {
        countMap[deepestCategory] = (countMap[deepestCategory] || 0) + 1;
      }
      
      // 为所有层级的分类创建结构
      for (let j = 0; j < categories[0].length; ++j) {
        const name = categories[0][j];
        
        if (j === 0) {
          addCategoryRecursively(resCategories, [], name);
        } else {
          const parentNames = categories[0].slice(0, j);
          addCategoryRecursively(resCategories, parentNames, name);
        }
      }
    } else {
      // categories[0] = '工具'
      const name = categories[0] as string;
      
      // 只有非介绍文章才计入统计
      if (!isIntroArticle) {
        countMap[name] = (countMap[name] || 0) + 1;
      }
      
      addCategoryRecursively(resCategories, [], name);
    }
  }

  // 根据 categoryMap 中的顺序对 resCategories 进行排序
  const orderedCategoryNames = Object.keys(categoryMap);
  resCategories.sort((a, b) => {
    const indexA = orderedCategoryNames.indexOf(a.name);
    const indexB = orderedCategoryNames.indexOf(b.name);
    if (indexA === -1) return 1; // a 不在映射中，排在后面
    if (indexB === -1) return -1; // b 不在映射中，排在前面
    return indexA - indexB;
  });

  return { categories: resCategories, countMap };
}

/**
 * 递归添加子分类 有副作用的函数 如 ['分类1', '分类2', '分类3'] 创建一级分类 '分类1'、二级分类 '分类2'、三级分类 '分类3'
 * @param rootCategories 根分类
 * @param parentNames 父分类名 ['分类1', '分类2']
 * @param name 子分类名 '分类3'
 * @returns
 */
export function addCategoryRecursively(rootCategories: Category[], parentNames: string[], name: string) {
  if (parentNames.length === 0) {
    const index = rootCategories.findIndex((c) => c.name === name); // 如果当前分类已存在，则直接返回
    if (index === -1) rootCategories.push({ name });
    return;
  } else {
    const rootParentName = parentNames[0];
    const index = rootCategories.findIndex((c) => c.name === rootParentName);
    if (index === -1) {
      // 如果父级分类不存在，则创建
      const rootParentCategory = { name: rootParentName, children: [] };
      rootCategories.push(rootParentCategory);
      addCategoryRecursively(rootParentCategory.children, parentNames.slice(1), name);
    } else {
      // 如果父级分类存在,找到这个分类
      const rootParentCategory = rootCategories[index];
      if (!rootParentCategory?.children) rootParentCategory.children = [];
      addCategoryRecursively(rootParentCategory.children, parentNames.slice(1), name);
    }
  }
}

// 统一 ['分类1', '分类2'] 和 '分类'
export function getCategoryArr(categories?: string[] | string) {
  if (!categories) return [];
  if (Array.isArray(categories) && categories.length) {
    return categories as string[];
  } else return [categories as string];
}

/**
 * 获取分类完整链接
 * @param categories 分类
 * @param parentLink 父分类链接
 * @returns 分类链接
 */
export function getCategoryLinks(categories?: Category[], parentLink?: string): string[] {
  if (!categories?.length) return [];
  // console.log('parentLink:', parentLink + ' categories:', categories.length);
  const res: string[] = [];
  categories.forEach((category: Category) => {
    const link = categoryMap[category.name];
    // 添加检查确保 link 不是 undefined
    if (!link) {
      console.warn(`警告: 分类 "${category.name}" 没有在 _config.yml 中定义映射`);
      return;
    }
    const fullLink = parentLink ? `${parentLink}/${link}` : link;
    res.push(fullLink);
    if (category?.children?.length) {
      const children = getCategoryLinks(category?.children, fullLink);
      res.push(...children);
    }
  });
  return res;
}

// categories/xxx/front-end
// return 前端
// get category name by link
export function getCategoryNameByLink(link: string): string {
  if (!link) return '';
  const arr = link.split('/');
  const last = arr[arr.length - 1];
  const res = Object.keys(categoryMap).find((key) => categoryMap[key] === last) ?? '';
  return res;
}

// 获取分类
export function getCategoryByLink(categories: Category[], link?: string): Category | null {
  // 添加检查确保 link 是字符串
  if (!link || typeof link !== 'string' || !categories?.length) return null;

  // 将链接分割为部分，过滤掉空字符串和 "categories" 前缀
  const linkParts = link.split('/').filter((part) => part.length > 0 && part !== 'categories');
  if (linkParts.length === 0) return null;

  // 将链接部分转换为分类名称
  const categoryNames = linkParts.map((part) => {
    // 首先尝试通过值查找键（英文路径到中文名称）
    const categoryName = Object.keys(categoryMap).find((key) => categoryMap[key] === part);
    if (categoryName) {
      return categoryName;
    }

    // 如果找不到，检查是否是直接的分类名称
    const directMatch = Object.keys(categoryMap).find((key) => key === part);
    if (directMatch) {
      return part;
    }

    // 如果都找不到，返回原始部分
    return part;
  });

  if (categoryNames.length === 0) return null;

  // 递归查找分类
  function findCategory(cats: Category[], names: string[]): Category | null {
    if (names.length === 0) return null;

    const firstName = names[0];
    const category = cats.find((cat) => cat.name === firstName);

    if (!category) return null;

    // 如果这是最后一个名称，返回这个分类
    if (names.length === 1) return category;

    // 否则继续在子分类中查找
    if (category.children?.length) {
      return findCategory(category.children, names.slice(1));
    }

    return null;
  }

  return findCategory(categories, categoryNames);
}

/**
 * 获取分类下的所有文章
 * @param categoryName 分类名
 * @returns 文章列表
 */
export async function getPostsByCategory(categoryName: string, lang?: Language): Promise<BlogPost[]> {
  // 使用 false 参数来包含介绍文章，然后在过滤时排除
  const posts = await getSortedPosts(lang, false);

  // 确保 posts 存在且为数组
  if (!posts || !Array.isArray(posts)) {
    return [];
  }

  return posts.filter((post) => {
    const { categories } = post.data;
    if (!categories?.length) return false;

    // 排除介绍文章（通常是index.md文件）
    const isIntroArticle = post.slug.endsWith('/index') || post.slug.includes('/index');
    if (isIntroArticle) return false;

    // 处理两种分类格式
    if (Array.isArray(categories[0])) {
      // ['笔记', '算法'] - 嵌套分类
      return categories[0].includes(categoryName);
    } else {
      // '工具' - 单级分类
      return categories[0] === categoryName;
    }
  });
}

/**
 * 获取嵌套分类下的所有文章
 * @param categoryPath 分类路径，例如 ['现金流乌托邦', '期权卖方策略']
 * @returns 文章列表
 */
export async function getPostsByCategoryPath(categoryPath: string[], lang?: Language): Promise<BlogPost[]> {
  // 使用 false 参数来包含介绍文章，然后在过滤时排除
  const posts = await getSortedPosts(lang, false);

  // 确保 posts 存在且为数组
  if (!posts || !Array.isArray(posts)) {
    return [];
  }

  return posts.filter((post) => {
    const { categories } = post.data;
    if (!categories?.length) return false;

    // 排除介绍文章（通常是index.md文件）
    const isIntroArticle = post.slug.endsWith('/index') || post.slug.includes('/index');
    if (isIntroArticle) return false;

    // 只处理嵌套分类格式
    if (Array.isArray(categories[0])) {
      // 检查分类路径是否匹配
      if (categories[0].length < categoryPath.length) return false;

      // 检查路径的每个部分是否匹配
      for (let i = 0; i < categoryPath.length; i++) {
        if (categories[0][i] !== categoryPath[i]) return false;
      }

      return true;
    }

    return false;
  });
}

export function getPostLastCategory(post: BlogPost): { link: string; name: string } {
  const { categories } = post.data;
  if (!categories?.length) return { link: '', name: '' };
  if (Array.isArray(categories[0])) {
    if (!categories[0]?.length) return { link: '', name: '' };
    const arr = categories[0];
    const link = '/categories/' + arr.map((c) => categoryMap[c]).join('/');
    return { link, name: arr[arr.length - 1] };
  } else {
    return { link: '/categories/' + categoryMap[categories[0] as string], name: categories[0] as string };
  }
}

// 获取分类的父分类（递归查找）
export function getParentCategory(category: Category | null, categories: Category[]): Category | null {
  if (!categories?.length || !category) return null;

  for (const c of categories) {
    if (!c.children?.length) continue;

    // 直接检查当前层级
    if (c.children.some((child) => child.name === category.name)) {
      return c;
    }

    // 递归检查子分类
    for (const child of c.children) {
      if (child.children?.length) {
        const result = getParentCategory(category, [child]);
        if (result) return result;
      }
    }
  }
  return null;
}

// 传入 getCategoryArr 返回的数组, 返回分类链接
export async function getCategoryLink(categories: string[]): Promise<string> {
  try {
    if (!categories || !Array.isArray(categories) || categories.length === 0) return '';

    const linkParts: string[] = [];
    for (const category of categories) {
      if (typeof category === 'string') {
        const mapped = categoryMap[category];
        if (mapped) {
          linkParts.push(mapped);
        } else {
          // 如果没有映射，则使用类别名称的小写形式并替换空格为连字符
          linkParts.push(category.toLowerCase().replace(/\s+/g, '-'));
        }
      }
    }

    const link = linkParts.join('/');
    // 确保链接不以斜杠结尾，符合 trailingSlash: 'never' 的配置
    return link.replace(/\/$/, '');
  } catch (error) {
    console.error('生成分类链接时出错:', error);
    return '';
  }
}
