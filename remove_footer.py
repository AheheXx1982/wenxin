import os, re, glob

blog_dir = "D:/wenxin/src/content/blog"

# The footer block to remove (with variations)
patterns = [
    # 完整块：作者简介：笔名骆驼你个祥子，简称祥子。\n\n骆驼只是因为背很驼~
    re.compile(r'作者简介：?笔名骆驼你个祥子，简称祥子。\s*\n\s*\n?\s*骆驼只是因为背很驼~?', re.DOTALL),
    # 单独一行
    re.compile(r'\n?作者简介：?笔名骆驼你个祥子，简称祥子。?\s*', re.DOTALL),
    re.compile(r'\n?骆驼只是因为背很驼~?\s*', re.DOTALL),
    # 带引用格式的
    re.compile(r'\n?>?\s*作者简介.*?背很驼~?\s*', re.DOTALL),
]

changed = []
for f in glob.glob(os.path.join(blog_dir, "**", "*.md"), recursive=True):
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    orig = content
    for pat in patterns:
        content = pat.sub('', content)
    
    # Clean up double blank lines left behind
    content = re.sub(r'\n{4,}', '\n\n', content)
    content = content.rstrip() + '\n'
    
    if content != orig:
        with open(f, 'w', encoding='utf-8', newline='') as fh:
            fh.write(content)
        changed.append(os.path.relpath(f, blog_dir))
        print(f"FIXED: {os.path.relpath(f, blog_dir)}")

print(f"\n共修正 {len(changed)} 篇")
