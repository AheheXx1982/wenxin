const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// 解析 frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    try {
      const frontmatter = yaml.load(match[1]);
      return frontmatter;
    } catch (e) {
      console.error('Error parsing frontmatter:', e);
      return null;
    }
  }
  
  return null;
}

// 模拟 getSortedPosts 函数
function getSortedPosts(lang) {
  const contentDir = path.join(__dirname, 'src', 'content', 'blog');
  const posts = [];
  
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (stat.isFile() && item.endsWith('.md')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const frontmatter = parseFrontmatter(content);
          
          if (frontmatter) {
            // 检查语言
            const postLang = frontmatter.lang || 'zh';
            if (postLang === lang) {
              posts.push({
                id: path.relative(contentDir, fullPath),
                data: frontmatter,
                body: content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')
              });
            }
          }
        } catch (e) {
          console.error(`Error reading file ${fullPath}:`, e);
        }
      }
    }
  }
  
  walkDir(contentDir);
  
  // 按日期排序
  return posts.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });
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

// 主函数
function main() {
  console.log('=== 模拟网站标签处理逻辑 ===\n');
  
  // 获取中文文章
  const zhPosts = getSortedPosts('zh');
  console.log(`获取到 ${zhPosts.length} 个中文文章`);
  
  // 获取英文文章
  const enPosts = getSortedPosts('en');
  console.log(`获取到 ${enPosts.length} 个英文文章\n`);
  
  // 获取标签
  const zhTags = getAllTags(zhPosts);
  const enTags = getAllTags(enPosts);
  
  const zhTagCount = Object.keys(zhTags).length;
  const enTagCount = Object.keys(enTags).length;
  
  console.log(`中文标签总数: ${zhTagCount}`);
  console.log(`英文标签总数: ${enTagCount}`);
  console.log(`差异: ${zhTagCount - enTagCount}\n`);
  
  // 显示标签列表
  console.log('=== 中文标签 ===');
  const sortedZhTags = Object.entries(zhTags)
    .sort(([,a], [,b]) => b - a);
  sortedZhTags.forEach(([tag, count]) => {
    console.log(`${tag}: ${count}`);
  });
  
  console.log('\n=== 英文标签 ===');
  const sortedEnTags = Object.entries(enTags)
    .sort(([,a], [,b]) => b - a);
  sortedEnTags.forEach(([tag, count]) => {
    console.log(`${tag}: ${count}`);
  });
  
  // 查找只在中文中出现的标签
  const zhOnlyTags = sortedZhTags.filter(([tag]) => !enTags[tag]);
  if (zhOnlyTags.length > 0) {
    console.log('\n=== 只在中文中出现的标签 ===');
    zhOnlyTags.forEach(([tag, count]) => {
      console.log(`${tag}: ${count}`);
    });
  }
  
  // 查找只在英文中出现的标签
  const enOnlyTags = sortedEnTags.filter(([tag]) => !zhTags[tag]);
  if (enOnlyTags.length > 0) {
    console.log('\n=== 只在英文中出现的标签 ===');
    enOnlyTags.forEach(([tag, count]) => {
      console.log(`${tag}: ${count}`);
    });
  }
}

main();