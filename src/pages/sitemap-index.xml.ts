import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { getSiteConfig } from '@lib/i18n';

// 转义 XML 特殊字符
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

export async function GET(context: APIContext) {
  const { site } = context;

  if (!site) {
    throw new Error('Missing site metadata');
  }

  // 获取所有博客文章（中文和英文）
  const allPosts = await getCollection('blog');

  // 确保 posts 存在且为数组
  const validPosts = allPosts && Array.isArray(allPosts) ? allPosts : [];

  // 分离中英文文章
  const zhPosts = validPosts.filter((post) => !(post.slug || '').startsWith('en/'));
  const enPosts = validPosts.filter((post) => (post.slug || '').startsWith('en/'));

  // 获取静态页面
  const staticPages = ['', 'about', 'investment', 'illusionary-thoughts', 'rss.xml'];
  const enStaticPages = ['en', 'en/about', 'en/investment', 'en/illusionary-thoughts', 'en/rss.xml'];

  // 生成中文文章URL列表
  const zhPostUrls = zhPosts.map((post) => {
    const postUrl = `${site}article/${post.data.link ?? (post.slug || '').split('/').pop() ?? post.slug}/`;
    const lastMod = post.data.date.toISOString().split('T')[0];
    return {
      loc: postUrl,
      lastmod: lastMod,
      changefreq: 'weekly',
      priority: 0.8,
    };
  });

  // 生成英文文章URL列表
  const enPostUrls = enPosts.map((post) => {
    const slug = post.slug.replace('en/', '');
    const postUrl = `${site}en/article/${post.data.link ?? slug.split('/').pop() ?? slug}/`;
    const lastMod = post.data.date.toISOString().split('T')[0];
    return {
      loc: postUrl,
      lastmod: lastMod,
      changefreq: 'weekly',
      priority: 0.8,
    };
  });

  // 生成中文静态页面URL列表
  const zhPageUrls = staticPages.map((page) => {
    const pageUrl = page ? `${site}${page}/` : `${site}`;
    return {
      loc: pageUrl,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: page === '' ? 1.0 : page === 'about' ? 0.7 : page === 'investment' ? 0.6 : page === 'illusionary-thoughts' ? 0.5 : 0.4,
    };
  });

  // 生成英文静态页面URL列表
  const enPageUrls = enStaticPages.map((page) => {
    const pageUrl = `${site}${page}/`;
    return {
      loc: pageUrl,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: page === 'en' ? 0.9 : page === 'en/about' ? 0.7 : page === 'en/investment' ? 0.6 : page === 'en/illusionary-thoughts' ? 0.5 : 0.4,
    };
  });

  // 合并所有URL
  const allUrls = [...zhPageUrls, ...enPageUrls, ...zhPostUrls, ...enPostUrls];

  // 生成sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}