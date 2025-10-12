#!/usr/bin/env node

/**
 * Auto-News 自动化设置脚本
 * 该脚本将帮助您自动配置整个新闻聚合系统
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');
const readline = require('readline');

// 创建 readline 接口用于用户输入
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 配置文件路径
const GITHUB_WORKFLOW_PATH = path.join(__dirname, '../.github/workflows/auto-news.yml');
const ENV_EXAMPLE_PATH = path.join(__dirname, '../.env.example');
const README_PATH = path.join(__dirname, '../README.md');

// 获取用户输入的函数
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// 检查文件是否存在
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// 创建 .env.example 文件
function createEnvExample() {
  const envContent = `# Auto-News 环境变量配置示例
# 将此文件复制为 .env 并填写您的实际值

# Notion 配置
NOTION_TOKEN=your_notion_integration_token
NOTION_ENTRY_PAGE_ID=your_notion_entry_page_id
NOTION_DATABASE_ID=your_notion_database_id

# OpenAI 配置 (可选，用于新闻摘要)
OPENAI_API_KEY=your_openai_api_key

# LLM 配置
LLM_PROVIDER=openai
OPENAI_MODEL=gpt-4o-mini

# 其他提供商配置示例 (如果使用 Google 或 Ollama)
# LLM_PROVIDER=google
# GOOGLE_MODEL=gemini-1.5-flash-latest
# GOOGLE_API_KEY=your_google_api_key

# LLM_PROVIDER=ollama
# OLLAMA_MODEL=llama3
# OLLAMA_URL=http://localhost:11434
`;

  fs.writeFileSync(ENV_EXAMPLE_PATH, envContent);
  console.log('✅ 已创建 .env.example 文件');
}

// 更新 README 文件，添加环境变量配置说明
function updateReadme() {
  if (!fileExists(README_PATH)) {
    console.log('⚠️  README.md 文件不存在，跳过更新');
    return;
  }

  let readmeContent = fs.readFileSync(README_PATH, 'utf8');
  
  // 检查是否已经添加过环境变量配置说明
  if (readmeContent.includes('环境变量配置')) {
    console.log('✅ README.md 中已包含环境变量配置说明');
    return;
  }
  
  // 在适当位置添加环境变量配置说明
  const setupSection = `
## 🔧 环境变量配置 / Environment Variables

要使用 Auto-News 系统，您需要配置以下环境变量：

\`\`\`bash
# 复制 .env.example 文件并重命名为 .env
cp .env.example .env

# 编辑 .env 文件，填写您的实际值
\`\`\`

详细配置说明请查看 [.env.example](.env.example) 文件。
`;

  // 在 "基本配置" 部分后添加环境变量配置
  readmeContent = readmeContent.replace(
    /(## 📋 环境要求 \/ Requirements[\s\S]*?---)/,
    `$1\n${setupSection}\n---`
  );
  
  fs.writeFileSync(README_PATH, readmeContent);
  console.log('✅ 已更新 README.md 文件');
}

// 创建 Notion 数据库结构
async function createNotionStructure(notion, parentPageId) {
  try {
    console.log('🔍 开始创建 Notion 数据库结构...');
    
    // 创建新闻数据库
    const database = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: parentPageId
      },
      title: [
        {
          type: 'text',
          text: {
            content: 'Crypto News Database'
          }
        }
      ],
      properties: {
        Title: {
          title: {}
        },
        Content: {
          rich_text: {}
        },
        Date: {
          date: {}
        },
        Tags: {
          multi_select: {
            options: [
              { name: '比特币', color: 'orange' },
              { name: '以太坊', color: 'purple' },
              { name: '稳定币', color: 'blue' },
              { name: '监管', color: 'red' },
              { name: '市场分析', color: 'green' },
              { name: '技术升级', color: 'yellow' },
              { name: 'DeFi', color: 'pink' },
              { name: 'NFT', color: 'brown' }
            ]
          }
        },
        Category: {
          select: {
            options: [
              { name: 'crypto-news', color: 'gray' },
              { name: 'market-analysis', color: 'blue' },
              { name: 'regulation', color: 'red' },
              { name: 'technology', color: 'purple' }
            ]
          }
        },
        Summary: {
          rich_text: {}
        },
        Source: {
          url: {}
        },
        Published: {
          checkbox: {}
        }
      }
    });
    
    console.log(`✅ 已创建 Notion 数据库: ${database.id}`);
    return database.id;
  } catch (error) {
    console.error('❌ 创建 Notion 数据库时出错:', error);
    throw error;
  }
}

// 添加示例数据到 Notion 数据库
async function addSampleData(notion, databaseId) {
  try {
    console.log('🔍 开始添加示例数据...');
    
    const sampleNews = [
      {
        title: '比特币价格突破新高',
        content: '比特币价格今日突破历史新高，达到前所未有的水平。市场分析师认为这可能是由于机构投资者的大量买入所致。技术指标显示，比特币的上涨趋势可能会持续一段时间，但投资者仍需谨慎关注市场波动。',
        date: new Date().toISOString().split('T')[0],
        tags: ['比特币', '加密货币', '市场分析'],
        category: 'crypto-news',
        summary: '比特币价格创新高，机构投资者大量买入推动上涨。',
        source: 'https://example.com/bitcoin-news'
      },
      {
        title: '以太坊2.0升级进展',
        content: '以太坊2.0的升级正在按计划进行，预计将大幅提升网络的处理能力和降低交易费用。开发者社区对这次升级充满期待，认为它将为去中心化应用的发展提供更好的基础设施支持。',
        date: new Date().toISOString().split('T')[0],
        tags: ['以太坊', '区块链', '技术升级'],
        category: 'technology',
        summary: '以太坊2.0升级进展顺利，将提升网络性能和降低费用。',
        source: 'https://example.com/ethereum-upgrade'
      },
      {
        title: '监管机构对稳定币的新规定',
        content: '多个国家的金融监管机构正在制定针对稳定币的新规定，旨在保护投资者并维护金融稳定。这些规定可能会影响稳定币的发行和使用，市场参与者正在密切关注监管动态。',
        date: new Date().toISOString().split('T')[0],
        tags: ['稳定币', '监管', '政策'],
        category: 'regulation',
        summary: '多国监管机构制定稳定币新规，市场密切关注。',
        source: 'https://example.com/stablecoin-regulation'
      }
    ];
    
    for (const news of sampleNews) {
      await notion.pages.create({
        parent: {
          database_id: databaseId
        },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: news.title
                }
              }
            ]
          },
          Content: {
            rich_text: [
              {
                text: {
                  content: news.content
                }
              }
            ]
          },
          Date: {
            date: {
              start: news.date
            }
          },
          Tags: {
            multi_select: news.tags.map(tag => ({ name: tag }))
          },
          Category: {
            select: {
              name: news.category
            }
          },
          Summary: {
            rich_text: [
              {
                text: {
                  content: news.summary
                }
              }
            ]
          },
          Source: {
            url: news.source
          },
          Published: {
            checkbox: true
          }
        }
      });
    }
    
    console.log('✅ 已添加示例数据到 Notion 数据库');
  } catch (error) {
    console.error('❌ 添加示例数据时出错:', error);
    throw error;
  }
}

// 主函数
async function main() {
  console.log('🚀 开始 Auto-News 自动化设置...');
  
  try {
    // 1. 创建 .env.example 文件
    createEnvExample();
    
    // 2. 更新 README 文件
    updateReadme();
    
    // 3. 获取用户配置
    console.log('\n📋 请提供以下配置信息:');
    const notionToken = await question('请输入 Notion 集成 Token: ');
    const entryPageId = await question('请输入 Notion 入口页面 ID: ');
    
    // 如果用户提供了配置信息，则继续设置 Notion 结构
    if (notionToken && entryPageId) {
      // 初始化 Notion 客户端
      const notion = new Client({ auth: notionToken });
      
      // 创建 Notion 数据库结构
      const databaseId = await createNotionStructure(notion, entryPageId);
      
      // 添加示例数据
      await addSampleData(notion, databaseId);
      
      console.log('\n✅ Notion 结构已创建完成!');
      console.log(`📊 数据库 ID: ${databaseId}`);
      console.log('📝 您可以在 .env 文件中使用此数据库 ID');
    }
    
    console.log('\n🎉 Auto-News 自动化设置已完成!');
    console.log('\n📝 下一步操作:');
    console.log('1. 复制 .env.example 为 .env: cp .env.example .env');
    console.log('2. 编辑 .env 文件，填写您的实际配置');
    console.log('3. 在 GitHub 仓库中设置相应的 secrets');
    console.log('4. 启用 GitHub Actions 工作流');
    
  } catch (error) {
    console.error('❌ 设置过程中出错:', error);
  } finally {
    rl.close();
  }
}

// 执行主函数
main();