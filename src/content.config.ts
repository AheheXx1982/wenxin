import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    slug: z.string().optional(),
    tags: z.array(z.string()).optional(),
    categories: z
      .array(z.string())
      .or(z.array(z.array(z.string())))
      .optional(),
    lang: z.string().optional(),
    cover: z.string().optional(),
    bgImage: z.string().optional(),
    hidden: z.boolean().optional(),
    featured: z.boolean().optional(), // 置顶文章：首页优先显示
    series: z.string().optional(), // 系列名（如"按摩不归路"），同系列自动串联上下篇
    seriesOrder: z.number().optional(), // 系列内顺序（1=第一篇）
    source: z.string().optional(),
    type: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
