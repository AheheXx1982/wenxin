import os, re, glob

blog_dir = "D:/wenxin/src/content/blog"
articles = sorted(glob.glob(os.path.join(blog_dir, "**", "*.md"), recursive=True))

results = []
for f in articles:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    rel = os.path.relpath(f, blog_dir)
    
    # 1. Check footer text
    has_footer = "作者简介" in content or "背很驼" in content or "骆驼你个祥子" in content
    
    # 2. Check image positions
    fm_end = content.find('---', 4)  # second ---
    body = content[fm_end+3:] if fm_end > 0 else content
    
    images = re.findall(r'!\[([^\]]*)\]\(([^)]+)\)', body)
    has_peitu = '## 配图' in body or '## 配图' in content
    source_idx = body.find('文章来源')
    peitu_idx = body.find('## 配图')
    
    inline = []
    end_gallery = []
    for name, url in images:
        pos = body.find(f'![{name}]({url})')
        if peitu_idx > 0 and pos > peitu_idx:
            end_gallery.append(url)
        elif source_idx > 0 and pos > source_idx:
            end_gallery.append(url)
        else:
            inline.append(url)
    
    has_center = 'align="center"' in body or 'text-align:center' in body or '<center>' in body
    
    results.append({
        "file": rel,
        "has_footer": has_footer,
        "has_peitu_section": has_peitu,
        "total_images": len(images),
        "inline_images": len(inline),
        "end_gallery_images": len(end_gallery),
        "has_center_align": has_center,
    })

for r in results:
    flags = []
    if r["has_footer"]: flags.append("FOOTER残留")
    if r["has_peitu_section"]: flags.append("配图区")
    if r["end_gallery_images"] > 0: flags.append(f"{r['end_gallery_images']}图在末尾")
    if not r["has_center_align"] and r["total_images"] > 0: flags.append("无居中")
    status = ", ".join(flags) if flags else "OK"
    print(f"{r['file']:60s} | imgs={r['total_images']:2d} | {status}")
