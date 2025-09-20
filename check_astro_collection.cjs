// 模拟 Astro 的 getCollection 函数行为
const fs = require('fs');
const path = require('path');

// 递归获取目录下所有文件
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// 更准确地解析 frontmatter
function parseFrontMatterAccurately(content) {
  const lines = content.split('\n');
  const result = {};
  let inFrontMatter = false;
  let inTagsSection = false;
  const tags = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 检查 frontmatter 开始
    if (line.trim() === '---' && !inFrontMatter) {
      inFrontMatter = true;
      continue;
    }
    
    // 检查 frontmatter 结束
    if (line.trim() === '---' && inFrontMatter) {
      break;
    }
    
    // 在 frontmatter 中处理
    if (inFrontMatter) {
      // 检查语言标记
      if (line.startsWith('lang:')) {
        result.lang = line.split(':')[1].trim().replace(/['"]/g, '');
      }
      
      // 检查 tags 部分开始
      if (line.startsWith('tags:')) {
        inTagsSection = true;
        continue;
      }
      
      // 在 tags 部分中解析标签
      if (inTagsSection) {
        if (line.startsWith('  - ') || line.startsWith('- ')) {
          const tag = line.replace(/^[\s-]*/, '').trim().replace(/['"]/g, '');
          if (tag) tags.push(tag);
        } else if (line.trim() !== '' && !line.startsWith('  ') && !line.startsWith('\t') && line.includes(':')) {
          // 遇到其他字段，结束 tags 部分
          inTagsSection = false;
        }
      }
    }
  }
  
  result.tags = tags;
  return result;
}

// 模拟 Astro 的 getCollection 函数
async function getCollection(collectionName) {
  if (collectionName !== 'blog') {
    return [];
  }
  
  const blogDir = './src/content/blog';
  const files = getAllFiles(blogDir);
  
  const posts = [];
  
  // 收集所有文章
  files.forEach(file => {
    if (file.endsWith('.md')) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const frontMatter = parseFrontMatterAccurately(content);
        
        // 模拟 Astro Content Collections 的数据结构
        posts.push({
          id: path.relative(blogDir, file),
          slug: path.basename(file, '.md'),
          body: '', // 不需要内容
          data: {
            title: frontMatter.title || '',
            date: frontMatter.date || new Date(),
            description: frontMatter.description || '',
            lang: frontMatter.lang || 'zh',
            categories: frontMatter.categories || [],
            tags: frontMatter.tags || [],
            catalog: frontMatter.catalog || false
          },
          collection: 'blog',
          render: null
        });
      } catch (error) {
        console.error('Error reading file:', file, error.message);
      }
    }
  });
  
  return posts;
}

// 模拟 getSortedPosts 函数
async function getSortedPosts(lang) {
  const posts = await getCollection('blog');

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

  // 按日期排序
  const sortedPosts = filteredPosts.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });

  return sortedPosts;
}

// 模拟 getAllTags 函数
function getAllTags(posts) {
  return posts.reduce((acc, post) => {
    const postTags = post.data.tags || [];
    postTags.forEach((tag) => {
      if (!acc[tag]) {
        acc[tag] = 0;
      }
      acc[tag]++;
    });
    return acc;
  }, {});
}

// 模拟完整的标签处理流程
async function simulateFullProcess() {
  console.log('=== 模拟 Astro 完整处理流程 ===');
  
  // 模拟中文标签页面
  const chinesePosts = await getSortedPosts('zh');
  const chineseTags = getAllTags(chinesePosts);
  const sortedChineseTags = Object.entries(chineseTags)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
  
  // 模拟英文标签页面
  const englishPosts = await getSortedPosts('en');
  const englishTags = getAllTags(englishPosts);
  const sortedEnglishTags = Object.entries(englishTags)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
  
  console.log('中文文章数量:', chinesePosts.length);
  console.log('中文标签数量:', sortedChineseTags.length);
  
  console.log('英文文章数量:', englishPosts.length);
  console.log('英文标签数量:', sortedEnglishTags.length);
  
  console.log('差异:', sortedChineseTags.length - sortedEnglishTags.length);
  
  // 检查文章数量是否正确
  console.log('\n=== 文章数量检查 ===');
  const allPosts = await getCollection('blog');
  console.log('总文章数量:', allPosts.length);
  
  const chinesePostCount = allPosts.filter(post => (post.data.lang || 'zh') === 'zh').length;
  const englishPostCount = allPosts.filter(post => (post.data.lang || 'zh') === 'en').length;
  
  console.log('中文文章数量:', chinesePostCount);
  console.log('英文文章数量:', englishPostCount);
  
  // 检查是否有重复的文章ID
  console.log('\n=== 检查重复文章 ===');
  const postIds = allPosts.map(post => post.id);
  const uniquePostIds = [...new Set(postIds)];
  
  if (postIds.length !== uniquePostIds.length) {
    console.log('发现重复文章ID:');
    const seen = new Set();
    postIds.forEach(id => {
      if (seen.has(id)) {
        console.log('  重复ID:', id);
      } else {
        seen.add(id);
      }
    });
  } else {
    console.log('没有发现重复文章ID');
  }
}

simulateFullProcess();