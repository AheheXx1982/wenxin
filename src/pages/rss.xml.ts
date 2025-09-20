// edit https://github.com/lawvs/lawvs.github.io/blob/dba2e51e312765f8322ee87755b4e9c22b520048/src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getSortedPosts } from '@lib/content';
import { getSanitizeHtml } from '@lib/utils';
import { getSiteConfig } from '@lib/i18n';
import type { APIContext } from 'astro';
import sanitizeHtml from 'sanitize-html';
import type { BlogPost } from 'types/blog';

// 转义 XML 特殊字符
const escapeXml = (unsafe: string): string => {
  if (!unsafe) return '';
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
};

// 用于生成纯文本摘要的函数
const generateTextSummary = (html?: string, length: number = 150): string => {
  // 将HTML转换为纯文本（去除所有标签）
  const text = sanitizeHtml(html ?? '', {
    allowedTags: [], // 不允许任何标签
    allowedAttributes: {},
    textFilter: (text) => text.replace(/[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, ''),
  });
  // 截取指定长度，并确保不会截断词语
  if (text.length <= length) return text;
  return text.substring(0, length).replace(/\s+\S*$/, '');
};

// 生成中文RSS
async function generateZhRSS(context: APIContext) {
  // 获取中文版文章（默认语言）
  const posts = await getSortedPosts('zh');
  const { site } = context;

  if (!site) {
    throw new Error('Missing site metadata');
  }

  // 确保 posts 存在且为数组
  const validPosts = posts && Array.isArray(posts) ? posts : [];

  // 获取中文站点配置
  const siteConfig = getSiteConfig('zh');

  return rss({
    title: escapeXml(siteConfig.title),
    description: escapeXml(siteConfig.subtitle || 'No description'),
    site,
    trailingSlash: false,
    stylesheet: '/rss/cos-feed.xsl', // https://docs.astro.build/en/recipes/rss/#adding-a-stylesheet
    items: validPosts
      .map((post: BlogPost) => {
        // 确保 post 和 post.data 存在
        if (!post || !post.data) {
          return null;
        }

        try {
          // 生成描述信息，确保有回退方案
          let description = '';
          if (post.data?.description) {
            description = post.data.description;
          } else if (post.rendered?.html) {
            description = generateTextSummary(post.rendered.html);
          } else {
            description = 'No description available';
          }

          // 对标题和描述进行XML转义
          const title = escapeXml(post.data.title || 'Untitled');

          // 验证日期
          const pubDate = post.data.date && !isNaN(new Date(post.data.date).getTime()) ? post.data.date : new Date();

          // 生成链接，确保不会出现 undefined
          const postLink = post.data.link ? `/article/${post.data.link}` : `/article/${post.slug.split('/').pop() ?? 'post'}`;

          return {
            title: title,
            pubDate: pubDate,
            description: escapeXml(description),
            link: postLink,
            content: getSanitizeHtml(post.rendered?.html ?? ''),
          };
        } catch (error) {
          console.error(`Error processing post ${post.slug}:`, error);
          return null;
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .slice(0, 20),
  });
}

// 生成英文RSS
async function generateEnRSS(context: APIContext) {
  // 获取英文版文章
  const posts = await getSortedPosts('en');
  const { site } = context;

  if (!site) {
    throw new Error('Missing site metadata');
  }

  // 确保 posts 存在且为数组
  const validPosts = posts && Array.isArray(posts) ? posts : [];

  // 获取英文站点配置
  const siteConfig = getSiteConfig('en');

  return rss({
    title: escapeXml(`${siteConfig.title} - English`),
    description: escapeXml(siteConfig.subtitle || 'No description'),
    site: `${site}en/`,
    trailingSlash: false,
    stylesheet: '/rss/cos-feed.xsl',
    items: validPosts
      .map((post: BlogPost) => {
        // 确保 post 和 post.data 存在
        if (!post || !post.data) {
          return null;
        }

        try {
          // 生成描述信息，确保有回退方案
          let description = '';
          if (post.data?.description) {
            description = post.data.description;
          } else if (post.rendered?.html) {
            description = generateTextSummary(post.rendered.html);
          } else {
            description = 'No description available';
          }

          // 对标题和描述进行XML转义
          const title = escapeXml(post.data.title || 'Untitled');

          // 验证日期
          const pubDate = post.data.date && !isNaN(new Date(post.data.date).getTime()) ? post.data.date : new Date();

          // 生成链接，确保不会出现 undefined
          const postLink = post.data.link ? `/en/article/${post.data.link}` : `/en/article/${post.slug.replace('en/', '').split('/').pop() ?? 'post'}`;

          return {
            title: title,
            pubDate: pubDate,
            description: escapeXml(description),
            link: postLink,
            content: getSanitizeHtml(post.rendered?.html ?? ''),
          };
        } catch (error) {
          console.error(`Error processing post ${post.slug}:`, error);
          return null;
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .slice(0, 20),
  });
}

export async function GET(context: APIContext) {
  const { site } = context;
  
  if (!site) {
    throw new Error('Missing site metadata');
  }

  // 生成中英文RSS
  const zhRSS = await generateZhRSS(context);
  const enRSS = await generateEnRSS(context);

  // 生成RSS索引文件
  const rssIndex = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>SilentXx RSS Feeds</title>
    <description>RSS feeds for SilentXx blog</description>
    <link>${site}</link>
    <item>
      <title>Chinese RSS Feed</title>
      <description>RSS feed for Chinese content</description>
      <link>${site}rss.xml</link>
    </item>
    <item>
      <title>English RSS Feed</title>
      <description>RSS feed for English content</description>
      <link>${site}en/rss.xml</link>
    </item>
  </channel>
</rss>`;

  return new Response(rssIndex, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

// 导出中文RSS路由
export async function getZhRSS(context: APIContext) {
  return generateZhRSS(context);
}

// 导出英文RSS路由
export async function getEnRSS(context: APIContext) {
  return generateEnRSS(context);
}