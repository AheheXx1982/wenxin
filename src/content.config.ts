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
    source: z.string().optional(),
    type: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
