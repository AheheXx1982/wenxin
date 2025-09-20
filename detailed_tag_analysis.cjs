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

// 统计每种语言的标签
function countTagsByLanguage() {
  const postsDir = path.join(__dirname, 'src', 'content', 'blog');
  const allPostPaths = getAllPostPaths(postsDir);
  
  const zhPosts = [];
  const enPosts = [];
  
  allPostPaths.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatter = parseFrontmatter(content);
      
      if (frontmatter) {
        const post = {
          data: frontmatter,
          filePath: path.relative(__dirname, filePath)
        };
        
        const postLang = frontmatter.lang || 'zh';
        if (postLang === 'en') {
          enPosts.push(post);
        } else {
          zhPosts.push(post);
        }
      }
    } catch (error) {
      console.error(`解析文件失败: ${filePath}`, error.message);
    }
  });
  
  // 统计中文标签
  const zhTags = {};
  zhPosts.forEach(post => {
    const postTags = post.data.tags || [];
    postTags.forEach(tag => {
      if (!zhTags[tag]) {
        zhTags[tag] = { count: 0, sources: [] };
      }
      zhTags[tag].count++;
      zhTags[tag].sources.push(post.filePath);
    });
  });
  
  // 统计英文标签
  const enTags = {};
  enPosts.forEach(post => {
    const postTags = post.data.tags || [];
    postTags.forEach(tag => {
      if (!enTags[tag]) {
        enTags[tag] = { count: 0, sources: [] };
      }
      enTags[tag].count++;
      enTags[tag].sources.push(post.filePath);
    });
  });
  
  return { zhTags, enTags, zhPosts, enPosts };
}

console.log('=== 详细标签统计分析 ===');
const { zhTags, enTags, zhPosts, enPosts } = countTagsByLanguage();

console.log(`中文文章数量: ${zhPosts.length}`);
console.log(`英文文章数量: ${enPosts.length}`);

console.log(`\n中文标签总数: ${Object.keys(zhTags).length}`);
console.log(`英文标签总数: ${Object.keys(enTags).length}`);

// 找出只在英文中出现的标签
const onlyInEn = Object.keys(enTags).filter(tag => !zhTags[tag]);
console.log(`\n只在英文中出现的标签数量: ${onlyInEn.length}`);
if (onlyInEn.length > 0) {
  console.log('只在英文中出现的标签:');
  onlyInEn.forEach(tag => {
    console.log(`  ${tag}: ${enTags[tag].count} 次`);
    console.log(`    来源: ${enTags[tag].sources[0]}`);
  });
}

// 找出只在中文中出现的标签
const onlyInZh = Object.keys(zhTags).filter(tag => !enTags[tag]);
console.log(`\n只在中文中出现的标签数量: ${onlyInZh.length}`);
if (onlyInZh.length > 0) {
  console.log('只在中文中出现的标签:');
  onlyInZh.forEach(tag => {
    console.log(`  ${tag}: ${zhTags[tag].count} 次`);
    console.log(`    来源: ${zhTags[tag].sources[0]}`);
  });
}

console.log('\n=== 中文标签统计 (前20个) ===');
const sortedZhTags = Object.entries(zhTags)
  .sort(([, a], [, b]) => b.count - a.count);
sortedZhTags.slice(0, 20).forEach(([tag, data]) => {
  console.log(`  ${tag}: ${data.count} 次`);
});

console.log('\n=== 英文标签统计 (前20个) ===');
const sortedEnTags = Object.entries(enTags)
  .sort(([, a], [, b]) => b.count - a.count);
sortedEnTags.slice(0, 20).forEach(([tag, data]) => {
  console.log(`  ${tag}: ${data.count} 次`);
});