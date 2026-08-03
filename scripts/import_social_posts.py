#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
导入社交平台内容（SOUL/朋友圈/小红书）到问心站 blog collection。

用法:
    python scripts/import_social_posts.py            # dry-run 预览
    python scripts/import_social_posts.py --apply    # 实际写入

Intake 目录: D:/wenxin/.intake/
    soul.txt -> source=soul (基准主库)
    wechat.txt -> source=wechat
    xhs.txt -> source=xiaohongshu

块格式:
    # YYYY-MM-DD
    正文...
    @category: 投资随笔   (可选，默认自动判断)

    ---

    # YYYY-MM-DD
    正文...
"""
import re
import sys
from datetime import date, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INTAKE_DIR = ROOT / ".intake"
BLOG_DIR = ROOT / "src" / "content" / "blog"

SOURCE_MAP = {
    "soul.txt": ("soul", "SOUL瞬间"),
    "wechat.txt": ("wechat", "朋友圈"),
    "xhs.txt": ("xiaohongshu", "小红书"),
}

CATEGORIES = ["投资随笔", "生活随想", "神级音乐"]

# 关键词 -> 栏目 自动判断（@category 显式指定时优先）
KEYWORD_CATEGORY = [
    ("投资随笔", ["投资", "交易", "仓位", "期权", "股票", "股市", "财报", "收益", "风险", "复利", "市场", "牛", "熊", "割肉", "止盈", "止损", "现金流"]),
    ("神级音乐", ["音乐", "歌", "歌曲", "旋律", "歌词", "吉他", "钢琴", "古琴", "乐队", "专辑", "单曲", "演唱", "听歌", "歌手", "曲风", "旋律"]),
]

MOMENT_LEN = 200  # 正文短于此 -> type: moment

TODAY = date.today().isoformat()


def norm_text(t: str) -> str:
    """归一化用于去重：去标点/空白/emoji。"""
    t = re.sub(r"[\W_]+", "", t, flags=re.UNICODE)
    return t[:120]


def guess_category(content: str) -> str:
    for cat, kws in KEYWORD_CATEGORY:
        for kw in kws:
            if kw in content:
                return cat
    return "生活随想"


def parse_blocks(text: str) -> list[dict]:
    """按 --- 分块，解析日期头与可选 @category。"""
    blocks = []
    parts = re.split(r"^\s*---\s*$", text, flags=re.MULTILINE)
    for part in parts:
        lines = [ln.rstrip() for ln in part.splitlines()]
        lines = [ln for ln in lines if ln.strip()]  # 去空行（正文内空行另行处理）
        if not lines:
            continue
        m = re.match(r"^#\s*(\d{4}-\d{2}-\d{2})\s*$", lines[0])
        if not m:
            print(f"  [跳过] 块缺少日期头 '# YYYY-MM-DD': 首行={lines[0][:40]!r}")
            continue
        post_date = m.group(1)
        body_lines = lines[1:]
        category = None
        skip = False
        kept = []
        for ln in body_lines:
            if ln.startswith("@category:"):
                category = ln.split(":", 1)[1].strip()
            elif ln.strip() == "@skip":
                skip = True
            else:
                kept.append(ln)
        if skip:
            continue
        # 还原正文段落结构（保留空行）
        body = "\n".join(kept).strip()
        if not body:
            continue
        blocks.append({"date": post_date, "body": body, "category": category})
    return blocks


def title_from(body: str) -> str:
    first = body.splitlines()[0].strip()
    first = re.sub(r"^[#>\-\*\s]+", "", first)
    first = re.sub(r"!\[.*?\]\(.*?\)", "", first).strip()
    if len(first) > 40:
        first = first[:40] + "…"
    return first or "无题"


def slug_for(post_date: str, category: str, source: str, existing: set) -> str:
    prefix = f"moment-{post_date}-{source}"
    n = 1
    while f"{prefix}-{n:02d}" in existing:
        n += 1
    return f"{prefix}-{n:02d}"


def existing_bodies() -> dict:
    """现有文章正文归一化前缀 -> slug，用于跨批次去重。"""
    res = {}
    for md in BLOG_DIR.rglob("*.md"):
        text = md.read_text(encoding="utf-8")
        m = re.search(r"^---\n(.*?)\n---\n(.*)$", text, flags=re.DOTALL)
        body = m.group(2) if m else text
        res[norm_text(body)] = md.stem
    return res


def main() -> None:
    apply = "--apply" in sys.argv
    print(f"{'写入模式' if apply else 'DRY-RUN 预览'}  (加 --apply 实际写入)\n")

    existing = existing_bodies()
    created, skipped_dup, skipped_err = [], [], []
    used_slugs = {md.stem for md in BLOG_DIR.rglob("*.md")}

    for fname, (source, source_label) in SOURCE_MAP.items():
        fpath = INTAKE_DIR / fname
        if not fpath.exists():
            continue
        print(f"=== {fname} ({source_label}) ===")
        blocks = parse_blocks(fpath.read_text(encoding="utf-8"))
        if not blocks:
            print("  (无有效内容)\n")
            continue

        new_categories = set()
        for i, blk in enumerate(blocks):
            category = blk["category"] or guess_category(blk["body"])
            if category not in CATEGORIES:
                print(f"  [错误] 未知栏目 {category!r}（可选: {CATEGORIES}）")
                skipped_err.append((fname, i))
                continue
            new_categories.add(category)

            key = norm_text(blk["body"])
            if key in existing:
                print(f"  [去重] {blk['date']} 与已有文章重复 -> 跳过")
                skipped_dup.append(f"{fname}#{i}")
                continue
            existing[key] = "this-run"

            title = title_from(blk["body"])
            slug = slug_for(blk["date"], category, source, used_slugs)
            used_slugs.add(slug)
            desc = re.sub(r"\s+", " ", blk["body"])[:60]
            post_type = "moment" if len(blk["body"]) < MOMENT_LEN else "post"
            tags = [source_label, category]

            frontmatter = (
                f"---\n"
                f"title: '{title.replace(chr(39), chr(39) * 2)}'\n"
                f"slug: '{slug}'\n"
                f"description: '{desc.replace(chr(39), chr(39) * 2)}'\n"
                f"date: {blk['date']}\n"
                f"updated: {TODAY}\n"
                f"tags: {tags}\n"
                f"categories: ['{category}']\n"
                f"lang: 'zh'\n"
                f"source: '{source}'\n"
                f"type: '{post_type}'\n"
                f"---\n"
            )
            out_path = BLOG_DIR / category / f"{slug}.md"
            if apply:
                out_path.parent.mkdir(parents=True, exist_ok=True)
                out_path.write_text(frontmatter + "\n" + blk["body"] + "\n", encoding="utf-8")
            print(f"  [{'写入' if apply else '将建'}] {slug}  ({category}, {blk['date']}, {post_type})")
            print(f"        标题: {title}")
            created.append((slug, category))

        for cat in sorted(new_categories):
            if cat not in [c for _, c in created] or True:
                pass
        # 提示需要更新的站点配置
        need_cfg = {c for _, c in created if c in CATEGORIES}
        if need_cfg:
            print(f"\n  -> 新栏目出现，记得同步: category.ts / i18n.ts（导航+分类名）")

    print(f"\n=== 汇总: 新建 {len(created)} 条, 去重跳过 {len(skipped_dup)} 条, 错误 {len(skipped_err)} 条 ===")
    if created:
        print("建议下一步: pnpm dev 本地预览确认后再统一 git commit+push")


if __name__ == "__main__":
    main()
