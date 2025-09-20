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

// 模拟网站标签处理逻辑
function simulateWebsiteTagProcessing(lang) {
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
          filePath: path.relative(__dirname, filePath)
        });
      }
    } catch (error) {
      console.error(`解析文件失败: ${filePath}`, error.message);
    }
  });
  
  // 根据语言筛选文章
  const filteredPosts = lang
    ? posts.filter(post => {
        const postLang = post.data.lang || 'zh';
        return postLang === lang;
      })
    : posts.filter(post => {
        const postLang = post.data.lang || 'zh';
        return postLang === 'zh'; // 默认显示中文文章
      });
  
  // 统计标签
  const tags = {};
  filteredPosts.forEach(post => {
    const postTags = post.data.tags || [];
    postTags.forEach(tag => {
      if (!tags[tag]) {
        tags[tag] = 0;
      }
      tags[tag]++;
    });
  });
  
  const sortedTags = Object.entries(tags)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
  
  return { sortedTags, posts: filteredPosts };
}

console.log('=== 重新统计标签数量 ===');
const zhResult = simulateWebsiteTagProcessing('zh');
const enResult = simulateWebsiteTagProcessing('en');

console.log(`中文标签数量: ${zhResult.sortedTags.length}`);
console.log(`英文标签数量: ${enResult.sortedTags.length}`);
console.log(`数量差异: ${zhResult.sortedTags.length - enResult.sortedTags.length}`);

console.log('\n中文前10个标签:');
zhResult.sortedTags.slice(0, 10).forEach(({ tag, count }) => {
  console.log(`  ${tag}: ${count}`);
});

console.log('\n英文前10个标签:');
enResult.sortedTags.slice(0, 10).forEach(({ tag, count }) => {
  console.log(`  ${tag}: ${count}`);
});