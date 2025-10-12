const Parser = require('rss-parser');

async function testChineseRSS() {
  const parser = new Parser();
  
  try {
    console.log('正在测试中文 RSS 源...');
    // 使用一个已知包含中文内容的源
    const feed = await parser.parseURL('https://www.chaincatcher.com/rss');
    console.log(`获取到 ${feed.items.length} 条新闻`);
  } catch (error) {
    console.error('测试中文 RSS 源时出错:', error.message);
  }
}

testChineseRSS();