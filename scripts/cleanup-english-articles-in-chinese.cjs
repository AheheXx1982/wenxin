#!/usr/bin/env node

/**
 * 清理脚本：删除中文目录中的英文文章
 */

const fs = require('fs').promises;
const path = require('path');

// 配置
const CONFIG = {
  // 中文新闻目录
  NEWS_DIR_CN: path.join(__dirname, '../src/content/blog/crypto-news')
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

// 清理中文目录中的英文文章
async function cleanupEnglishArticles() {
  try {
    const files = await fs.readdir(CONFIG.NEWS_DIR_CN);
    logInfo(`在中文目录中找到 ${files.length} 个文件`);
    
    let deletedCount = 0;
    
    for (const file of files) {
      if (path.extname(file) === '.md') {
        const filePath = path.join(CONFIG.NEWS_DIR_CN, file);
        const content = await fs.readFile(filePath, 'utf8');
        
        // 检查 frontmatter 中的语言标记
        const langMatch = content.match(/lang:\s*(\w+)/);
        if (langMatch) {
          const fileLang = langMatch[1];
          if (fileLang === 'en') {
            // 删除英文文章
            await fs.unlink(filePath);
            logWarning(`已删除中文目录中的英文文章: ${file}`);
            deletedCount++;
          }
        }
      }
    }
    
    logSuccess(`清理完成，共删除了 ${deletedCount} 篇英文文章`);
    
  } catch (error) {
    logError(`清理过程中出错: ${error.message}`);
    process.exit(1);
  }
}

// 主函数
async function main() {
  try {
    logInfo('开始清理中文目录中的英文文章...');
    await cleanupEnglishArticles();
    logSuccess('清理完成!');
    
  } catch (error) {
    logError(`清理过程中出错: ${error.message}`);
    process.exit(1);
  }
}

// 执行主函数
if (require.main === module) {
  main();
}