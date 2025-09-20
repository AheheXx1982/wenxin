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
      
      // 检查 draft 标记
      if (line.startsWith('draft:')) {
        result.draft = line.split(':')[1].trim().replace(/['"]/g, '').toLowerCase() === 'true';
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

// 检查隐藏或草稿文章
function checkHiddenPosts() {
  const blogDir = './src/content/blog';
  const files = getAllFiles(blogDir);
  
  const allPosts = [];
  const draftPosts = [];
  const publishedPosts = [];
  
  // 收集所有文章
  files.forEach(file => {
    if (file.endsWith('.md')) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const frontMatter = parseFrontMatterAccurately(content);
        
        const post = { 
          file, 
          lang: frontMatter.lang || 'zh',
          tags: frontMatter.tags || [],
          draft: frontMatter.draft || false
        };
        
        allPosts.push(post);
        
        if (post.draft) {
          draftPosts.push(post);
        } else {
          publishedPosts.push(post);
        }
      } catch (error) {
        console.error('Error reading file:', file, error.message);
      }
    }
  });
  
  console.log('=== 文章状态统计 ===');
  console.log('总文章数:', allPosts.length);
  console.log('草稿文章数:', draftPosts.length);
  console.log('发布文章数:', publishedPosts.length);
  
  if (draftPosts.length > 0) {
    console.log('\n草稿文章:');
    draftPosts.forEach(post => {
      console.log(`  ${post.file} (${post.lang})`);
    });
  }
  
  // 按语言统计
  const chinesePosts = allPosts.filter(post => post.lang === 'zh');
  const englishPosts = allPosts.filter(post => post.lang === 'en');
  
  console.log('\n=== 按语言统计 ===');
  console.log('中文文章数:', chinesePosts.length);
  console.log('英文文章数:', englishPosts.length);
  
  // 检查是否有没有扩展名的文件
  console.log('\n=== 检查文件扩展名 ===');
  files.forEach(file => {
    if (!file.endsWith('.md')) {
      console.log('非md文件:', file);
    }
  });
}

checkHiddenPosts();