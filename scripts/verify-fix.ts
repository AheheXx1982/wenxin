import { getCategoryList, getPostsByCategory, getPostsByCategoryPath } from '../src/lib/content';

async function verifyFix() {
  console.log('=== 验证分类统计修复 ===');
  
  const { categories, countMap } = await getCategoryList();
  
  console.log('\n分类统计结果:');
  Object.entries(countMap).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} 篇文章`);
  });
  
  console.log('\n=== 验证具体分类文章数量 ===');
  
  // 验证期权研究院分类
  const optionAcademyPosts = await getPostsByCategory('期权研究院');
  console.log(`期权研究院分类文章数: ${optionAcademyPosts.length}`);
  
  // 验证实盘分享分类
  const tradingJournalPosts = await getPostsByCategory('实盘分享');
  console.log(`实盘分享分类文章数: ${tradingJournalPosts.length}`);
  
  // 验证嵌套分类 期权卖方策略
  const optionSellingPosts = await getPostsByCategoryPath(['现金流乌托邦', '期权卖方策略']);
  console.log(`现金流乌托邦/期权卖方策略分类文章数: ${optionSellingPosts.length}`);
  
  console.log('\n=== 分类结构 ===');
  console.log(JSON.stringify(categories, null, 2));
}

verifyFix().catch(console.error);