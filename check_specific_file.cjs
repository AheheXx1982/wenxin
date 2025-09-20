const fs = require('fs');

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
      // 更准确地检测tags部分的开始
      if (line.trim().startsWith('tags:')) {
        inTagsSection = true;
        // 检查是否在同一行有标签（内联格式）
        const inlineTagsMatch = line.match(/tags:\s*\[(.*)\]/);
        if (inlineTagsMatch) {
          const inlineTags = inlineTagsMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, ''));
          tags.push(...inlineTags);
          inTagsSection = false; // 内联格式，结束tags部分
        }
        continue;
      }
      
      // 检查语言标记
      if (line.startsWith('lang:')) {
        result.lang = line.split(':')[1].trim().replace(/['"]/g, '');
      }
      
      // 解析列表格式的标签
      if (inTagsSection) {
        if (line.startsWith('  - ') || line.startsWith('- ')) {
          const tag = line.replace(/^[\s-]*/, '').trim().replace(/['"]/g, '');
          if (tag) tags.push(tag);
        } else if (line.includes(':') && line.indexOf(':') === line.trim().indexOf(':')) {
          // 遇到其他顶层字段，结束tags解析
          inTagsSection = false;
        }
      }
    }
    
    result.tags = tags;
    return result;
  }
  
  return {};
}

// 检查特定文件
function checkSpecificFile() {
  const file = './src/content/blog/en/crypto/index.md';
  const content = fs.readFileSync(file, 'utf8');
  const frontMatter = parseFrontMatter(content);
  
  console.log('文件:', file);
  console.log('语言:', frontMatter.lang || '未识别');
  console.log('标签数量:', (frontMatter.tags || []).length);
  console.log('标签列表:', frontMatter.tags || []);
}

checkSpecificFile();