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

// 检查所有文章的标签
function checkAllArticleTags() {
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
  
  console.log('=== 检查所有文章标签 ===\n');
  console.log(`总共找到 ${articles.length} 篇文章`);
  console.log(`中文文章: ${zhArticles.length} 篇`);
  console.log(`英文文章: ${enArticles.length} 篇\n`);
  
  // 检查文章对
  const articlePairs = {};
  
  articles.forEach(article => {
    // 提取文件名（不含语言路径和扩展名）
    const isEn = article.relativePath.startsWith('en' + path.sep);
    const fileName = isEn ? article.relativePath.substring(3) : article.relativePath;
    const baseName = fileName.replace(/\.md$/, '');
    
    if (!articlePairs[baseName]) {
      articlePairs[baseName] = {};
    }
    
    articlePairs[baseName][isEn ? 'en' : 'zh'] = article;
  });
  
  console.log(`找到 ${Object.keys(articlePairs).length} 对文章\n`);
  
  // 检查标签数量不匹配的文章对
  console.log('=== 标签数量不匹配的文章对 ===');
  let mismatchCount = 0;
  
  Object.entries(articlePairs).forEach(([baseName, pair]) => {
    const zhData = pair.zh || { tags: [] };
    const enData = pair.en || { tags: [] };
    
    if (zhData.tags.length !== enData.tags.length) {
      mismatchCount++;
      console.log(`${baseName}:`);
      console.log(`  中文标签数量: ${zhData.tags.length} - ${zhData.tags.join(', ')}`);
      console.log(`  英文标签数量: ${enData.tags.length} - ${enData.tags.join(', ')}`);
      console.log();
    }
  });
  
  if (mismatchCount === 0) {
    console.log('所有文章对的标签数量都匹配\n');
  }
  
  // 收集所有标签
  const allZhTags = [];
  const allEnTags = [];
  
  zhArticles.forEach(article => {
    article.tags.forEach(tag => {
      allZhTags.push({
        tag: tag,
        article: article.relativePath,
        title: article.title
      });
    });
  });
  
  enArticles.forEach(article => {
    article.tags.forEach(tag => {
      allEnTags.push({
        tag: tag,
        article: article.relativePath,
        title: article.title
      });
    });
  });
  
  console.log(`中文标签总计: ${allZhTags.length} 个 (来自 ${zhArticles.length} 篇文章)`);
  console.log(`英文标签总计: ${allEnTags.length} 个 (来自 ${enArticles.length} 篇文章)`);
  
  // 统计唯一标签
  const uniqueZhTags = {};
  const uniqueEnTags = {};
  
  allZhTags.forEach(({tag}) => {
    if (tag && tag.trim() !== '') {
      if (!uniqueZhTags[tag]) {
        uniqueZhTags[tag] = 0;
      }
      uniqueZhTags[tag]++;
    }
  });
  
  allEnTags.forEach(({tag}) => {
    if (tag && tag.trim() !== '') {
      if (!uniqueEnTags[tag]) {
        uniqueEnTags[tag] = 0;
      }
      uniqueEnTags[tag]++;
    }
  });
  
  console.log(`中文唯一标签: ${Object.keys(uniqueZhTags).length} 个`);
  console.log(`英文唯一标签: ${Object.keys(uniqueEnTags).length} 个`);
  console.log(`差异: ${Object.keys(uniqueZhTags).length - Object.keys(uniqueEnTags).length}\n`);
  
  // 检查是否有重复标签
  console.log('=== 重复标签检查 ===');
  
  const duplicateZhTags = Object.entries(uniqueZhTags).filter(([,count]) => count > 1);
  const duplicateEnTags = Object.entries(uniqueEnTags).filter(([,count]) => count > 1);
  
  if (duplicateZhTags.length > 0) {
    console.log('中文重复标签:');
    duplicateZhTags.forEach(([tag, count]) => {
      console.log(`  ${tag}: ${count} 次`);
    });
  }
  
  if (duplicateEnTags.length > 0) {
    console.log('英文重复标签:');
    duplicateEnTags.forEach(([tag, count]) => {
      console.log(`  ${tag}: ${count} 次`);
    });
  }
  
  if (duplicateZhTags.length === 0 && duplicateEnTags.length === 0) {
    console.log('未发现重复标签');
  }
  
  // 检查只在一种语言中出现的标签
  console.log('\n=== 语言独有标签 ===');
  
  const zhOnlyTags = Object.keys(uniqueZhTags).filter(tag => !uniqueEnTags[tag]);
  const enOnlyTags = Object.keys(uniqueEnTags).filter(tag => !uniqueZhTags[tag]);
  
  if (zhOnlyTags.length > 0) {
    console.log(`只在中文中出现的标签 (${zhOnlyTags.length} 个):`);
    zhOnlyTags.forEach(tag => {
      console.log(`  ${tag}`);
    });
  }
  
  if (enOnlyTags.length > 0) {
    console.log(`只在英文中出现的标签 (${enOnlyTags.length} 个):`);
    enOnlyTags.forEach(tag => {
      console.log(`  ${tag}`);
    });
  }
}

checkAllArticleTags();