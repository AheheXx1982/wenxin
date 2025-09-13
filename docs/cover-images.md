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
  'options/course': 'options/course',
  'options/strategy': 'options/strategy',
  'options/trading-journal': 'options/trading-journal',
  'options/option-selling': 'options/option-selling',
  'crypto/grid': 'crypto/grid',
  'crypto/futures': 'crypto/futures',
  'crypto/crypto-wiki': 'crypto/crypto-wiki',
  'crypto/crypto-news': 'crypto/crypto-news',
  'cashflow-utopia/drip': 'cashflow-utopia/drip',
  'cashflow-utopia/asset-allocation': 'cashflow-utopia/asset-allocation',
  'cashflow-utopia/option-selling': 'options/option-selling',
  'new-world-explore/ai': 'new-world-explore/ai',
  'new-world-explore/crypto-news': 'new-world-explore/crypto-news',
  'new-world-explore/quantum-universe': 'new-world-explore/quantum-universe',
};
```

## 图片目录结构

```plain
public/
├── img/
│   ├── articles/                    # 通用文章图片 (10张)
│   ├── crypto/                      # 加密货币相关图片 (6张)
│   │   ├── crypto-news/             # 加密风向标分类图片 (8张)
│   │   ├── crypto-wiki/             # 加密百科分类图片 (8张)
│   │   ├── futures/                 # 合约交易分类图片 (8张)
│   │   └── grid/                    # 网格策略分类图片 (8张)
│   ├── new-world-explore/           # 新世界探索相关图片 (2张)
│   │   ├── ai/                      # 智能进化分类图片 (7张)
│   │   ├── crypto-news/             # 加密风向标分类图片 (2张)
│   │   └── quantum-universe/        # 量子宇宙分类图片 (5张)
│   ├── options/                     # 期权相关图片 (3张)
│   │   ├── course/                  # 期权课程分类图片 (7张)
│   │   ├── option-selling/          # 期权卖方策略分类图片 (8张)
│   │   ├── strategy/                # 策略分析分类图片 (10张)
│   │   └── trading-journal/         # 实盘分享分类图片 (7张)
│   └── stock/                       # 股票相关图片 (11张)
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
3. `public/img/new-world-explore/crypto-news/` - 用于加密风向标分类的图片

同时，我们也为"加密实验室"的子分类创建了独立的目录结构：

1. `public/img/crypto/crypto-news/` - 用于加密风向标分类的图片
2. `public/img/crypto/grid/` - 用于网格策略分类的图片
3. `public/img/crypto/futures/` - 用于合约交易分类的图片
4. `public/img/crypto/crypto-wiki/` - 用于加密百科分类的图片

现金流乌托邦的子分类也有独立的目录结构：

1. `public/img/cashflow-utopia/drip/` - 用于全球高息股轮动分类的图片
2. `public/img/cashflow-utopia/asset-allocation/` - 用于资产配置分类的图片
3. `public/img/options/option-selling/` - 用于期权卖方策略分类的图片（注意：这个分类的图片存储在 options 目录下）

期权研究院的子分类也有独立的目录结构：

1. `public/img/options/course/` - 用于期权课程分类的图片
2. `public/img/options/strategy/` - 用于策略分析分类的图片
3. `public/img/options/trading-journal/` - 用于实盘分享分类的图片
4. `public/img/options/option-selling/` - 用于期权卖方策略分类的图片

各个目录中的图片已经按照阿拉伯数字顺序重命名：

- 404 目录：1.webp, 2.webp, 3.webp, 4.webp
- articles 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp, 8.webp, 9.webp, 10.webp, 11.webp
- img 目录：banner.webp, SilentXx.webp
- cashflow-utopia 目录：1.webp, 2.webp, 3.webp, 4.webp
- asset-allocation 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp
- drip 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp, 8.webp, 9.webp
- crypto 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp
- crypto-news 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp, 8.webp
- crypto-wiki 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp, 8.webp
- futures 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp, 8.webp
- grid 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp, 8.webp, 9.webp
- effects 目录：holo.webp
- new-world-explore 目录：1.webp, 2.webp
- ai 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp
- crypto-news 目录：1.webp, 2.webp
- quantum-universe 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp
- options 目录：1.webp, 2.webp, 3.webp
- course 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp
- option-selling 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp, 8.webp
- strategy 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp, 8.webp, 9.webp, 10.webp
- trading-journal 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.webp
- stock 目录：1.webp, 2.webp, 3.webp, 4.webp, 5.webp, 6.webp, 7.jpg, 8.webp

当特定分类目录中没有图片时，系统会回退到使用 articles 目录中的图片作为默认选择。

您可以将相应分类的图片放入这些目录中，系统会自动从对应目录获取随机图片。

## 注意事项

1. 图片文件应使用 `.webp` 格式以获得最佳性能（除了 stock 目录中的[10.jpg](file://d:\SilentXx\public\img\stock\10.jpg)）
2. 确保图片路径与 `categoryImageMap` 中的映射一致
3. 添加新的分类映射时，需要在 `getDefaultCoversForPath` 函数中实现对应的图片列表
4. 当您添加了实际图片后，系统会自动使用这些图片作为对应分类文章的封面
5. 每次添加、删除或修改分类图片时，都应更新 `src/lib/cover.ts` 中的图片列表，并验证其与文件系统中实际存在的图片文件一致
