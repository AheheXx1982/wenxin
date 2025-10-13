const Parser = require('rss-parser');

async function testRSS() {
  const parser = new Parser();
  
  try {
    console.log('正在获取 CoinTelegraph 的新闻...');
    const feed = await parser.parseURL('https://cointelegraph.com/rss');
    console.log(`获取到 ${feed.items.length} 条新闻`);
    console.log('第一条新闻的详细信息:');
    const item = feed.items[0];
    console.log(`标题: ${item.title}`);
    console.log(`包含中文: ${/[\u4e00-\u9fff]/.test(item.title)}`);
    console.log(`包含英文: ${/[a-zA-Z]/.test(item.title)}`);
    console.log(`链接: ${item.link}`);
    console.log(`发布日期: ${item.pubDate}`);
    console.log(`摘要: ${item.summary}`);
    console.log(`内容: ${item.content ? item.content.substring(0, 100) + '...' : '无'}`);
    console.log(`enclosure: ${JSON.stringify(item.enclosure)}`);
    console.log(`media: ${JSON.stringify(item.media)}`);
    if (item.content) {
      const imgMatch = item.content.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/i);
      console.log(`内容中的第一张图片: ${imgMatch ? imgMatch[1] : '无'}`);
    }
  } catch (error) {
    console.error('获取 CoinTelegraph 新闻时出错:', error.message);
  }
}

testRSS();