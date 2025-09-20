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

// 查找中英文版本不匹配的文章
function findMismatchedArticles() {
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
          isEnglish: filePath.includes('/en/')
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
    let relativePath = post.filePath.replace(/src\\content\\blog(\\en)?\\/, '');
    if (relativePath.startsWith('en/')) {
      relativePath = relativePath.substring(3);
    }
    
    if (!groupedPosts[relativePath]) {
      groupedPosts[relativePath] = { zh: null, en: null };
    }
    
    if (post.isEnglish) {
      groupedPosts[relativePath].en = post;
    } else {
      groupedPosts[relativePath].zh = post;
    }
  });
  
  // 检查中英文版本是否都存在且标签不匹配
  const mismatches = [];
  Object.entries(groupedPosts).forEach(([relativePath, versions]) => {
    if (versions.zh && versions.en) {
      const zhTags = versions.zh.data.tags || [];
      const enTags = versions.en.data.tags || [];
      
      // 如果标签数量或内容不匹配
      if (zhTags.length !== enTags.length || 
          JSON.stringify(zhTags.slice().sort()) !== JSON.stringify(enTags.slice().sort())) {
        mismatches.push({
          path: relativePath,
          zhTags,
          enTags,
          zhFile: versions.zh.filePath,
          enFile: versions.en.filePath
        });
      }
    }
  });
  
  return mismatches;
}

console.log('=== 查找中英文标签不匹配的文章 ===');
const mismatches = findMismatchedArticles();

console.log(`发现 ${mismatches.length} 个中英文标签不匹配的文章:\n`);

mismatches.forEach((mismatch, index) => {
  console.log(`${index + 1}. 文件: ${mismatch.path}`);
  console.log(`   中文标签 (${mismatch.zhTags.length} 个): ${mismatch.zhTags.join(', ')}`);
  console.log(`   英文标签 (${mismatch.enTags.length} 个): ${mismatch.enTags.join(', ')}`);
  console.log(`   中文文件: ${mismatch.zhFile}`);
  console.log(`   英文文件: ${mismatch.enFile}`);
  console.log('');
});