# 文章封面图片系统

## 概述

本文档说明了如何为不同分类的文章配置和使用特定的封面图片。

## 图片获取逻辑

系统使用两种方式为文章获取封面图片：

1. **默认随机图片**：对于没有特定分类或未配置特定图片的文章，系统从 `defaultCoverList` 中随机选择图片。
2. **分类特定图片**：对于特定分类的文章，系统会根据文章的分类路径从对应的图片目录获取随机图片。

## 分类图片映射

分类到图片目录的映射在 `src/lib/cover.ts` 文件中的 `categoryImageMap` 对象中定义：

```typescript
const categoryImageMap: Record<string, string> = {
  'options/course': 'options',
  'options/strategy': 'options',
  'options/trading-journal': 'options',
  'crypto/grid': 'crypto',
  'crypto/futures': 'crypto',
  'crypto/crypto-wiki': 'crypto',
  'cashflow-utopia/option-selling': 'articles',
  'cashflow-utopia/drip': 'stock',
  'cashflow-utopia/asset-allocation': 'articles',
  'new-world-explore/ai': 'new-world-explore/ai',
  'new-world-explore/crypto-news': 'crypto', // crypto-news 直接使用 crypto 目录的图片
  'new-world-explore/quantum-universe': 'new-world-explore/quantum-universe',
};
```

## 图片目录结构

```plain
public/
├── img/
│   ├── articles/                    # 通用文章图片 (10张)
│   ├── crypto/                      # 加密货币相关图片 (15张)
│   ├── new-world-explore/           # 新世界探索相关图片
│   │   ├── ai/                      # 智能进化分类图片 (7张)
│   │   └── quantum-universe/        # 量子宇宙分类图片 (5张)
│   ├── options/                     # 期权相关图片 (10张)
│   ├── stock/                       # 股票相关图片 (11张)
```

## 使用方法

在需要获取文章封面图片的地方，使用以下函数：

```typescript
import { getRandomCoverForPath } from '@/lib/cover';

// 根据文章分类路径获取随机图片
const coverImage = getRandomCoverForPath('/categories/new-world-explore/crypto-news');
```

## 添加新的分类图片

1. 在 `public/img/` 目录下创建新的图片目录（如果尚不存在）
2. 将图片文件放入相应目录
3. 在 `src/lib/cover.ts` 中的 `categoryImageMap` 添加分类到图片目录的映射
4. 在 `getDefaultCoversForPath` 函数中添加新目录的图片列表

## 为新世界探索子分类添加图片

为"新世界探索"的子分类，我们创建了独立的目录结构：

1. `public/img/new-world-explore/ai/` - 用于智能进化分类的图片
2. `public/img/new-world-explore/quantum-universe/` - 用于量子宇宙分类的图片

加密风向标(crypto-news)分类直接使用 crypto 目录的图片，无需独立的图片目录。

各个目录中的图片已经按照阿拉伯数字顺序重命名：

- ai 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp
- crypto 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp, 8.webp, 9.webp, 10.webp, 11.webp, 12.webp, 13.webp, 14.webp, 15.webp
- quantum-universe 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp
- options 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp, 8.webp, 9.webp, 10.webp
- stock 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp, 8.webp, 9.webp, 10.jpg, 11.webp
- articles 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp, 8.webp, 9.webp, 10.webp

当特定分类目录中没有图片时，系统会回退到使用 articles 目录中的图片作为默认选择。

您可以将相应分类的图片放入这些目录中，系统会自动从对应目录获取随机图片。

## 注意事项

1. 图片文件应使用 `.webp` 格式以获得最佳性能（除了 stock 目录中的[10.jpg](file://d:\SilentXx\public\img\stock\10.jpg)）
2. 确保图片路径与 `categoryImageMap` 中的映射一致
3. 添加新的分类映射时，需要在 `getDefaultCoversForPath` 函数中实现对应的图片列表
4. 当您添加了实际图片后，系统会自动使用这些图片作为对应分类文章的封面
