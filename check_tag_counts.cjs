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

// 统计标签数量
function countTags() {
  const contentDir = path.join(__dirname, 'src', 'content', 'blog');
  const articles = [];
  
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
            articles.push({
              path: fullPath,
              relativePath: path.relative(contentDir, fullPath),
              lang: frontmatter.lang || 'zh',
              tags: frontmatter.tags || [],
              title: frontmatter.title || 'Unknown'
            });
          }
        } catch (e) {
          console.error(`Error reading file ${fullPath}:`, e);
        }
      }
    }
  }
  
  walkDir(contentDir);
  
  // 按语言分组
  const zhArticles = articles.filter(article => article.lang === 'zh');
  const enArticles = articles.filter(article => article.lang === 'en');
  
  // 统计标签
  const zhTags = {};
  const enTags = {};
  
  zhArticles.forEach(article => {
    article.tags.forEach(tag => {
      zhTags[tag] = (zhTags[tag] || 0) + 1;
    });
  });
  
  enArticles.forEach(article => {
    article.tags.forEach(tag => {
      enTags[tag] = (enTags[tag] || 0) + 1;
    });
  });
  
  console.log('=== 标签统计 ===\n');
  
  console.log(`中文文章数量: ${zhArticles.length}`);
  console.log(`英文文章数量: ${enArticles.length}`);
  console.log(`中文标签总数: ${Object.keys(zhTags).length}`);
  console.log(`英文标签总数: ${Object.keys(enTags).length}`);
  
  // 检查是否有重复标签
  const allTags = new Set([...Object.keys(zhTags), ...Object.keys(enTags)]);
  console.log(`去重后总标签数: ${allTags.size}`);
  
  console.log('\n=== 详细统计 ===');
  console.log('中文标签:');
  Object.entries(zhTags).forEach(([tag, count]) => {
    console.log(`  ${tag}: ${count}`);
  });
  
  console.log('\n英文标签:');
  Object.entries(enTags).forEach(([tag, count]) => {
    console.log(`  ${tag}: ${count}`);
  });
}

countTags();