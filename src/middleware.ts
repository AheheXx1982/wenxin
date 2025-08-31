import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // 如果请求的是 /articles/1，则重定向到 /articles
  if (context.url.pathname === '/articles/1') {
    return context.redirect('/articles', 301);
  }

  const response = await next();
  return response;
});
