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

// 更准确地解析 frontmatter
function parseFrontMatterAccurately(content) {
  const lines = content.split('\n');
  const result = {};
  let inFrontMatter = false;
  let inTagsSection = false;
  const tags = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 检查 frontmatter 开始
    if (line.trim() === '---' && !inFrontMatter) {
      inFrontMatter = true;
      continue;
    }
    
    // 检查 frontmatter 结束
    if (line.trim() === '---' && inFrontMatter) {
      break;
    }
    
    // 在 frontmatter 中处理
    if (inFrontMatter) {
      // 检查语言标记
      if (line.startsWith('lang:')) {
        result.lang = line.split(':')[1].trim().replace(/['"]/g, '');
      }
      
      // 检查 tags 部分开始
      if (line.startsWith('tags:')) {
        inTagsSection = true;
        continue;
      }
      
      // 在 tags 部分中解析标签
      if (inTagsSection) {
        if (line.startsWith('  - ') || line.startsWith('- ')) {
          const tag = line.replace(/^[\s-]*/, '').trim().replace(/['"]/g, '');
          if (tag) tags.push(tag);
        } else if (line.trim() !== '' && !line.startsWith('  ') && !line.startsWith('\t') && line.includes(':')) {
          // 遇到其他字段，结束 tags 部分
          inTagsSection = false;
        }
      }
    }
  }
  
  result.tags = tags;
  return result;
}

// 检查特殊字符
function checkSpecialChars() {
  const blogDir = './src/content/blog';
  const files = getAllFiles(blogDir);
  
  const allPosts = [];
  
  // 收集所有文章
  files.forEach(file => {
    if (file.endsWith('.md')) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const frontMatter = parseFrontMatterAccurately(content);
        
        allPosts.push({ 
          file, 
          lang: frontMatter.lang || 'zh',
          tags: frontMatter.tags || []
        });
      } catch (error) {
        console.error('Error reading file:', file, error.message);
      }
    }
  });
  
  // 分别处理中英文文章
  const chinesePosts = allPosts.filter(post => post.lang === 'zh');
  const englishPosts = allPosts.filter(post => post.lang === 'en');
  
  // 收集所有标签
  const chineseTags = [];
  const englishTags = [];
  
  chinesePosts.forEach(post => {
    post.tags.forEach(tag => {
      chineseTags.push({ tag, file: post.file });
    });
  });
  
  englishPosts.forEach(post => {
    post.tags.forEach(tag => {
      englishTags.push({ tag, file: post.file });
    });
  });
  
  console.log('=== 包含特殊字符的标签 ===');
  
  console.log('中文标签:');
  chineseTags.forEach(({ tag, file }) => {
    if (tag.includes('/') || tag.includes('\\') || tag.includes(':') || tag.includes('*') || tag.includes('?') || tag.includes('"') || tag.includes('<') || tag.includes('>') || tag.includes('|')) {
      console.log(`  "${tag}" in ${file}`);
    }
  });
  
  console.log('英文标签:');
  englishTags.forEach(({ tag, file }) => {
    if (tag.includes('/') || tag.includes('\\') || tag.includes(':') || tag.includes('*') || tag.includes('?') || tag.includes('"') || tag.includes('<') || tag.includes('>') || tag.includes('|')) {
      console.log(`  "${tag}" in ${file}`);
    }
  });
  
  // 检查包含空格的标签（前导或尾随）
  console.log('\n=== 包含前导或尾随空格的标签 ===');
  
  console.log('中文标签:');
  chineseTags.forEach(({ tag, file }) => {
    if (tag !== tag.trim()) {
      console.log(`  "${tag}" in ${file}`);
    }
  });
  
  console.log('英文标签:');
  englishTags.forEach(({ tag, file }) => {
    if (tag !== tag.trim()) {
      console.log(`  "${tag}" in ${file}`);
    }
  });
  
  // 检查重复标签（忽略大小写和空格）
  console.log('\n=== 可能的重复标签 ===');
  
  const normalizedChineseTags = chineseTags.map(({ tag, file }) => ({
    original: tag,
    normalized: tag.trim().toLowerCase(),
    file
  }));
  
  const normalizedEnglishTags = englishTags.map(({ tag, file }) => ({
    original: tag,
    normalized: tag.trim().toLowerCase(),
    file
  }));
  
  // 检查中文标签重复
  const chineseTagCounts = {};
  normalizedChineseTags.forEach(({ normalized }) => {
    chineseTagCounts[normalized] = (chineseTagCounts[normalized] || 0) + 1;
  });
  
  const duplicateChineseTags = Object.entries(chineseTagCounts)
    .filter(([, count]) => count > 1)
    .map(([tag]) => tag);
  
  if (duplicateChineseTags.length > 0) {
    console.log('中文重复标签:');
    duplicateChineseTags.forEach(tag => {
      const matches = normalizedChineseTags.filter(({ normalized }) => normalized === tag);
      console.log(`  "${tag}":`);
      matches.forEach(({ original, file }) => {
        console.log(`    "${original}" in ${file}`);
      });
    });
  }
  
  // 检查英文标签重复
  const englishTagCounts = {};
  normalizedEnglishTags.forEach(({ normalized }) => {
    englishTagCounts[normalized] = (englishTagCounts[normalized] || 0) + 1;
  });
  
  const duplicateEnglishTags = Object.entries(englishTagCounts)
    .filter(([, count]) => count > 1)
    .map(([tag]) => tag);
  
  if (duplicateEnglishTags.length > 0) {
    console.log('英文重复标签:');
    duplicateEnglishTags.forEach(tag => {
      const matches = normalizedEnglishTags.filter(({ normalized }) => normalized === tag);
      console.log(`  "${tag}":`);
      matches.forEach(({ original, file }) => {
        console.log(`    "${original}" in ${file}`);
      });
    });
  }
}

checkSpecialChars();