const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// 更准确的 frontmatter 解析函数
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const frontmatter = match[1];
  
  try {
    // 使用 yaml 解析 frontmatter
    const data = yaml.load(frontmatter);
    return data;
  } catch (error) {
    console.error('YAML 解析失败:', error.message);
    return null;
  }
}

// 获取所有文章文件路径
function getAllPostPaths(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    
    if (stat && stat.isDirectory()) {
      results = [...results, ...getAllPostPaths(file)];
    } else if (path.extname(file) === '.md') {
      results.push(file);
    }
  });
  
  return results;
}

// 检查重复路径的文章
function checkDuplicatePaths() {
  const postsDir = path.join(__dirname, 'src', 'content', 'blog');
  const allPostPaths = getAllPostPaths(postsDir);
  
  const posts = [];
  allPostPaths.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatter = parseFrontmatter(content);
      
      if (frontmatter) {
        posts.push({
          data: frontmatter,
          filePath: path.relative(__dirname, filePath),
          lang: frontmatter.lang || 'zh'
        });
      }
    } catch (error) {
      console.error(`解析文件失败: ${filePath}`, error.message);
    }
  });
  
  // 按相对路径分组（去除语言标识）
  const groupedPosts = {};
  posts.forEach(post => {
    // 提取相对路径，去除语言标识
    let relativePath = post.filePath.replace(/src\\content\\blog\\en\\/, 'src\\content\\blog\\');
    relativePath = relativePath.replace(/src\/content\/blog\/en\//, 'src\/content\/blog\/');
    
    if (!groupedPosts[relativePath]) {
      groupedPosts[relativePath] = [];
    }
    groupedPosts[relativePath].push(post);
  });
  
  // 检查每组是否都有中英文版本
  Object.entries(groupedPosts).forEach(([relativePath, versions]) => {
    if (versions.length > 1) {
      console.log(`路径: ${relativePath}`);
      versions.forEach(version => {
        console.log(`  ${version.lang}: ${version.filePath}`);
      });
      console.log('');
    } else {
      const version = versions[0];
      console.log(`只有单一版本的路径: ${relativePath}`);
      console.log(`  ${version.lang}: ${version.filePath}`);
      console.log('');
    }
  });
}

checkDuplicatePaths();