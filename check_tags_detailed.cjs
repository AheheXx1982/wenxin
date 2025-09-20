const fs = require('fs');
const path = require('path');

// 递归获取目录下所有文件
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// 解析 frontmatter
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontMatterRegex);
  
  if (match) {
    const frontMatter = match[1];
    const lines = frontMatter.split('\n');
    const result = {};
    
    let inTagsSection = false;
    const tags = [];
    
    for (const line of lines) {
      if (line.trim() === 'tags:') {
        inTagsSection = true;
        continue;
      }
      
      if (inTagsSection) {
        if (line.startsWith('  - ') || line.startsWith('- ')) {
          const tag = line.replace(/^[\s-]*/, '').trim().replace(/['"]/g, '');
          if (tag) tags.push(tag);
        } else if (line.includes(':')) {
          // 遇到其他字段，结束tags解析
          inTagsSection = false;
        }
      }
      
      if (line.includes('lang:')) {
        result.lang = line.split(':')[1].trim().replace(/['"]/g, '');
      }
    }
    
    result.tags = tags;
    return result;
  }
  
  return {};
}

// 统计标签
function countTags() {
  const blogDir = './src/content/blog';
  const files = getAllFiles(blogDir);
  
  const chinesePosts = [];
  const englishPosts = [];
  
  // 分别统计中英文文章
  files.forEach(file => {
    if (file.endsWith('.md')) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const frontMatter = parseFrontMatter(content);
        
        if (frontMatter.lang === 'zh') {
          chinesePosts.push({ file, tags: frontMatter.tags || [] });
        } else if (frontMatter.lang === 'en') {
          englishPosts.push({ file, tags: frontMatter.tags || [] });
        }
      } catch (error) {
        console.error('Error reading file:', file, error.message);
      }
    }
  });
  
  // 统计标签
  const chineseTags = {};
  const englishTags = {};
  
  chinesePosts.forEach(post => {
    post.tags.forEach(tag => {
      chineseTags[tag] = (chineseTags[tag] || 0) + 1;
    });
  });
  
  englishPosts.forEach(post => {
    post.tags.forEach(tag => {
      englishTags[tag] = (englishTags[tag] || 0) + 1;
    });
  });
  
  console.log('=== 中文文章标签统计 ===');
  console.log('文章数量:', chinesePosts.length);
  console.log('不重复标签数量:', Object.keys(chineseTags).length);
  console.log('标签总计数量:', Object.values(chineseTags).reduce((sum, count) => sum + count, 0));
  
  console.log('\n=== 英文文章标签统计 ===');
  console.log('文章数量:', englishPosts.length);
  console.log('不重复标签数量:', Object.keys(englishTags).length);
  console.log('标签总计数量:', Object.values(englishTags).reduce((sum, count) => sum + count, 0));
  
  // 按照标签页面的逻辑排序并显示前几个标签
  const sortedChineseTags = Object.entries(chineseTags)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
    
  const sortedEnglishTags = Object.entries(englishTags)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
  
  console.log('\n=== 中文标签页面显示 ===');
  console.log('标签数量:', sortedChineseTags.length);
  console.log('前10个标签:');
  sortedChineseTags.slice(0, 10).forEach(({ tag, count }, index) => {
    console.log(`  ${index + 1}. ${tag}: ${count}`);
  });
  
  console.log('\n=== 英文标签页面显示 ===');
  console.log('标签数量:', sortedEnglishTags.length);
  console.log('前10个标签:');
  sortedEnglishTags.slice(0, 10).forEach(({ tag, count }, index) => {
    console.log(`  ${index + 1}. ${tag}: ${count}`);
  });
  
  // 检查是否有标签数量为0的情况
  console.log('\n=== 检查空标签 ===');
  const zeroCountChineseTags = sortedChineseTags.filter(({ count }) => count === 0);
  const zeroCountEnglishTags = sortedEnglishTags.filter(({ count }) => count === 0);
  
  if (zeroCountChineseTags.length > 0) {
    console.log('中文标签中数量为0的标签:');
    zeroCountChineseTags.forEach(({ tag }) => console.log(`  ${tag}`));
  }
  
  if (zeroCountEnglishTags.length > 0) {
    console.log('英文标签中数量为0的标签:');
    zeroCountEnglishTags.forEach(({ tag }) => console.log(`  ${tag}`));
  }
  
  // 检查差异
  console.log('\n=== 差异分析 ===');
  console.log('中文标签数量 - 英文标签数量:', sortedChineseTags.length - sortedEnglishTags.length);
}

countTags();