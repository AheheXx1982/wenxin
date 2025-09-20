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

// 获取所有文章文件
function getAllPostFiles(lang) {
  const contentDir = path.join(__dirname, 'src', 'content', 'blog');
  const files = [];
  
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
          files.push(fullPath);
        }
      }
    }
  }
  
  walkDir(contentDir);
  return files;
}

// 获取文章数据
function getPostData(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    
    if (frontmatter) {
      return {
        path: filePath,
        data: frontmatter,
        hasContent: content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '').trim().length > 0
      };
    }
  } catch (e) {
    console.error(`Error reading file ${filePath}:`, e);
  }
  
  return null;
}

// 获取所有标签
function getAllTags(posts) {
  const tags = {};
  
  posts.forEach(post => {
    if (post && post.data && post.data.tags) {
      post.data.tags.forEach(tag => {
        if (!tags[tag]) {
          tags[tag] = 0;
        }
        tags[tag]++;
      });
    }
  });
  
  return tags;
}

// 主函数
function main() {
  console.log('=== 最终标签分析 ===\n');
  
  // 获取中文文章
  const zhFiles = getAllPostFiles('zh');
  console.log(`找到 ${zhFiles.length} 个中文文章文件`);
  
  const zhPosts = zhFiles.map(file => getPostData(file)).filter(Boolean);
  console.log(`成功解析 ${zhPosts.length} 个中文文章\n`);
  
  // 获取英文文章
  const enFiles = getAllPostFiles('en');
  console.log(`找到 ${enFiles.length} 个英文文章文件`);
  
  const enPosts = enFiles.map(file => getPostData(file)).filter(Boolean);
  console.log(`成功解析 ${enPosts.length} 个英文文章\n`);
  
  // 获取标签
  const zhTags = getAllTags(zhPosts);
  const enTags = getAllTags(enPosts);
  
  const zhTagCount = Object.keys(zhTags).length;
  const enTagCount = Object.keys(enTags).length;
  
  console.log(`中文标签总数: ${zhTagCount}`);
  console.log(`英文标签总数: ${enTagCount}`);
  console.log(`差异: ${zhTagCount - enTagCount}\n`);
  
  // 按出现次数排序标签
  const sortedZhTags = Object.entries(zhTags)
    .sort(([,a], [,b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
    
  const sortedEnTags = Object.entries(enTags)
    .sort(([,a], [,b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
  
  console.log('=== 中文标签列表 ===');
  sortedZhTags.forEach(({ tag, count }) => {
    console.log(`${tag}: ${count}`);
  });
  
  console.log('\n=== 英文标签列表 ===');
  sortedEnTags.forEach(({ tag, count }) => {
    console.log(`${tag}: ${count}`);
  });
  
  // 查找只在中文中出现的标签
  const zhOnlyTags = sortedZhTags.filter(({ tag }) => !enTags[tag]);
  if (zhOnlyTags.length > 0) {
    console.log('\n=== 只在中文中出现的标签 ===');
    zhOnlyTags.forEach(({ tag, count }) => {
      console.log(`${tag}: ${count}`);
    });
  }
  
  // 查找只在英文中出现的标签
  const enOnlyTags = sortedEnTags.filter(({ tag }) => !zhTags[tag]);
  if (enOnlyTags.length > 0) {
    console.log('\n=== 只在英文中出现的标签 ===');
    enOnlyTags.forEach(({ tag, count }) => {
      console.log(`${tag}: ${count}`);
    });
  }
  
  // 检查标签数量差异的文章
  console.log('\n=== 文章标签数量对比 ===');
  const allPosts = [...zhPosts, ...enPosts];
  const postPairs = {};
  
  allPosts.forEach(post => {
    // 提取文件名（不含语言路径和扩展名）
    const relativePath = path.relative(path.join(__dirname, 'src', 'content', 'blog'), post.path);
    const isEn = relativePath.startsWith('en' + path.sep);
    const fileName = isEn ? relativePath.substring(3) : relativePath;
    const baseName = fileName.replace(/\.md$/, '');
    
    if (!postPairs[baseName]) {
      postPairs[baseName] = {};
    }
    
    postPairs[baseName][isEn ? 'en' : 'zh'] = {
      path: post.path,
      tagCount: post.data.tags ? post.data.tags.length : 0,
      tags: post.data.tags || []
    };
  });
  
  Object.entries(postPairs).forEach(([baseName, pair]) => {
    const zhData = pair.zh || { tagCount: 0, tags: [] };
    const enData = pair.en || { tagCount: 0, tags: [] };
    
    if (zhData.tagCount !== enData.tagCount) {
      console.log(`${baseName}:`);
      console.log(`  中文标签数量: ${zhData.tagCount} - ${zhData.tags.join(', ')}`);
      console.log(`  英文标签数量: ${enData.tagCount} - ${enData.tags.join(', ')}`);
      console.log();
    }
  });
}

main();