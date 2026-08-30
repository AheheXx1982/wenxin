import { categoryMap } from '@constants/category';
import { getCollection, type CollectionEntry } from 'astro:content';
import { getRandomCoverForPath, getFixedCoverForPath } from '@lib/cover';
import type { Language } from '@constants/i18n';
import { i18nUI } from '@constants/i18n';

import type { BlogPost } from 'types/blog';

export async function getSortedPosts(
  lang?: Language,
  excludeIntro: boolean = false,
  includeHidden: boolean = false,
): Promise<CollectionEntry<'blog'>[]> {
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
        const isIntroArticle = post.slug?.endsWith('/index') || post.slug?.includes('/index');
        return !isIntroArticle;
      })
    : filteredPosts;

  // 排除隐藏文章（hidden: true 不出现在任何列表，但文章页仍可访问）
  const visiblePosts = includeHidden ? finalPosts : finalPosts.filter((post) => !post.data.hidden);

  // Astro 7 compat: glob loader uses 'id' instead of 'slug'
  const normalizedPosts = visiblePosts.map((post) => ({
    ...post,
    slug: post.slug || post.id || '',
  }));

  // 按日期排序
  const sortedPosts = normalizedPosts.sort((a: BlogPost, b: BlogPost) => {
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

// 首页推荐池（用户指定：优质长文候选，按栏目配额制）
const HOME_POOL: Record<string, string[]> = {
  何处觅知音: ['where-are-you-my-love', 'from-love-loss-to-cashflow', 'forrest-gump-why'], // 娘子(置顶) / 软饭 / 阿甘
  按摩大叔: ['five-star-reviews', 'massage-road-1'], // 五星级好评 / 按摩不归路一
  南洋往事: ['recalling-my-days-in-singapore', 'searching-for-my-boyfriend', 'dream-journal'], // 追忆 / 寻找消失的男朋友 / 梦境回忆录
  '投资 × AI': ['retail-investor-journey', 'qbts-interview'], // 小散户 / 小虎访谈
};
// 栏目配额：南洋/何处内容多安排 2 篇，按摩/投资 1 篇，瞬间随机 2 篇
const HOME_QUOTA: Record<string, number> = {
  何处觅知音: 2,
  按摩大叔: 1,
  南洋往事: 2,
  '投资 × AI': 1,
  瞬间: 2,
};

// Fisher-Yates 洗牌
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function postSlug(post: CollectionEntry<'blog'>): string {
  return post.data.slug || (typeof post.slug === 'string' ? post.slug.split('/').pop() || '' : '');
}

function postCategory(post: CollectionEntry<'blog'>): string {
  const cats = post.data.categories;
  if (!cats || !Array.isArray(cats) || cats.length === 0) return '';
  return Array.isArray(cats[0]) ? String(cats[0][0]) : String(cats[0]);
}

// 首页文章：栏目配额制——用户指定优质池优先，配额不足时栏目内随机补足
export async function getHomePosts(lang?: Language): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getSortedPosts(lang, true);
  const bySlug = new Map(posts.map((p) => [postSlug(p), p]));

  const picked: CollectionEntry<'blog'>[] = [];

  for (const [category, quota] of Object.entries(HOME_QUOTA)) {
    const poolSlugs = HOME_POOL[category] || [];
    // 该栏目文章（非池）
    const rest = posts.filter((p) => postCategory(p) === category && !poolSlugs.includes(postSlug(p)));

    if (category === '瞬间') {
      // 瞬间无池：直接随机 quota 篇
      picked.push(...shuffleArray(rest).slice(0, quota));
    } else {
      // 池文章优先（池内随机取配额），配额不足时从栏目随机补足
      const poolPicked = shuffleArray(
        poolSlugs.map((s) => bySlug.get(s)).filter((p): p is CollectionEntry<'blog'> => Boolean(p)),
      ).slice(0, quota);
      const need = quota - poolPicked.length;
      const restPicked = need > 0 ? shuffleArray(rest).slice(0, need) : [];
      picked.push(...poolPicked, ...restPicked);
    }
  }

  // 去重（保险）；featured 置顶排最前，其余按日期降序
  const seen = new Set<string>();
  const unique = picked.filter((p) => {
    const key = postSlug(p);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.sort((a, b) => {
    const af = a.data.featured ? 1 : 0;
    const bf = b.data.featured ? 1 : 0;
    if (af !== bf) return bf - af; // featured 置顶优先
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });
}

// 为文章获取封面图片：优先从正文提取第一张图片，其次 frontmatter cover，最后分类固定封面
export function getPostCoverImage(post: BlogPost): string {
  const { categories, cover } = post.data;

  // 优先从文章正文提取第一张图片作为封面
  const bodyImg = post.body?.match(/!\[[^\]]*\]\((\/[^)\s]+\.(?:webp|jpg|jpeg|png|gif))\)/);
  if (bodyImg && bodyImg[1]) {
    return bodyImg[1];
  }

  // 其次使用文章 frontmatter 中指定的 cover 图片
  if (cover) {
    return cover;
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    // 处理嵌套分类格式
    if (Array.isArray(categories[0])) {
      // 例如: ['新世界探索', '智能进化']
      const categoryPath = categories[0].join('/');
      const path = `/categories/${categoryPath}`;

      const result = getFixedCoverForPath(path, post.slug);

      return result;
    } else {
      // 处理单级分类格式
      // 例如: '期权研究院'
      const path = `/categories/${categories[0]}`;
      const result = getFixedCoverForPath(path, post.slug);
      return result;
    }
  }

  // 如果没有分类信息，返回默认图片
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
  description?: string;
  children?: Category[];
};

export async function getCategoryList(
  lang?: Language,
): Promise<{ categories: Category[]; countMap: { [key: string]: number } }> {
  // 获取指定语言的文章，默认为中文
  const allBlogPosts = await getSortedPosts(lang, false);

  const countMap: { [key: string]: number } = {};
  const resCategories: Category[] = [];

  // 首先，根据 categoryMap 创建所有分类结构
  const orderedCategoryNames = Object.keys(categoryMap);

  // 构建分类层级结构映射
  const categoryHierarchy: { [key: string]: string[] } = {
    按摩大叔: [],
    何处觅知音: [],
    南洋往事: [],
    '投资 × AI': [],
    瞬间: [],
  };

  // 创建所有一级分类
  for (const parentName of orderedCategoryNames) {
    if (categoryHierarchy[parentName]) {
      // 这是一级分类（有子分类）
      addCategoryRecursively(resCategories, [], parentName);
      // 添加所有子分类
      for (const childName of categoryHierarchy[parentName]) {
        addCategoryRecursively(resCategories, [parentName], childName);
      }
    }
  }

  // 确保始终有数组进行处理
  if (!allBlogPosts || !Array.isArray(allBlogPosts)) {
    return { categories: resCategories, countMap };
  }

  // 统计每个分类的文章数量，排除介绍文章
  for (let i = 0; i < allBlogPosts.length; ++i) {
    const post = allBlogPosts[i];
    const { categories } = post.data;
    // 移除 catalog 字段的检查，只要有 categories 就统计
    if (!categories?.length) {
      continue;
    }

    // 排除介绍文章（通常是index.md文件）
    // 判断逻辑：如果slug的最后一部分与分类的最后一部分相同，则为介绍文章
    let isIntroArticle = false;
    if (Array.isArray(categories[0]) && categories[0].length > 0) {
      // 对于嵌套分类，检查slug的最后一部分是否与分类的最后一部分相同
      const deepestCategory = categories[0][categories[0].length - 1];
      const slugParts = (post.slug || '').split('/');
      const lastSlugPart = slugParts[slugParts.length - 1];

      // 如果slug的最后一部分与分类名称相同，则为介绍文章
      isIntroArticle = lastSlugPart === deepestCategory;
    } else if (typeof categories[0] === 'string') {
      // 对于简单分类，检查slug的最后一部分是否与分类名称相同
      const slugParts = (post.slug || '').split('/');
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
    } else {
      // categories[0] = '工具'
      const name = categories[0] as string;

      // 只有非介绍文章才计入统计
      if (!isIntroArticle) {
        countMap[name] = (countMap[name] || 0) + 1;
      }
    }
  }

  // 创建英文到中文的映射函数
  const getCategoryKey = (categoryName: string): string => {
    // 如果直接在 categoryMap 中存在，返回原名称
    if (categoryMap[categoryName]) {
      return categoryName;
    }

    // 尝试从 i18n 配置中找到对应的中文名称
    // 通过英文名称查找中文键
    const enCategoryNames = (i18nUI.en?.categoryNames as Record<string, string>) || {};
    const zhKey = orderedCategoryNames.find((key) => {
      return enCategoryNames[key] === categoryName;
    });

    return zhKey || categoryName;
  };

  resCategories.sort((a, b) => {
    const keyA = getCategoryKey(a.name);
    const keyB = getCategoryKey(b.name);
    const indexA = orderedCategoryNames.indexOf(keyA);
    const indexB = orderedCategoryNames.indexOf(keyB);
    if (indexA === -1) return 1; // a 不在映射中，排在后面
    if (indexB === -1) return -1; // b 不在映射中，排在前面
    return indexA - indexB;
  });

  // 递归对子分类进行排序
  function sortChildrenCategories(categories: Category[]) {
    categories.forEach((category) => {
      if (category.children && category.children.length > 0) {
        category.children.sort((a, b) => {
          const keyA = getCategoryKey(a.name);
          const keyB = getCategoryKey(b.name);
          const indexA = orderedCategoryNames.indexOf(keyA);
          const indexB = orderedCategoryNames.indexOf(keyB);
          if (indexA === -1) return 1; // a 不在映射中，排在后面
          if (indexB === -1) return -1; // b 不在映射中，排在前面
          return indexA - indexB;
        });
        // 递归处理更深层的子分类
        sortChildrenCategories(category.children);
      }
    });
  }

  // 对所有层级的分类进行排序
  sortChildrenCategories(resCategories);

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
    if (index === -1) rootCategories.push({ name, description: getCategoryDescription(name) });
    return;
  } else {
    const rootParentName = parentNames[0];
    const index = rootCategories.findIndex((c) => c.name === rootParentName);
    if (index === -1) {
      // 如果父级分类不存在，则创建
      const rootParentCategory = { name: rootParentName, description: getCategoryDescription(rootParentName), children: [] };
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

// 分类头部说明文案（zh）
const categoryDescriptions: { [key: string]: string } = {
  按摩大叔: '按摩那点事',
  何处觅知音: '关于人生、认知、爱情、哲学，以及成长。',
  南洋往事: '南洋生活与见闻',
  '投资 × AI': '投资、AI、量化与自动化实践。',
  瞬间: '人活在世界上，快乐和痛苦本就分不清，所以我只求它货真价实。',
};

function getCategoryDescription(name: string): string | undefined {
  const desc = categoryDescriptions[name];
  return desc && desc.length > 0 ? desc : undefined;
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
  const res: string[] = [];

  // 创建英文到中文的映射函数
  const getCategoryMapKey = (categoryName: string): string | undefined => {
    // 如果直接在 categoryMap 中存在，返回该键对应的值
    if (categoryMap[categoryName]) {
      return categoryMap[categoryName];
    }

    // 尝试从 i18n 配置中找到对应的中文名称
    const enCategoryNames = (i18nUI.en?.categoryNames as Record<string, string>) || {};
    const zhKey = Object.keys(categoryMap).find((key) => {
      return enCategoryNames[key] === categoryName;
    });

    return zhKey ? categoryMap[zhKey] : undefined;
  };

  categories.forEach((category: Category) => {
    const link = getCategoryMapKey(category.name);
    // 添加检查确保 link 不是 undefined
    if (!link) {
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

  // 将链接部分转换为分类名称（中文）
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

  // 递归查找分类，同时支持中英文分类名称
  function findCategory(cats: Category[], names: string[]): Category | null {
    if (names.length === 0) return null;

    const firstName = names[0];

    // 先尝试直接匹配
    let category = cats.find((cat) => cat.name === firstName);

    // 如果没有直接匹配，尝试通过 i18n 映射匹配
    if (!category) {
      const enCategoryNames = (i18nUI.en?.categoryNames as Record<string, string>) || {};
      const enName = enCategoryNames[firstName];
      if (enName) {
        category = cats.find((cat) => cat.name === enName);
      }
    }

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
    const isIntroArticle = post.slug?.endsWith('/index') || post.slug?.includes('/index');
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
    const isIntroArticle = post.slug?.endsWith('/index') || post.slug?.includes('/index');
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
    // 顶级栏目无 categories 前缀（与主站一致）；次级分类保留完整路径
    const link = arr.length === 1 ? '/' + categoryMap[arr[0]] : '/categories/' + arr.map((c) => categoryMap[c]).join('/');
    return { link, name: arr[arr.length - 1] };
  } else {
    return { link: '/' + categoryMap[categories[0] as string], name: categories[0] as string };
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
          // 如果没有映射，记录警告并使用安全的英文占位符
          console.warn(`[getCategoryLink] No mapping found for: "${category}"`);
          // 移除中文字符，只保留英文、数字和连字符
          const safeName = category.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase() || 'category';
          linkParts.push(safeName);
        }
      }
    }

    const link = linkParts.join('/');
    // 确保链接不以斜杠结尾，符合 trailingSlash: 'never' 的配置
    return link.replace(/\/$/, '');
  } catch (error) {
    return '';
  }
}
