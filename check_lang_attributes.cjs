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
          lang: frontmatter.lang || 'zh' // 默认为中文
        });
      }
    } catch (error) {
      console.error(`解析文件失败: ${filePath}`, error.message);
    }
  });
  
  console.log(`总共解析了 ${posts.length} 篇文章`);
  
  const zhPosts = posts.filter(post => post.lang === 'zh');
  const enPosts = posts.filter(post => post.lang === 'en');
  
  console.log(`中文文章数量: ${zhPosts.length}`);
  console.log(`英文文章数量: ${enPosts.length}`);
  
  if (zhPosts.length !== enPosts.length) {
    console.log('\n语言分布不均:');
    console.log('中文文章:');
    zhPosts.forEach(post => {
      console.log(`  ${post.filePath}`);
    });
    
    console.log('\n英文文章:');
    enPosts.forEach(post => {
      console.log(`  ${post.filePath}`);
    });
  }
  
  // 检查是否有文章没有lang属性
  const noLangPosts = posts.filter(post => !post.data.lang);
  if (noLangPosts.length > 0) {
    console.log('\n没有lang属性的文章:');
    noLangPosts.forEach(post => {
      console.log(`  ${post.filePath}`);
    });
  }
}

checkLangAttributes();