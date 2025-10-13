const Parser = require('rss-parser');

async function checkRSS() {
  const parser = new Parser({
    timeout: 10000 // 10秒超时
  });
  
  try {
    console.log('正在获取 CoinDesk 的新闻...');
    const feed = await parser.parseURL('https://www.coindesk.com/arc/outboundfeeds/rss/');
    console.log(`获取到 ${feed.items.length} 条新闻`);
    console.log('前3条新闻标题:');
    feed.items.slice(0, 3).forEach((item, i) => {
      console.log(`${i+1}. ${item.title}`);
      console.log(`   包含中文: ${/[\u4e00-\u9fff]/.test(item.title)}`);
      console.log(`   包含英文: ${/[a-zA-Z]/.test(item.title)}`);
    });
  } catch (error) {
    console.error('获取 CoinDesk 新闻时出错:', error.message);
  }
  
  try {
    console.log('\n正在获取 CoinTelegraph 的新闻...');
    const feed2 = await parser.parseURL('https://cointelegraph.com/rss');
    console.log(`获取到 ${feed2.items.length} 条新闻`);
    console.log('前3条新闻标题:');
    feed2.items.slice(0, 3).forEach((item, i) => {
      console.log(`${i+1}. ${item.title}`);
      console.log(`   包含中文: ${/[\u4e00-\u9fff]/.test(item.title)}`);
      console.log(`   包含英文: ${/[a-zA-Z]/.test(item.title)}`);
    });
  } catch (error) {
    console.error('获取 CoinTelegraph 新闻时出错:', error.message);
  }
}

checkRSS();