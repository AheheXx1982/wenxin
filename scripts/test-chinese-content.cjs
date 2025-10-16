#!/usr/bin/env node

/**
 * 测试脚本：验证中文版网站不会出现英文文章
 */

const fs = require('fs').promises;
const path = require('path');

// 配置
const CONFIG = {
  // 中文新闻目录
  NEWS_DIR_CN: path.join(__dirname, '../src/content/blog/crypto-news'),
  // 英文新闻目录
  NEWS_DIR_EN: path.join(__dirname, '../src/content/blog/en/crypto-news')
};

// 日志函数
function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logWarning(message) {
  console.warn(`⚠️  ${message}`);
}

function logError(message) {
  console.error(`❌ ${message}`);
}

// 检查目录中的文件
async function checkDirectory(dirPath, lang) {
  try {
    const files = await fs.readdir(dirPath);
    logInfo(`在${lang}目录中找到 ${files.length} 个文件`);
    
    // 检查是否有英文文章
    let englishArticles = 0;
    let chineseArticles = 0;
    
    for (const file of files) {
      if (path.extname(file) === '.md') {
        const filePath = path.join(dirPath, file);
        const content = await fs.readFile(filePath, 'utf8');
        
        // 检查 frontmatter 中的语言标记
        const langMatch = content.match(/lang:\s*(\w+)/);
        if (langMatch) {
          const fileLang = langMatch[1];
          if (fileLang === 'en') {
            englishArticles++;
          } else if (fileLang === 'zh') {
            chineseArticles++;
          }
        }
      }
    }
    
    logInfo(`${lang}目录中的文章语言分布:`);
    logInfo(`  - 英文文章: ${englishArticles}`);
    logInfo(`  - 中文文章: ${chineseArticles}`);
    
    return { englishArticles, chineseArticles, total: files.length };
  } catch (error) {
    logError(`检查目录 ${dirPath} 时出错: ${error.message}`);
    return { englishArticles: 0, chineseArticles: 0, total: 0 };
  }
}

// 主函数
async function main() {
  try {
    logInfo('开始测试中英文内容分发...');
    
    // 检查中文目录
    logInfo('检查中文目录...');
    const cnStats = await checkDirectory(CONFIG.NEWS_DIR_CN, '中文');
    
    // 检查英文目录
    logInfo('检查英文目录...');
    const enStats = await checkDirectory(CONFIG.NEWS_DIR_EN, '英文');
    
    // 验证结果
    logInfo('验证结果:');
    
    if (cnStats.englishArticles > 0) {
      logError(`❌ 发现问题: 中文目录中有 ${cnStats.englishArticles} 篇英文文章`);
      logWarning('这不应该发生，中文版网站应该只显示中文内容');
    } else {
      logSuccess('✅ 中文目录验证通过: 没有英文文章');
    }
    
    if (enStats.chineseArticles > 0) {
      logWarning(`⚠️  注意: 英文目录中有 ${enStats.chineseArticles} 篇中文文章`);
      logInfo('这可能是正常的，因为英文版网站可以显示翻译后的中文内容');
    } else {
      logInfo('ℹ️  英文目录中没有中文文章');
    }
    
    logSuccess('测试完成!');
    
  } catch (error) {
    logError(`测试过程中出错: ${error.message}`);
    process.exit(1);
  }
}

// 执行主函数
if (require.main === module) {
  main();
}