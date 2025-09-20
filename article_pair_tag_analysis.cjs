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

// 查找中英文版本的文章对并比较标签数量
function findArticlePairsAndCompareTags() {
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
  
  // 检查中英文版本标签数量是否一致
  const mismatches = [];
  const matches = [];
  
  Object.entries(groupedPosts).forEach(([relativePath, versions]) => {
    if (versions.zh && versions.en) {
      const zhTagCount = (versions.zh.data.tags || []).length;
      const enTagCount = (versions.en.data.tags || []).length;
      
      if (zhTagCount !== enTagCount) {
        mismatches.push({
          path: relativePath,
          zhTags: versions.zh.data.tags || [],
          enTags: versions.en.data.tags || [],
          zhTagCount,
          enTagCount,
          zhFile: versions.zh.filePath,
          enFile: versions.en.filePath
        });
      } else {
        matches.push({
          path: relativePath,
          zhTagCount,
          enTagCount
        });
      }
    }
  });
  
  return { mismatches, matches, totalPairs: Object.keys(groupedPosts).filter(key => groupedPosts[key].zh && groupedPosts[key].en).length };
}

console.log('=== 中英文文章对标签数量对比 ===');
const { mismatches, matches, totalPairs } = findArticlePairsAndCompareTags();

console.log(`总文章对数: ${totalPairs}`);
console.log(`标签数量匹配的文章对数: ${matches.length}`);
console.log(`标签数量不匹配的文章对数: ${mismatches.length}`);

if (mismatches.length > 0) {
  console.log('\n标签数量不匹配的文章:');
  mismatches.forEach((mismatch, index) => {
    console.log(`${index + 1}. 文件: ${mismatch.path}`);
    console.log(`   中文标签数量: ${mismatch.zhTagCount} 个`);
    console.log(`   英文标签数量: ${mismatch.enTagCount} 个`);
    console.log(`   数量差异: ${mismatch.enTagCount - mismatch.zhTagCount}`);
  });
} else {
  console.log('\n所有文章对的标签数量都匹配！');
}

// 统计总的标签数量
function countTotalTags() {
  const postsDir = path.join(__dirname, 'src', 'content', 'blog');
  const allPostPaths = getAllPostPaths(postsDir);
  
  const zhPosts = [];
  const enPosts = [];
  
  allPostPaths.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatter = parseFrontmatter(content);
      
      if (frontmatter) {
        const postLang = frontmatter.lang || 'zh';
        if (postLang === 'en') {
          enPosts.push(frontmatter);
        } else {
          zhPosts.push(frontmatter);
        }
      }
    } catch (error) {
      console.error(`解析文件失败: ${filePath}`, error.message);
    }
  });
  
  // 统计标签
  const zhTags = {};
  zhPosts.forEach(post => {
    const postTags = post.tags || [];
    postTags.forEach(tag => {
      if (!zhTags[tag]) zhTags[tag] = 0;
      zhTags[tag]++;
    });
  });
  
  const enTags = {};
  enPosts.forEach(post => {
    const postTags = post.tags || [];
    postTags.forEach(tag => {
      if (!enTags[tag]) enTags[tag] = 0;
      enTags[tag]++;
    });
  });
  
  return { 
    zhTagCount: Object.keys(zhTags).length, 
    enTagCount: Object.keys(enTags).length,
    zhPostCount: zhPosts.length,
    enPostCount: enPosts.length
  };
}

const tagCounts = countTotalTags();
console.log(`\n=== 总体标签统计 ===`);
console.log(`中文文章数量: ${tagCounts.zhPostCount}`);
console.log(`英文文章数量: ${tagCounts.enPostCount}`);
console.log(`中文标签总数: ${tagCounts.zhTagCount}`);
console.log(`英文标签总数: ${tagCounts.enTagCount}`);
console.log(`标签总数差异: ${tagCounts.enTagCount - tagCounts.zhTagCount}`);