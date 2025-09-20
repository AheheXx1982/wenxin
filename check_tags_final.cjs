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

// 统计标签
function countTags() {
  const blogDir = './src/content/blog';
  const files = getAllFiles(blogDir);
  
  const chinesePosts = [];
  const englishPosts = [];
  const unknownPosts = [];
  
  // 分别统计中英文文章
  files.forEach(file => {
    if (file.endsWith('.md')) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const frontMatter = parseFrontMatterAccurately(content);
        
        if (frontMatter.lang === 'zh') {
          chinesePosts.push({ file, tags: frontMatter.tags || [] });
        } else if (frontMatter.lang === 'en') {
          englishPosts.push({ file, tags: frontMatter.tags || [] });
        } else {
          unknownPosts.push({ file, lang: frontMatter.lang, tags: frontMatter.tags || [] });
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
  
  console.log('=== 中文文章标签统计 ===');
  console.log('文章数量:', chinesePosts.length);
  console.log('不重复标签数量:', Object.keys(chineseTags).length);
  console.log('标签总计数量:', Object.values(chineseTags).reduce((sum, count) => sum + count, 0));
  
  console.log('\n=== 英文文章标签统计 ===');
  console.log('文章数量:', englishPosts.length);
  console.log('不重复标签数量:', Object.keys(englishTags).length);
  console.log('标签总计数量:', Object.values(englishTags).reduce((sum, count) => sum + count, 0));
  
  // 按照标签页面的逻辑排序并显示前几个标签
  const sortedChineseTags = Object.entries(chineseTags)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
    
  const sortedEnglishTags = Object.entries(englishTags)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
  
  console.log('\n=== 中文标签页面显示 ===');
  console.log('标签数量:', sortedChineseTags.length);
  console.log('前10个标签:');
  sortedChineseTags.slice(0, 10).forEach(({ tag, count }, index) => {
    console.log(`  ${index + 1}. ${tag}: ${count}`);
  });
  
  console.log('\n=== 英文标签页面显示 ===');
  console.log('标签数量:', sortedEnglishTags.length);
  console.log('前10个标签:');
  sortedEnglishTags.slice(0, 10).forEach(({ tag, count }, index) => {
    console.log(`  ${index + 1}. ${tag}: ${count}`);
  });
  
  // 检查差异
  console.log('\n=== 差异分析 ===');
  console.log('中文标签数量 - 英文标签数量:', sortedChineseTags.length - sortedEnglishTags.length);
  
  // 显示没有语言标记的文章
  if (unknownPosts.length > 0) {
    console.log('\n=== 未知语言标记的文章 ===');
    unknownPosts.forEach(post => {
      console.log(`  ${post.file}: ${post.lang || '无语言标记'}, ${post.tags.length} 个标签`);
    });
  }
  
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
}

countTags();