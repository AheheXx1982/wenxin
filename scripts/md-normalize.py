# -*- coding: utf-8 -*-
"""SilentXx Markdown 规范化转换器 v1
将文章中的「伪标题」（独立短句小标题）转为标准 ## 标题。
- 普通行：行首加 "## "
- 阿甘特殊处理：✨ 编号行拆软换行（行尾双空格）+ 转 ##
- 转换前自动备份到 _md_backup/
"""
import re, os, shutil

BACKUP_DIR = "_md_backup"
os.makedirs(BACKUP_DIR, exist_ok=True)

# 每篇：文件名 -> 要转的行（精确匹配完整行文本，strip 后）
TASKS = {
    "src/content/blog/何处觅知音/成年人的爱情可遇而不可求.md": [
        "如何正确处理爱情与面包的关系？",
        "活在当下的真谛",
        "没有人是刻意为你准备的",
        "不是不想谈恋爱，只是我们害怕再次被伤害",
        "上班忙，圈子小如何破局",
        "父母不要帮倒忙",
    ],
    "src/content/blog/投资 × AI/小虎访谈.md": [
        "Q：看您还在炒币相关，您怎么看待币股接下来的表现呀？",
        "Q：您最成功的一笔交易是什么？您认为这笔交易还可以复制吗？",
        "Q：您最失败的一笔交易是？您从这个交易中学到了什么？",
        "Q：当市场变得波动并影响您的信心时，您如何坚持到底？",
        "Q：最后想对虎友们说？",
    ],
    "src/content/blog/南洋往事/谈恋爱欠巨款帅哥下海做按摩.md": [
        '不会泰式按摩的"泰式按摩"',
        "中国按摩 VS 新加坡按摩",
        "未来的规划：躺平主义 2.0",
        "躺平主义 2.0，那 1.0 是什么呢？",
    ],
    "src/content/blog/按摩大叔/到底什么是推拿按摩和大宝剑有什么不同.md": [
        "推拿与按摩有什么区别？",
        "推拿/按摩的四个层次",
        "推拿的力度问题，多大的力才比较合理？",
        "推拿的频次问题，多久做一次比较合适？",
        "我这病什么时候能好，我以前不会啊？",
    ],
    "src/content/blog/投资 × AI/一个普通小散户的投资之路.md": [
        "入市须谨慎",
        "我快成百万富翁了",
        "坐了一回过山车，很过瘾",
        "胜率 60%，没那么差",
    ],
    "src/content/blog/按摩大叔/关于本公众号的由来及若干运营思路（下）.md": [
        "不能再文雅一点吗，例如修脚大叔？",
        "最近好像都喜欢叫小哥哥小姐姐，那么小叔叔也可以吗？",
        "蒸馒头，越蒸越多，从早上蒸到中午，所以叫蒸蒸日上？",
    ],
}

# 阿甘特殊处理：✨ 编号行（行尾双空格软换行）→ "## N. 标题" 独立行
GAN_TASK = "src/content/blog/何处觅知音/阿甘为什么要一直跑步.md"

def convert(filepath, titles):
    with open(filepath, encoding="utf-8") as f:
        lines = f.readlines()
    backup = os.path.join(BACKUP_DIR, os.path.basename(filepath))
    shutil.copyfile(filepath, backup)

    converted = 0
    in_frontmatter = False
    for i, line in enumerate(lines):
        stripped = line.strip()
        # 跳过 frontmatter（--- 之间）
        if stripped == "---":
            in_frontmatter = not in_frontmatter
            continue
        if in_frontmatter:
            continue
        if stripped in titles:
            # 已经是标题则跳过
            if stripped.startswith("#"):
                continue
            indent = line[: len(line) - len(line.lstrip())]
            lines[i] = f"{indent}## {stripped}\n"
            converted += 1
    with open(filepath, "w", encoding="utf-8", newline="") as f:
        f.writelines(lines)
    return converted

def convert_gan(filepath):
    with open(filepath, encoding="utf-8") as f:
        text = f.read()
    backup = os.path.join(BACKUP_DIR, os.path.basename(filepath))
    shutil.copyfile(filepath, backup)

    # ✨ N. 标题 + 行尾双空格（软换行）→ ## N. 标题 + 换行
    pattern = re.compile(r"^✨ (\d+)\. ([^\n]+?)[ \t]+\n", re.M)
    text2, n = pattern.subn(lambda m: f"## {m.group(1)}. {m.group(2).strip()}\n", text)
    with open(filepath, "w", encoding="utf-8", newline="") as f:
        f.write(text2)
    return n

total = 0
for f, titles in TASKS.items():
    n = convert(f, titles)
    total += n
    print(f"✓ {f.replace('src/content/blog/','')}: 转换 {n} 个标题")

n = convert_gan(GAN_TASK)
total += n
print(f"✓ {GAN_TASK.replace('src/content/blog/','')}: 转换 {n} 个 ✨ 编号标题（拆软换行）")
print(f"\n共转换 {total} 个标题，备份在 {BACKUP_DIR}/")
