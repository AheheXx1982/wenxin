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
        } else if (line.includes(':') && !line.startsWith(' ') && !line.startsWith('\t')) {
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

// 检查所有文章
function checkAllPosts() {
  const blogDir = './src/content/blog';
  const files = getAllFiles(blogDir);
  
  const allPosts = [];
  
  // 收集所有文章
  files.forEach(file => {
    if (file.endsWith('.md')) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const frontMatter = parseFrontMatter(content);
        
        allPosts.push({ 
          file, 
          lang: frontMatter.lang || 'unknown',
          tags: frontMatter.tags || [],
          tagCount: (frontMatter.tags || []).length
        });
      } catch (error) {
        console.error('Error reading file:', file, error.message);
      }
    }
  });
  
  console.log('=== 所有文章统计 ===');
  console.log('总文章数:', allPosts.length);
  
  const langCounts = {};
  allPosts.forEach(post => {
    const lang = post.lang;
    langCounts[lang] = (langCounts[lang] || 0) + 1;
  });
  
  console.log('按语言分类:');
  Object.entries(langCounts).forEach(([lang, count]) => {
    console.log(`  ${lang}: ${count} 篇文章`);
  });
  
  // 显示没有语言标记的文章
  const noLangPosts = allPosts.filter(post => !post.lang || post.lang === 'unknown');
  if (noLangPosts.length > 0) {
    console.log('\n没有语言标记的文章:');
    noLangPosts.forEach(post => {
      console.log(`  ${post.file}`);
    });
  }
  
  // 显示标签数量为0的文章
  const noTagPosts = allPosts.filter(post => post.tagCount === 0);
  if (noTagPosts.length > 0) {
    console.log('\n没有标签的文章:');
    noTagPosts.forEach(post => {
      console.log(`  ${post.file} (${post.lang})`);
    });
  }
  
  // 按语言统计标签
  const chinesePosts = allPosts.filter(post => post.lang === 'zh');
  const englishPosts = allPosts.filter(post => post.lang === 'en');
  
  console.log('\n=== 中文文章详情 ===');
  console.log('文章数量:', chinesePosts.length);
  chinesePosts.forEach(post => {
    if (post.tagCount > 0) {
      console.log(`  ${path.basename(post.file)}: ${post.tagCount} 个标签`);
    }
  });
  
  console.log('\n=== 英文文章详情 ===');
  console.log('文章数量:', englishPosts.length);
  englishPosts.forEach(post => {
    if (post.tagCount > 0) {
      console.log(`  ${path.basename(post.file)}: ${post.tagCount} 个标签`);
    }
  });
}

checkAllPosts();