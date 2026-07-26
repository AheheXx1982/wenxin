import type { BlogSchema } from 'types/blog';
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  link: z.string().optional(),
  date: z.coerce.date(),
  cover: z.string().optional(),
  tags: z.array(z.string()).optional(),
  // 兼容老 Hexo 博客
  subtitle: z.string().optional(),
  catalog: z.boolean().optional(),
  categories: z
    .array(z.string())
    .or(z.array(z.array(z.string())))
    .optional(),
  // 多语言支持
  lang: z.enum(['zh', 'en']).optional().default('zh'),
}) satisfies z.ZodType<BlogSchema & { lang?: 'zh' | 'en' }>;

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: blogSchema,
});

export const collections = {
  blog: blogCollection,
};
