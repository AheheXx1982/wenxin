const fs = require('fs');
const path = require('path');

// 更准确的 frontmatter 解析函数
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const frontmatter = match[1];
  const lines = frontmatter.split('\n');
  const data = {};
  
  for (const line of lines) {
    const [key, value] = line.split(':').map(s => s.trim());
    if (key && value) {
      if (key === 'tags') {
        // 处理标签数组
        const tagsMatch = value.match(/\[(.*)\]/);
        if (tagsMatch) {
          data.tags = tagsMatch[1]
            .split(',')
            .map(tag => tag.trim().replace(/^['"]|['"]$/g, ''))
            .filter(tag => tag.length > 0);
        } else {
          // 处理单个标签的情况
          data.tags = [value.replace(/^['"]|['"]$/g, '')];
        }
      } else if (key === 'lang') {
        data.lang = value.replace(/^['"]|['"]$/g, '');
      }
    }
  }
  
  return data;
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
  
  console.log(`找到 ${allPostPaths.length} 个文章文件`);
  
  const posts = [];
  const failedFiles = [];
  
  allPostPaths.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatter = parseFrontmatter(content);
      
      if (frontmatter) {
        posts.push({
          data: frontmatter,
          filePath: path.relative(__dirname, filePath)
        });
      } else {
        failedFiles.push(path.relative(__dirname, filePath));
      }
    } catch (error) {
      console.error(`解析文件失败: ${filePath}`, error.message);
      failedFiles.push(path.relative(__dirname, filePath));
    }
  });
  
  console.log(`成功解析 ${posts.length} 个文章`);
  console.log(`未能解析 ${failedFiles.length} 个文件`);
  
  if (failedFiles.length > 0) {
    console.log('未能解析的文件:');
    failedFiles.forEach(file => console.log(`  ${file}`));
  }
  
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
  
  console.log(`${lang} 语言文章数量: ${filteredPosts.length}`);
  
  // 显示前5个文章路径
  console.log(`${lang} 语言前5个文章:`);
  filteredPosts.slice(0, 5).forEach(post => {
    console.log(`  ${post.filePath}`);
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
  
  console.log(`${lang} 语言标签数量: ${sortedTags.length}`);
  
  // 显示所有标签
  console.log(`${lang} 语言所有标签:`);
  sortedTags.forEach(({ tag, count }) => {
    console.log(`  ${tag}: ${count}`);
  });
  
  return { sortedTags, posts: filteredPosts };
}

console.log('=== 模拟网站标签处理流程 ===');
const zhResult = simulateWebsiteTagProcessing('zh');
const enResult = simulateWebsiteTagProcessing('en');

console.log('\n=== 标签数量对比 ===');
console.log(`中文标签数量: ${zhResult.sortedTags.length}`);
console.log(`英文标签数量: ${enResult.sortedTags.length}`);
console.log(`数量差异: ${zhResult.sortedTags.length - enResult.sortedTags.length}`);