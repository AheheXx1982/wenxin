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
  
  // 统计中文标签
  const zhTags = {};
  let zhTotalTags = 0;
  zhPosts.forEach(post => {
    const postTags = post.tags || [];
    zhTotalTags += postTags.length;
    postTags.forEach(tag => {
      if (!zhTags[tag]) {
        zhTags[tag] = { count: 0, sources: [] };
      }
      zhTags[tag].count++;
      zhTags[tag].sources.push(post.title || 'Unknown');
    });
  });
  
  // 统计英文标签
  const enTags = {};
  let enTotalTags = 0;
  enPosts.forEach(post => {
    const postTags = post.tags || [];
    enTotalTags += postTags.length;
    postTags.forEach(tag => {
      if (!enTags[tag]) {
        enTags[tag] = { count: 0, sources: [] };
      }
      enTags[tag].count++;
      enTags[tag].sources.push(post.title || 'Unknown');
    });
  });
  
  return { zhTags, enTags, zhTotalTags, enTotalTags, zhPostCount: zhPosts.length, enPostCount: enPosts.length };
}

console.log('=== 准确的标签统计分析 ===');
const { zhTags, enTags, zhTotalTags, enTotalTags, zhPostCount, enPostCount } = countTagsByLanguage();

console.log(`中文文章数量: ${zhPostCount}`);
console.log(`英文文章数量: ${enPostCount}`);
console.log(`中文标签总计: ${zhTotalTags} (唯一标签: ${Object.keys(zhTags).length})`);
console.log(`英文标签总计: ${enTotalTags} (唯一标签: ${Object.keys(enTags).length})`);
console.log(`标签总数差异: ${enTotalTags - zhTotalTags}`);

// 找出可能重复计算的标签
console.log('\n=== 重复出现的标签 ===');

console.log('\n中文重复标签 (出现次数 > 1):');
Object.entries(zhTags)
  .filter(([, data]) => data.count > 1)
  .sort(([, a], [, b]) => b.count - a.count)
  .slice(0, 10)
  .forEach(([tag, data]) => {
    console.log(`  ${tag}: ${data.count} 次`);
  });

console.log('\n英文重复标签 (出现次数 > 1):');
Object.entries(enTags)
  .filter(([, data]) => data.count > 1)
  .sort(([, a], [, b]) => b.count - a.count)
  .slice(0, 10)
  .forEach(([tag, data]) => {
    console.log(`  ${tag}: ${data.count} 次`);
  });

console.log('\n=== 标签统计 ===');
console.log('中文标签统计 (前20个):');
const sortedZhTags = Object.entries(zhTags)
  .sort(([, a], [, b]) => b.count - a.count);
sortedZhTags.slice(0, 20).forEach(([tag, data]) => {
  console.log(`  ${tag}: ${data.count} 次`);
});

console.log('\n英文标签统计 (前20个):');
const sortedEnTags = Object.entries(enTags)
  .sort(([, a], [, b]) => b.count - a.count);
sortedEnTags.slice(0, 20).forEach(([tag, data]) => {
  console.log(`  ${tag}: ${data.count} 次`);
});