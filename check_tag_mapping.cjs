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

// 检查标签映射关系
function checkTagMapping() {
  const contentDir = path.join(__dirname, 'src', 'content', 'blog');
  const articles = [];
  
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (stat.isFile() && item.endsWith('.md')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const frontmatter = parseFrontmatter(content);
          
          if (frontmatter) {
            articles.push({
              path: fullPath,
              relativePath: path.relative(contentDir, fullPath),
              lang: frontmatter.lang || 'zh',
              tags: frontmatter.tags || [],
              title: frontmatter.title || 'Unknown'
            });
          }
        } catch (e) {
          console.error(`Error reading file ${fullPath}:`, e);
        }
      }
    }
  }
  
  walkDir(contentDir);
  
  // 按语言分组
  const zhArticles = articles.filter(article => article.lang === 'zh');
  const enArticles = articles.filter(article => article.lang === 'en');
  
  console.log('=== 检查标签映射关系 ===\n');
  
  // 建立文章对
  const articlePairs = {};
  
  articles.forEach(article => {
    // 提取文件名（不含语言路径和扩展名）
    const isEn = article.relativePath.startsWith('en' + path.sep);
    const fileName = isEn ? article.relativePath.substring(3) : article.relativePath;
    const baseName = fileName.replace(/\.md$/, '');
    
    if (!articlePairs[baseName]) {
      articlePairs[baseName] = {};
    }
    
    articlePairs[baseName][isEn ? 'en' : 'zh'] = article;
  });
  
  console.log(`找到 ${Object.keys(articlePairs).length} 对文章\n`);
  
  // 定义已知的标签映射关系
  const tagMapping = {
    // 风险管理类
    '风险管理': 'Risk Management',
    '资产配置': 'Asset Allocation',
    '投资组合': 'Investment Portfolio',
    '税务规划': 'Tax Planning',
    '资本利得': 'Capital Gains',
    '股息策略': 'Dividend Strategy',
    '利息策略': 'Interest Strategy',
    '股息投资': 'Dividend Investment',
    '全球投资': 'Global Investment',
    '投资策略': 'Investment Strategy',
    '财务分析': 'Financial Analysis',
    '财务自由': 'Financial Freedom',
    '现金流': 'Cash Flow',
    '期权交易': 'Options Trading',
    '税务优化': 'Tax Optimization',
    '卖方策略': 'Selling Strategy',
    '收入生成': 'Income Generation',
    '期权策略': 'Options Strategy',
    '波动率交易': 'Volatility Trading',
    
    // 加密货币类
    '加密货币': 'Cryptocurrency',
    '区块链': 'Blockchain',
    '数字资产': 'Digital Assets',
    '技术文档': 'Technical Documentation',
    '基础知识': 'Basic Knowledge',
    '概念解释': 'Concept Explanation',
    '交易所': 'Exchanges',
    '平台对比': 'Platform Comparison',
    '费用分析': 'Fee Analysis',
    '安全性': 'Security',
    
    // 交易策略类
    '合约交易': 'Futures Trading',
    '杠杆交易': 'Leverage Trading',
    '技术分析': 'Technical Analysis',
    '仓位控制': 'Position Control',
    '止损策略': 'Stop Loss Strategy',
    '网格交易': 'Grid Trading',
    '交易策略': 'Trading Strategies',
    '自动化交易': 'Automated Trading',
    '市场波动率': 'Market Volatility',
    '市场分析': 'Market Analysis',
    
    // 人工智能类
    '人工智能': 'Artificial Intelligence',
    '算法交易': 'algorithmic-trading',
    '金融科技': 'fintech',
    '机器学习': 'Machine Learning',
    '智能投资': 'AI',
    '深度学习': 'Deep Learning',
    '大语言模型': 'Large Language Models',
    '技术发展': 'Technology Development',
    '应用案例': 'Application Cases',
    '未来趋势': 'Future Trends',
    '市场动态': 'Market Dynamics',
    '项目分析': 'Project Analysis',
    '行业趋势': 'Industry Trends',
    '投资风向': 'Investment Direction',
    '投资者教育': 'Investor Education',
    '监管动态': 'Regulatory Dynamics',
    '机构动向': 'Institutional Trends',
    '前沿科技': 'Frontier Technology',
    
    // 量子计算类
    '量子计算': 'Quantum Computing',
    '生物技术': 'Biotechnology',
    '技术趋势': 'Technology Trends',
    '未来预测': 'Future Prediction',
    '科技伦理': 'Technology Ethics',
    '量子比特': 'Qubits',
    '量子纠缠': 'Quantum Entanglement',
    '超导量子计算': 'Superconducting Quantum Computing',
    '离子阱量子计算': 'Ion Trap Quantum Computing',
    '光子量子计算': 'Photonic Quantum Computing',
    '拓扑量子计算': 'Topological Quantum Computing',
    
    // 金融衍生品类
    '金融衍生品': 'Financial Derivatives',
    '学习课程': 'Learning Course',
    '波动率分析': 'Volatility Analysis',
    'Greeks指标': 'Greeks Indicators',
    '牛市策略': 'Bull Strategy',
    '价差策略': 'Spread Strategy',
    '备兑策略': 'Covered Call',
    '收益增强': 'Income Strategy',
    '投资决策': 'Investment Decisions',
    '实盘记录': 'Live Trading Record',
    '交易复盘': 'Trading Review',
    '策略分析': 'Strategy Analysis'
  };
  
  // 检查每对文章的标签映射
  console.log('=== 标签映射检查 ===');
  let mismatchCount = 0;
  
  Object.entries(articlePairs).forEach(([baseName, pair]) => {
    const zhData = pair.zh || { tags: [], title: 'Unknown' };
    const enData = pair.en || { tags: [], title: 'Unknown' };
    
    console.log(`\n文章对: ${baseName}`);
    console.log(`  中文标题: ${zhData.title}`);
    console.log(`  英文标题: ${enData.title}`);
    console.log(`  中文标签: ${zhData.tags.join(', ')}`);
    console.log(`  英文标签: ${enData.tags.join(', ')}`);
    
    // 检查标签映射
    const zhTags = zhData.tags;
    const enTags = enData.tags;
    
    if (zhTags.length !== enTags.length) {
      mismatchCount++;
      console.log(`  ❌ 标签数量不匹配: 中文${zhTags.length} vs 英文${enTags.length}`);
      return;
    }
    
    // 检查每个标签是否有正确的映射
    let allMapped = true;
    for (let i = 0; i < zhTags.length; i++) {
      const zhTag = zhTags[i];
      const enTag = enTags[i];
      const expectedEnTag = tagMapping[zhTag];
      
      if (expectedEnTag && expectedEnTag !== enTag) {
        allMapped = false;
        console.log(`  ❌ 标签映射错误: ${zhTag} -> 应该是 "${expectedEnTag}", 实际是 "${enTag}"`);
      } else if (!expectedEnTag) {
        // 检查是否是反向映射
        const reverseMapping = Object.entries(tagMapping).find(([,en]) => en === zhTag);
        if (reverseMapping) {
          const [zh, en] = reverseMapping;
          if (enTag !== zh) {
            allMapped = false;
            console.log(`  ❌ 反向标签映射错误: ${zhTag} -> 应该是 "${zh}", 实际是 "${enTag}"`);
          }
        }
      }
    }
    
    if (allMapped && zhTags.length === enTags.length) {
      console.log(`  ✅ 标签映射正确`);
    } else {
      mismatchCount++;
    }
  });
  
  console.log(`\n=== 总结 ===`);
  console.log(`标签映射错误的文章对数量: ${mismatchCount}`);
  console.log(`总文章对数量: ${Object.keys(articlePairs).length}`);
  
  if (mismatchCount === 0) {
    console.log('✅ 所有文章对的标签映射都正确');
  } else {
    console.log('❌ 存在标签映射错误，请检查并修复');
  }
}

checkTagMapping();