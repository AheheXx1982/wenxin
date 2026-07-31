import os, re, glob

blog_dir = "D:/wenxin/src/content/blog"

# Remove lines: **作者简介**：笔名骆驼你个祥子，简称祥子。 and 骆驼只是因为背很驼~
removed_files = []

for f in glob.glob(os.path.join(blog_dir, "**", "*.md"), recursive=True):
    with open(f, 'r', encoding='utf-8') as fh:
        lines = fh.readlines()
    
    new_lines = []
    changed = False
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # Remove the author intro line
        if re.match(r'^\*{0,2}作者简介\*{0,2}[:：].*骆驼你个祥子', stripped):
            changed = True
            i += 1
            continue
        
        # Remove 背很驼 line
        if re.match(r'^\*{0,2}骆驼只是因为背很驼', stripped):
            changed = True
            i += 1
            continue
        
        # Remove adjacent --- separators when they are part of footer block
        # (handle --- lines that immediately precede/follow removed lines)
        new_lines.append(line)
        i += 1
    
    # Clean up: collapse 3+ blank lines, remove separator blocks at end
    if changed:
        content = ''.join(new_lines)
        content = re.sub(r'\n{4,}', '\n\n', content)
        content = content.rstrip() + '\n'
        with open(f, 'w', encoding='utf-8', newline='') as fh:
            fh.write(content)
        removed_files.append(os.path.relpath(f, blog_dir))
        print(f"CLEANED: {os.path.relpath(f, blog_dir)}")

print(f"\n共清理 {len(removed_files)} 篇")
