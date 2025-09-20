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

// 检查所有文章的lang属性
function checkLangAttributes() {
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
          hasLang: !!frontmatter.lang
        });
      }
    } catch (error) {
      console.error(`解析文件失败: ${filePath}`, error.message);
    }
  });
  
  console.log(`总共解析了 ${posts.length} 篇文章`);
  
  // 检查是否有文章没有lang属性
  const noLangPosts = posts.filter(post => !post.hasLang);
  if (noLangPosts.length > 0) {
    console.log('\n没有lang属性的文章:');
    noLangPosts.forEach(post => {
      console.log(`  ${post.filePath}`);
    });
  } else {
    console.log('\n所有文章都有lang属性');
  }
  
  // 检查是否有重复的文章（相同路径但不同语言）
  const filePaths = posts.map(post => post.filePath.replace(/\\en\\/, '\\').replace(/\/en\//, '/'));
  const uniquePaths = [...new Set(filePaths)];
  
  if (filePaths.length !== uniquePaths.length) {
    console.log('\n发现重复路径:');
    const pathCounts = {};
    filePaths.forEach(path => {
      pathCounts[path] = (pathCounts[path] || 0) + 1;
    });
    
    Object.entries(pathCounts).forEach(([path, count]) => {
      if (count > 1) {
        console.log(`  ${path}: ${count} 次`);
      }
    });
  }
}

checkLangAttributes();