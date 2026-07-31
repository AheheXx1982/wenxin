import os, re, glob

blog_dir = "D:/wenxin/src/content/blog"
articles = sorted(glob.glob(os.path.join(blog_dir, "**", "*.md"), recursive=True))

print(f"{'文章':<60s} | {'微信链接':<8s} | {'图片':<4s} | 状态")
print("-" * 100)

for f in articles:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    rel = os.path.relpath(f, blog_dir)
    
    # Find wechat links
    links = re.findall(r'https?://mp\.weixin\.qq\.com/s/\S+', content)
    
    # Count images
    images = re.findall(r'!\[[^\]]*\]\([^)]+\)', content)
    
    has_peitu = '## 配图' in content
    
    # Check where images are: before 配图 section or after
    peitu_idx = content.find('## 配图')
    inline_count = 0
    end_count = 0
    for img in images:
        pos = content.find(img)
        if peitu_idx > 0 and pos > peitu_idx:
            end_count += 1
        else:
            inline_count += 1
    
    wechat = "YES" if links else "NO"
    status = []
    if has_peitu: status.append("配图区")
    if end_count > 0: status.append(f"{end_count}图末尾")
    if inline_count > 0: status.append(f"{inline_count}图内嵌")
    
    print(f"{rel:<60s} | {wechat:<8s} | {len(images):<4d} | {' '.join(status)}")
    if links:
        print(f"{'':>60s} | {links[0][:60]}")

print()
print("=== 汇总 ===")
with_link = sum(1 for f in articles if re.findall(r'mp\.weixin\.qq\.com/s/\S+', open(f, encoding='utf-8').read()))
print(f"有微信链接: {with_link} / {len(articles)}")
