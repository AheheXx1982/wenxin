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

// 模拟网站实际的标签处理逻辑
function simulateWebsiteTagProcessing(lang) {
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
        // 检查是否符合语言条件
        const isEnFile = fullPath.includes(path.join('blog', 'en'));
        if ((lang === 'en' && isEnFile) || (lang === 'zh' && !isEnFile)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const frontmatter = parseFrontmatter(content);
            
            if (frontmatter) {
              posts.push({
                id: path.relative(contentDir, fullPath),
                data: frontmatter
              });
            }
          } catch (e) {
            console.error(`Error reading file ${fullPath}:`, e);
          }
        }
      }
    }
  }
  
  walkDir(contentDir);
  
  // 按日期排序
  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });
  
  return sortedPosts;
}

// 模拟 getAllTags 函数
function getAllTags(posts) {
  return posts.reduce((acc, post) => {
    const postTags = post.data.tags || [];
    postTags.forEach((tag) => {
      // 过滤掉空标签
      if (tag && tag.trim() !== '') {
        if (!acc[tag]) {
          acc[tag] = 0;
        }
        acc[tag]++;
      }
    });
    return acc;
  }, {});
}

// 主函数
function main() {
  console.log('=== 检查实际网站标签 ===\n');
  
  // 获取中文文章
  const zhPosts = simulateWebsiteTagProcessing('zh');
  console.log(`找到 ${zhPosts.length} 个中文文章`);
  
  // 获取英文文章
  const enPosts = simulateWebsiteTagProcessing('en');
  console.log(`找到 ${enPosts.length} 个英文文章\n`);
  
  // 获取标签
  const zhTags = getAllTags(zhPosts);
  const enTags = getAllTags(enPosts);
  
  const zhTagCount = Object.keys(zhTags).length;
  const enTagCount = Object.keys(enTags).length;
  
  console.log(`中文标签总数: ${zhTagCount}`);
  console.log(`英文标签总数: ${enTagCount}`);
  console.log(`差异: ${zhTagCount - enTagCount}\n`);
  
  // 检查是否有空标签或特殊字符
  const zhTagList = Object.keys(zhTags);
  const enTagList = Object.keys(enTags);
  
  const emptyZhTags = zhTagList.filter(tag => !tag || tag.trim() === '');
  const emptyEnTags = enTagList.filter(tag => !tag || tag.trim() === '');
  
  if (emptyZhTags.length > 0) {
    console.log(`发现 ${emptyZhTags.length} 个空的中文标签`);
  }
  
  if (emptyEnTags.length > 0) {
    console.log(`发现 ${emptyEnTags.length} 个空的英文标签`);
  }
  
  // 检查特殊字符
  const specialCharZhTags = zhTagList.filter(tag => /[\r\n\t]/.test(tag));
  const specialCharEnTags = enTagList.filter(tag => /[\r\n\t]/.test(tag));
  
  if (specialCharZhTags.length > 0) {
    console.log(`发现 ${specialCharZhTags.length} 个包含特殊字符的中文标签:`, specialCharZhTags);
  }
  
  if (specialCharEnTags.length > 0) {
    console.log(`发现 ${specialCharEnTags.length} 个包含特殊字符的英文标签:`, specialCharEnTags);
  }
  
  // 显示前几个标签以检查内容
  console.log('\n=== 中文标签前10个 ===');
  const sortedZhTags = Object.entries(zhTags)
    .sort(([,a], [,b]) => b - a);
  sortedZhTags.slice(0, 10).forEach(([tag, count]) => {
    console.log(`${tag}: ${count}`);
  });
  
  console.log('\n=== 英文标签前10个 ===');
  const sortedEnTags = Object.entries(enTags)
    .sort(([,a], [,b]) => b - a);
  sortedEnTags.slice(0, 10).forEach(([tag, count]) => {
    console.log(`${tag}: ${count}`);
  });
}

main();