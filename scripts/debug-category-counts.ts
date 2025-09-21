import { getCollection } from 'astro:content';
import { categoryMap } from '@constants/category';

interface Category {
  name: string;
  children?: Category[];
}

// 递归添加子分类
export function addCategoryRecursively(rootCategories: Category[], parentNames: string[], name: string) {
  if (parentNames.length === 0) {
    const index = rootCategories.findIndex((c) => c.name === name);
    if (index === -1) rootCategories.push({ name });
    return;
  } else {
    const rootParentName = parentNames[0];
    const index = rootCategories.findIndex((c) => c.name === rootParentName);
    if (index === -1) {
      const rootParentCategory = { name: rootParentName, children: [] };
      rootCategories.push(rootParentCategory);
      addCategoryRecursively(rootParentCategory.children, parentNames.slice(1), name);
    } else {
      const rootParentCategory = rootCategories[index];
      if (!rootParentCategory?.children) rootParentCategory.children = [];
      addCategoryRecursively(rootParentCategory.children, parentNames.slice(1), name);
    }
  }
}

async function debugCategoryCounts() {
  const allBlogPosts = await getCollection('blog');
  console.log(`总文章数: ${allBlogPosts.length}`);

  const countMap: { [key: string]: number } = {};
  const resCategories: Category[] = [];

  // 统计每个分类的文章数量
  for (let i = 0; i < allBlogPosts.length; ++i) {
    const post = allBlogPosts[i];
    const { catalog, categories } = post.data;
    if (!catalog || !categories?.length) {
      console.log(`跳过文章 (无分类): ${post.slug}`);
      continue;
    }

    // 检查是否为介绍文章
    const isIntroArticle = post.slug.endsWith('/index') || post.slug.includes('/index');
    console.log(`文章: ${post.slug}, 分类: ${JSON.stringify(categories)}, 是否介绍文章: ${isIntroArticle}`);

    if (Array.isArray(categories[0]) && categories[0].length) {
      // 嵌套分类格式
      for (let j = 0; j < categories[0].length; ++j) {
        const name = categories[0][j];
        
        // 只有非介绍文章才计入统计
        if (!isIntroArticle) {
          countMap[name] = (countMap[name] || 0) + 1;
          console.log(`  分类 "${name}" 计数增加到: ${countMap[name]}`);
        } else {
          console.log(`  跳过介绍文章分类 "${name}"`);
        }
        
        if (j === 0) {
          addCategoryRecursively(resCategories, [], name);
        } else {
          const parentNames = categories[0].slice(0, j);
          addCategoryRecursively(resCategories, parentNames, name);
        }
      }
    } else {
      // 单级分类格式
      const name = categories[0] as string;
      
      // 只有非介绍文章才计入统计
      if (!isIntroArticle) {
        countMap[name] = (countMap[name] || 0) + 1;
        console.log(`  分类 "${name}" 计数增加到: ${countMap[name]}`);
      } else {
        console.log(`  跳过介绍文章分类 "${name}"`);
      }
      
      addCategoryRecursively(resCategories, [], name);
    }
  }

  console.log('\n=== 分类统计结果 ===');
  console.log('CountMap:', JSON.stringify(countMap, null, 2));
  
  console.log('\n=== 分类结构 ===');
  console.log('Categories:', JSON.stringify(resCategories, null, 2));
}

// 运行调试函数
debugCategoryCounts().catch(console.error);