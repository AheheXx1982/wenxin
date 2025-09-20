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

// 检查包含特殊字符的标签
function checkSpecialTags() {
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
          lang: frontMatter.lang || 'zh', // 默认为中文
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
  
  console.log('=== 包含斜杠的标签 ===');
  
  console.log('中文标签:');
  chineseTags.forEach(({ tag, file }) => {
    if (tag.includes('/')) {
      console.log(`  "${tag}" in ${file}`);
    }
  });
  
  console.log('英文标签:');
  englishTags.forEach(({ tag, file }) => {
    if (tag.includes('/')) {
      console.log(`  "${tag}" in ${file}`);
    }
  });
  
  console.log('\n=== 包含其他特殊字符的标签 ===');
  
  console.log('中文标签:');
  chineseTags.forEach(({ tag, file }) => {
    if (tag.includes('\\') || tag.includes(':') || tag.includes('*') || tag.includes('?') || tag.includes('"') || tag.includes('<') || tag.includes('>') || tag.includes('|')) {
      console.log(`  "${tag}" in ${file}`);
    }
  });
  
  console.log('英文标签:');
  englishTags.forEach(({ tag, file }) => {
    if (tag.includes('\\') || tag.includes(':') || tag.includes('*') || tag.includes('?') || tag.includes('"') || tag.includes('<') || tag.includes('>') || tag.includes('|')) {
      console.log(`  "${tag}" in ${file}`);
    }
  });
  
  // 检查包含空格的标签
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
}

checkSpecialTags();