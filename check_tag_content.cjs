const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// 更准确的 frontmatter 解析函数
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const frontmatter = match[1];
  
  try {
    // 使用 yaml 解析 frontmatter
    const data = yaml.load(frontmatter);
    return data;
  } catch (error) {
    console.error('YAML 解析失败:', error.message);
    return null;
  }
}

// 获取所有文章文件路径
function getAllPostPaths(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    
    if (stat && stat.isDirectory()) {
      results = [...results, ...getAllPostPaths(file)];
    } else if (path.extname(file) === '.md') {
      results.push(file);
    }
  });
  
  return results;
}

// 查找中英文版本的文章
function findPairedArticles() {
  const postsDir = path.join(__dirname, 'src', 'content', 'blog');
  const allPostPaths = getAllPostPaths(postsDir);
  
  const posts = [];
  allPostPaths.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatter = parseFrontmatter(content);
      
      if (frontmatter) {
        posts.push({
          data: frontmatter,
          filePath: path.relative(__dirname, filePath),
          isEnglish: filePath.includes('\\en\\') || filePath.includes('/en/')
        });
      }
    } catch (error) {
      console.error(`解析文件失败: ${filePath}`, error.message);
    }
  });
  
  // 按文件名分组（去除语言路径）
  const groupedPosts = {};
  posts.forEach(post => {
    // 提取相对路径，去除语言标识
    let relativePath = post.filePath.replace(/src\\content\\blog\\en\\/, 'src\\content\\blog\\');
    relativePath = relativePath.replace(/src\/content\/blog\/en\//, 'src\/content\/blog\/');
    
    if (!groupedPosts[relativePath]) {
      groupedPosts[relativePath] = { zh: null, en: null };
    }
    
    if (post.isEnglish) {
      groupedPosts[relativePath].en = post;
    } else {
      groupedPosts[relativePath].zh = post;
    }
  });
  
  // 找出中英文版本都存在的文章
  const pairedArticles = [];
  Object.entries(groupedPosts).forEach(([relativePath, versions]) => {
    if (versions.zh && versions.en) {
      const zhTags = versions.zh.data.tags || [];
      const enTags = versions.en.data.tags || [];
      
      // 比较标签内容（忽略顺序）
      const zhTagsSorted = zhTags.slice().sort();
      const enTagsSorted = enTags.slice().sort();
      const tagMismatch = JSON.stringify(zhTagsSorted) !== JSON.stringify(enTagsSorted);
      
      pairedArticles.push({
        path: relativePath,
        zhTags,
        enTags,
        zhFile: versions.zh.filePath,
        enFile: versions.en.filePath,
        tagMismatch,
        tagCountMismatch: zhTags.length !== enTags.length
      });
    }
  });
  
  return pairedArticles;
}

console.log('=== 查找中英文版本都存在的文章 ===');
const pairedArticles = findPairedArticles();

console.log(`发现 ${pairedArticles.length} 个中英文版本都存在的文章:\n`);

let mismatchCount = 0;
pairedArticles.forEach((article, index) => {
  if (article.tagMismatch) {
    mismatchCount++;
    console.log(`${index + 1}. 文件: ${article.path}`);
    console.log(`   中文标签 (${article.zhTags.length} 个): ${article.zhTags.join(', ')}`);
    console.log(`   英文标签 (${article.enTags.length} 个): ${article.enTags.join(', ')}`);
    console.log(`   标签内容是否匹配: ${article.tagMismatch ? '否' : '是'}`);
    console.log('');
  }
});

console.log(`总共发现 ${mismatchCount} 个标签内容不匹配的文章。`);