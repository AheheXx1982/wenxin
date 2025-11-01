#!/usr/bin/env node

/**
 * 测试工作流脚本
 * 验证自动新闻聚合系统的完整性
 */

const fs = require('fs').promises;
const path = require('path');

// 配置
const CONFIG = {
  WORKFLOW_FILE: path.join(__dirname, '../.github/workflows/direct-rss-news.yml'),
  AGGREGATOR_SCRIPT: path.join(__dirname, 'chinese-english-rss-aggregator.cjs'),
  NEWS_DIR_EN: path.join(__dirname, '../src/content/blog/en/crypto-news'),
  PACKAGE_JSON: path.join(__dirname, '../package.json')
};

// 日志函数
function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message) {
  console.error(`❌ ${message}`);
}

// 检查文件是否存在
async function checkFileExists(filePath, name) {
  try {
    await fs.access(filePath);
    logSuccess(`${name} 存在`);
    return true;
  } catch {
    logError(`${name} 不存在: ${filePath}`);
    return false;
  }
}

// 检查目录是否存在
async function checkDirectoryExists(dirPath, name) {
  try {
    const stats = await fs.stat(dirPath);
    if (stats.isDirectory()) {
      logSuccess(`${name} 目录存在`);
      return true;
    }
    logError(`${name} 不是目录: ${dirPath}`);
    return false;
  } catch {
    logError(`${name} 目录不存在: ${dirPath}`);
    return false;
  }
}

// 检查工作流配置
async function checkWorkflowConfig() {
  try {
    const content = await fs.readFile(CONFIG.WORKFLOW_FILE, 'utf8');
    
    const checks = [
      { pattern: /permissions:\s*\n\s*contents:\s*write/, name: '写入权限配置' },
      { pattern: /pnpm\/action-setup/, name: 'pnpm 设置' },
      { pattern: /chinese-english-rss-aggregator\.cjs/, name: '正确的聚合脚本' },
      { pattern: /workflow_dispatch/, name: '手动触发配置' }
    ];
    
    let allPassed = true;
    for (const check of checks) {
      if (check.pattern.test(content)) {
        logSuccess(`工作流包含 ${check.name}`);
      } else {
        logError(`工作流缺少 ${check.name}`);
        allPassed = false;
      }
    }
    
    return allPassed;
  } catch (error) {
    logError(`检查工作流配置失败: ${error.message}`);
    return false;
  }
}

// 检查 package.json
async function checkPackageJson() {
  try {
    const content = await fs.readFile(CONFIG.PACKAGE_JSON, 'utf8');
    const pkg = JSON.parse(content);
    
    const checks = [
      { key: 'rss-parser', name: 'rss-parser 依赖' },
      { key: 'html-entities', name: 'html-entities 依赖' }
    ];
    
    let allPassed = true;
    for (const check of checks) {
      if (pkg.dependencies && pkg.dependencies[check.key]) {
        logSuccess(`package.json 包含 ${check.name}`);
      } else {
        logError(`package.json 缺少 ${check.name}`);
        allPassed = false;
      }
    }
    
    // 检查脚本命令
    if (pkg.scripts && pkg.scripts['generate-news']) {
      logSuccess('package.json 包含 generate-news 脚本');
    } else {
      logError('package.json 缺少 generate-news 脚本');
      allPassed = false;
    }
    
    return allPassed;
  } catch (error) {
    logError(`检查 package.json 失败: ${error.message}`);
    return false;
  }
}

// 主函数
async function main() {
  try {
    logInfo('开始测试自动新闻聚合工作流...\n');
    
    let allPassed = true;
    
    // 1. 检查文件存在性
    logInfo('1️⃣ 检查必需文件');
    allPassed &= await checkFileExists(CONFIG.WORKFLOW_FILE, 'GitHub Actions 工作流文件');
    allPassed &= await checkFileExists(CONFIG.AGGREGATOR_SCRIPT, 'RSS 聚合脚本');
    allPassed &= await checkFileExists(CONFIG.PACKAGE_JSON, 'package.json');
    console.log('');
    
    // 2. 检查目录
    logInfo('2️⃣ 检查必需目录');
    allPassed &= await checkDirectoryExists(CONFIG.NEWS_DIR_EN, '英文新闻');
    console.log('');
    
    // 3. 检查工作流配置
    logInfo('3️⃣ 检查工作流配置');
    allPassed &= await checkWorkflowConfig();
    console.log('');
    
    // 4. 检查 package.json
    logInfo('4️⃣ 检查 package.json');
    allPassed &= await checkPackageJson();
    console.log('');
    
    // 总结
    if (allPassed) {
      logSuccess('🎉 所有检查通过！自动新闻聚合工作流配置正确。');
      logInfo('\n📋 下一步操作：');
      logInfo('1. 提交并推送到 GitHub');
      logInfo('2. 在 GitHub 仓库的 Actions 页面手动触发工作流测试');
      logInfo('3. 检查工作流运行日志确认正常工作');
    } else {
      logError('❌ 部分检查未通过，请修复上述问题。');
      process.exit(1);
    }
    
  } catch (error) {
    logError(`测试过程中出错: ${error.message}`);
    process.exit(1);
  }
}

// 执行主函数
if (require.main === module) {
  main();
}
