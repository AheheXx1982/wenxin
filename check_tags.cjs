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
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, value] = line.split(':').map(s => s.trim());
        if (key === 'tags') {
          // 解析 tags 数组
          const tagsMatch = value.match(/\[(.*)\]/);
          if (tagsMatch) {
            result.tags = tagsMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, ''));
          } else {
            // 处理多行标签格式
            const tags = [];
            let i = lines.indexOf(line) + 1;
            while (i < lines.length && !lines[i].includes(':')) {
              const tag = lines[i].trim().replace(/^-/, '').trim().replace(/['"]/g, '');
              if (tag) tags.push(tag);
              i++;
            }
            result.tags = tags;
          }
        } else if (key === 'lang') {
          result.lang = value.replace(/['"]/g, '');
        }
      }
    }
    
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
  
  console.log('=== 中文标签统计 ===');
  console.log('文章数量:', chinesePosts.length);
  console.log('标签数量:', Object.keys(chineseTags).length);
  console.log('标签详情:');
  Object.entries(chineseTags).sort((a, b) => b[1] - a[1]).forEach(([tag, count]) => {
    console.log(`  ${tag}: ${count}`);
  });
  
  console.log('\n=== 英文标签统计 ===');
  console.log('文章数量:', englishPosts.length);
  console.log('标签数量:', Object.keys(englishTags).length);
  console.log('标签详情:');
  Object.entries(englishTags).sort((a, b) => b[1] - a[1]).forEach(([tag, count]) => {
    console.log(`  ${tag}: ${count}`);
  });
  
  // 检查标签映射
  console.log('\n=== 标签映射检查 ===');
  const tagMap = {
    // 交易所相关标签
    '交易所': 'Exchanges',
    '加密货币': 'Cryptocurrency',
    '平台对比': 'Platform Comparison',
    '费用分析': 'Fee Analysis',
    '安全性': 'Security',
    
    // 资产配置相关标签
    '资产配置': 'Asset Allocation',
    '投资组合': 'Investment Portfolio',
    '税务规划': 'Tax Planning',
    '风险管理': 'Risk Management',
    '资本利得': 'Capital Gains',
    '股息策略': 'Dividend Strategy',
    '利息策略': 'Interest Strategy',
    
    // 期权相关标签
    '期权策略': 'Options Strategy',
    '备兑策略': 'Covered Call',
    '收益增强': 'Income Enhancement',
    '投资策略': 'Investment Strategy',
    '期权交易': 'Options Trading',
    '卖方策略': 'Selling Strategy',
    '收入生成': 'Income Generation',
    
    // 其他标签
    'Covered Call': 'Covered Call',
    'Income Strategy': 'Income Strategy',
    'Stock Holdings': 'Stock Holdings'
  };
  
  // 检查中英文标签是否匹配
  console.log('中文标签在英文标签中找不到映射的:');
  Object.keys(chineseTags).forEach(tag => {
    const enTag = tagMap[tag];
    if (!enTag || !Object.keys(englishTags).includes(enTag)) {
      console.log(`  ${tag} -> ${enTag || '未找到映射'}`);
    }
  });
  
  console.log('英文标签在中文标签中找不到映射的:');
  Object.keys(englishTags).forEach(tag => {
    const zhTag = Object.keys(tagMap).find(key => tagMap[key] === tag);
    if (!zhTag || !Object.keys(chineseTags).includes(zhTag)) {
      console.log(`  ${tag} -> ${zhTag || '未找到映射'}`);
    }
  });
  
  // 输出总数
  const totalChineseTags = Object.values(chineseTags).reduce((sum, count) => sum + count, 0);
  const totalEnglishTags = Object.values(englishTags).reduce((sum, count) => sum + count, 0);
  
  console.log('\n=== 总结 ===');
  console.log('中文标签总计:', totalChineseTags);
  console.log('英文标签总计:', totalEnglishTags);
  console.log('差异:', totalChineseTags - totalEnglishTags);
}

countTags();