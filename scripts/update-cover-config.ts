#!/usr/bin/env node

/**
 * 自动更新封面图片配置的脚本
 * 该脚本会扫描 public/img 目录下的所有图片文件，
 * 并自动更新 src/lib/cover.ts 和 docs/cover-images.md 中的配置
 */

import * as fs from 'fs';
import * as path from 'path';

// 配置文件路径
const COVER_TS_PATH = path.join(__dirname, '../src/lib/cover.ts');
const COVER_MD_PATH = path.join(__dirname, '../docs/cover-images.md');
const SITE_CONFIG_PATH = path.join(__dirname, '../src/constants/site-config.ts');

// 图片目录路径
const IMG_DIR = path.join(__dirname, '../public/img');

// 扫描目录中的图片文件
function scanImageFiles(dirPath: string): string[] {
  const files: string[] = [];

  try {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // 递归扫描子目录
        files.push(...scanImageFiles(fullPath));
      } else if (stat.isFile() && (item.endsWith('.webp') || item.endsWith('.jpg') || item.endsWith('.png'))) {
        // 将文件路径转换为相对于 public 目录的路径
        const relativePath = '/' + path.relative(path.join(__dirname, '../public'), fullPath).replace(/\\/g, '/');
        files.push(relativePath);
      }
    }
  } catch (error) {
    console.error(`扫描目录 ${dirPath} 时出错:`, error);
  }

  return files;
}

// 根据目录分组图片文件
function groupImagesByDirectory(images: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};

  for (const image of images) {
    // 提取目录路径（移除文件名）
    const dir = path.dirname(image);
    const dirKey = dir.substring(1); // 移除开头的 '/'

    if (!groups[dirKey]) {
      groups[dirKey] = [];
    }

    groups[dirKey].push(image);
  }

  // 对每个目录中的图片按文件名排序
  for (const dir in groups) {
    groups[dir].sort((a, b) => {
      const aName = path.basename(a);
      const bName = path.basename(b);
      return aName.localeCompare(bName, undefined, { numeric: true });
    });
  }

  return groups;
}

// 更新 cover.ts 文件
function updateCoverTs(groups: Record<string, string[]>) {
  try {
    let content = fs.readFileSync(COVER_TS_PATH, 'utf-8');

    // 为每个目录生成图片列表
    for (const dir in groups) {
      const images = groups[dir];
      const caseKey = dir.replace(/\//g, '/');

      // 构造新的图片列表
      const imageList = images.map((img) => `        '${img}'`).join(',\n');
      const newCase = `    case '${caseKey}':\n      return [\n${imageList},\n      ];`;

      // 查找并替换对应的 case 语句
      const caseRegex = new RegExp(`\\s*case\\s+'${caseKey.replace(/\//g, '\\/')}':\\s*[\\s\\S]*?;`, 'g');
      if (caseRegex.test(content)) {
        content = content.replace(caseRegex, `\n${newCase}`);
      } else {
        // 如果找不到对应的 case，添加新的 case 到 switch 语句末尾
        const switchRegex = /(switch\s*\(dir\)\s*{[\s\S]*?)(}\s*case\s+'stock':\s*default:[\s\S]*?return\s*\[\];\s*})/;
        content = content.replace(switchRegex, `$1${newCase}\n$2`);
      }
    }

    fs.writeFileSync(COVER_TS_PATH, content, 'utf-8');
    console.log('✅ 成功更新 src/lib/cover.ts 文件');
  } catch (error) {
    console.error('❌ 更新 src/lib/cover.ts 文件时出错:', error);
  }
}

// 更新 site-config.ts 文件中的 defaultCoverList
function updateSiteConfig(groups: Record<string, string[]>) {
  try {
    let content = fs.readFileSync(SITE_CONFIG_PATH, 'utf-8');

    // 获取 articles 目录的图片
    const articlesImages = groups['articles'] || [];

    // 构造新的 defaultCoverList
    const imageList = articlesImages.map((img) => `  '${img}'`).join(',\n');
    const newDefaultCoverList = `export const defaultCoverList = [\n${imageList},\n];`;

    // 替换 defaultCoverList
    const defaultCoverListRegex = /export\s+const\s+defaultCoverList\s*=\s*\[[\s\S]*?\];/;
    content = content.replace(defaultCoverListRegex, newDefaultCoverList);

    fs.writeFileSync(SITE_CONFIG_PATH, content, 'utf-8');
    console.log('✅ 成功更新 src/constants/site-config.ts 文件');
  } catch (error) {
    console.error('❌ 更新 src/constants/site-config.ts 文件时出错:', error);
  }
}

// 更新文档文件
function updateDocumentation(groups: Record<string, string[]>) {
  try {
    let content = fs.readFileSync(COVER_MD_PATH, 'utf-8');

    // 生成新的图片列表文档
    let newImageList = '';
    for (const dir in groups) {
      const images = groups[dir];
      const dirName = dir.split('/').pop() || dir;
      newImageList += `- ${dirName} 目录：${images.map((img) => path.basename(img)).join(', ')}\n`;
    }

    // 替换文档中的图片列表部分
    const imageListRegex = /各个目录中的图片已经按照阿拉伯数字顺序重命名：[\s\S]*?当特定分类目录中没有图片时/;
    const newImageListSection = `各个目录中的图片已经按照阿拉伯数字顺序重命名：\n\n${newImageList}\n当特定分类目录中没有图片时`;
    content = content.replace(imageListRegex, newImageListSection);

    fs.writeFileSync(COVER_MD_PATH, content, 'utf-8');
    console.log('✅ 成功更新 docs/cover-images.md 文件');
  } catch (error) {
    console.error('❌ 更新 docs/cover-images.md 文件时出错:', error);
  }
}

// 主函数
function main() {
  console.log('🔍 开始扫描图片目录...');

  // 扫描所有图片文件
  const allImages = scanImageFiles(IMG_DIR);
  console.log(`📁 找到 ${allImages.length} 个图片文件`);

  // 按目录分组
  const groupedImages = groupImagesByDirectory(allImages);
  console.log(`📂 发现 ${Object.keys(groupedImages).length} 个图片目录`);

  // 更新配置文件
  updateCoverTs(groupedImages);
  updateSiteConfig(groupedImages);
  updateDocumentation(groupedImages);

  console.log('✅ 所有配置文件已更新完成');
}

// 执行主函数
main();
