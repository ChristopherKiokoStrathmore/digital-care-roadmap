#!/usr/bin/env python3
"""Draw the story figures in assets/ from backlog.csv and the README.

Needs Pillow and CairoSVG, plus Fraunces and Inter Tight (downloaded on first run).
Does not invent metrics. story_facts.py is the only source of labels and numbers.
"""

import urllib.request
from pathlib import Path

import cairosvg
from PIL import Image, ImageFont

import story_facts as facts

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
FONT_DIR = Path("/tmp/fonts")

DEEP = "#0B3D2E"
DEEP_MID = "#1B6B4A"
GOLD = "#C8962E"
GOLD_DEEP = "#8C6414"
CREAM = "#F6F1E7"
WHITE = "#FFFCF7"
INK = "#1C2B24"
MUTED = "#5E6F66"
LINE = "#E4D9C6"
SOFT = "#E7F2EC"
SOFT_GOLD = "#F8F1DE"
PALE = "#F3EFE6"

FONTS = {
    "Fraunces": (
        "fraunces-700.ttf",
        "https://cdn.jsdelivr.net/fontsource/fonts/fraunces@5.2.5/latin-700-normal.ttf",
    ),
    "Inter": (
        "intertight-500.ttf",
        "https://cdn.jsdelivr.net/fontsource/fonts/inter-tight@5.2.5/latin-500-normal.ttf",
    ),
    "InterSemi": (
        "intertight-600.ttf",
        "https://cdn.jsdelivr.net/fontsource/fonts/inter-tight@5.2.5/latin-600-normal.ttf",
    ),
    "InterBold": (
        "intertight-700.ttf",
        "https://cdn.jsdelivr.net/fontsource/fonts/inter-tight@5.2.5/latin-700-normal.ttf",
    ),
}

HORIZON_COLOR = {"NOW": DEEP, "NEXT": DEEP_MID, "LATER": GOLD}
QUADRANT_FILL = {
    "do-first": "#E5F2EB",
    "major-bet": "#F8EFDA",
    "fill-in": "#F4F1EA",
    "reconsider": "#F6EBE4",
}
QUADRANT_INK = {
    "do-first": "#7FA894",
    "major-bet": "#C4A56A",
    "fill-in": "#C9C2B6",
    "reconsider": "#C4A497",
}
DOT = {"do-first": DEEP, "major-bet": GOLD, "reconsider": "#8C4E3B"}

_FACES = {}


def ensure_fonts():
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    paths = {}
    for family, (filename, url) in FONTS.items():
        path = FONT_DIR / filename
        if not path.exists() or path.stat().st_size < 1000:
            urllib.request.urlretrieve(url, path)
        paths[family] = path
    return paths


def face(paths, family, size):
    key = (family, size)
    if key not in _FACES:
        _FACES[key] = ImageFont.truetype(str(paths[family]), size)
    return _FACES[key]


def text_width(paths, text, family, size):
    return face(paths, family, size).getlength(text)


def wrap(paths, text, family, size, max_w):
    words = text.split()
    lines, current = [], ""
    for word in words:
        trial = word if not current else f"{current} {word}"
        if text_width(paths, trial, family, size) <= max_w:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines or [""]


def esc(value):
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def check_prose(value):
    text = str(value)
    if "--" in text or "\u2014" in text or "\u2013" in text:
        raise SystemExit(f"dash not allowed in figure text: {text}")


class Svg:
    def __init__(self, width, height, paths):
        self.w = width
        self.h = height
        self.paths = paths
        self.parts = []

    def add(self, fragment):
        self.parts.append(fragment)

    def rect(self, x, y, w, h, fill, rx=0, stroke=None, sw=0, dash=None):
        extra = ""
        if stroke:
            extra += f' stroke="{stroke}" stroke-width="{sw}"'
        if dash:
            extra += f' stroke-dasharray="{dash}"'
        self.add(
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"{extra}/>'
        )

    def line(self, x1, y1, x2, y2, stroke, sw):
        self.add(
            f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round"/>'
        )

    def circle(self, cx, cy, r, fill, stroke=None, sw=0):
        extra = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
        self.add(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"{extra}/>')

    def polygon(self, points, fill):
        pts = " ".join(f"{x},{y}" for x, y in points)
        self.add(f'<polygon points="{pts}" fill="{fill}"/>')

    def text(self, x, y, value, family, size, fill, anchor="start"):
        check_prose(value)
        self.add(
            f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" fill="{fill}" text-anchor="{anchor}">{esc(value)}</text>'
        )

    def center(self, x, y, value, family, size, fill):
        check_prose(value)
        self.add(
            f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" fill="{fill}" text-anchor="middle" dominant-baseline="central">{esc(value)}</text>'
        )

    def block(self, x, y, lines, family, size, fill, lh, anchor="start"):
        for index, line in enumerate(lines):
            self.text(x, y + index * lh, line, family, size, fill, anchor)
        return len(lines) * lh

    def arrow(self, x1, x2, y, color=GOLD):
        self.line(x1, y, x2 - 10, y, color, 3)
        self.polygon([(x2 - 12, y - 7), (x2, y), (x2 - 12, y + 7)], color)

    def arrow_down(self, x, y1, y2, color=GOLD):
        self.line(x, y1, x, y2 - 7, color, 3)
        self.polygon([(x - 6, y2 - 8), (x, y2), (x + 6, y2 - 8)], color)

    def open_card(self, clip_id, x, y, w, h, rx):
        self.add(
            f'<clipPath id="{clip_id}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}"/></clipPath>'
        )
        self.add(f'<g clip-path="url(#{clip_id})">')
        self.rect(x, y, w, h, WHITE)

    def close_card(self, x, y, w, h, rx):
        self.add("</g>")
        self.rect(x, y, w, h, "none", rx=rx, stroke=LINE, sw=1.5)

    def frame(self):
        self.rect(0, 0, self.w, 8, DEEP)
        self.rect(0, self.h - 8, self.w, 8, GOLD)

    def render(self):
        faces = "\n".join(
            f"@font-face {{ font-family: '{family}'; src: url('file://{path}'); }}"
            for family, path in self.paths.items()
        )
        body = "\n".join(self.parts)
        return (
            f'<?xml version="1.0" encoding="UTF-8"?>'
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}">'
            f"<style>{faces}</style>"
            f'<rect width="{self.w}" height="{self.h}" fill="{CREAM}"/>'
            f"{body}</svg>"
        )


def save_png(svg, path, width, height):
    png = cairosvg.svg2png(
        bytestring=svg.encode("utf-8"),
        output_width=width,
        output_height=height,
    )
    path.write_bytes(png)
    image = Image.open(path)
    if image.size != (width, height):
        raise SystemExit(f"{path.name} is {image.size}, expected {(width, height)}")
    image.convert("RGB").save(path, "PNG", optimize=True)
    if path.stat().st_size > 900_000:
        quantized = Image.open(path).quantize(colors=128, method=Image.Quantize.MEDIANCUT)
        quantized.save(path, "PNG", optimize=True)


def repo_icon(svg, x, y):
    svg.add(
        f'<g fill="none" stroke="{DEEP}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" transform="translate({x},{y})">'
        f'<path d="M4 3h9l5 5v13a1.5 1.5 0 0 1-1.5 1.5h-12.5A1.5 1.5 0 0 1 3 21V4.5A1.5 1.5 0 0 1 4.5 3z"/>'
        f'<path d="M13 3v5h5"/>'
        f"</g>"
    )


def hero(paths):
    svg = Svg(1600, 800, paths)
    svg.frame()
    svg.text(40, 42, "Digital care roadmap", "Fraunces", 22, DEEP)
    svg.text(1560, 40, facts.CAVEAT, "Inter", 13, MUTED, "end")

    cards = [36, 562, 1088]
    card_w, card_h, card_y = 474, 684, 64
    for x in cards:
        svg.rect(x, card_y, card_w, card_h, WHITE, rx=18, stroke=LINE, sw=1.5)
        svg.rect(x, card_y, card_w, 8, GOLD)

    svg.arrow(516, 556, 400)
    svg.arrow(1042, 1082, 400)

    # Problem
    x = cards[0]
    svg.text(x + 28, 108, "PROBLEM", "InterBold", 13, GOLD)
    headline = ["Which care-analytics", "capability should a", "telco build first?"]
    svg.block(x + 28, 150, headline, "Fraunces", 30, DEEP, 38)
    svg.text(x + 28, 268, facts.QUESTION_TAIL, "Inter", 16, MUTED)

    svg.circle(x + 237, 330, 36, GOLD)
    svg.center(x + 237, 332, "?", "Fraunces", 40, WHITE)

    slugs = facts.SERIES
    offsets = [24, 48, 28, 56]
    for index, slug in enumerate(slugs):
        cy = 384 + index * 74
        cx = x + offsets[index]
        svg.rect(cx, cy, 390, 64, CREAM, rx=12, stroke=LINE, sw=1.5)
        repo_icon(svg, cx + 14, cy + 16)
        svg.text(cx + 48, cy + 38, slug, "InterSemi", 15, INK)
    svg.text(x + 28, 700, "The four earlier projects.", "Inter", 15, MUTED)
    svg.text(x + 28, 722, "No build order.", "InterSemi", 15, DEEP)

    # Method
    x = cards[1]
    svg.text(x + 28, 108, "METHOD", "InterBold", 13, GOLD)
    svg.block(x + 28, 150, ["Score, sequence,", "then gate"], "Fraunces", 32, DEEP, 40)
    steps = facts.METHOD
    top = 250
    step_h = 86
    spine_x = x + 52
    svg.line(spine_x, top + 16, spine_x, top + step_h * 4 + 16, "#E7D7A8", 3)
    for index, (title, line_a, line_b) in enumerate(steps):
        y = top + index * step_h
        svg.circle(spine_x, y + 28, 15, GOLD)
        svg.center(spine_x, y + 29, str(index + 1), "InterBold", 14, WHITE)
        svg.text(x + 80, y + 22, title, "InterBold", 16, INK)
        svg.text(x + 80, y + 44, line_a, "Inter", 14, MUTED)
        svg.text(x + 80, y + 64, line_b, "Inter", 14, MUTED)

    # Result
    x = cards[2]
    svg.text(x + 28, 108, "RESULT", "InterBold", 13, GOLD)
    svg.text(x + 28, 152, "Now, Next, Later", "Fraunces", 32, DEEP)
    lanes = facts.HORIZONS
    lane_y = 186
    lane_h = 156
    for index, horizon in enumerate(lanes):
        y = lane_y + index * (lane_h + 18)
        color = HORIZON_COLOR[horizon["key"]]
        tab_ink = DEEP if horizon["key"] == "LATER" else WHITE
        svg.open_card(f"lane{index}", x + 24, y, 426, lane_h, 14)
        svg.rect(x + 24, y, 86, lane_h, color)
        svg.close_card(x + 24, y, 426, lane_h, 14)
        svg.center(x + 67, y + lane_h / 2, horizon["key"], "InterBold", 13, tab_ink)
        svg.text(x + 112, y + 36, horizon["title"], "Fraunces", 18, DEEP)
        for line_index, line in enumerate(horizon["lines"]):
            ly = y + 68 + line_index * 26
            if text_width(paths, line, "Inter", 13) > 318:
                raise SystemExit(f"hero line is too wide: {line}")
            svg.circle(x + 118, ly - 4, 3.2, GOLD)
            svg.text(x + 130, ly, line, "Inter", 13, INK)
        if index < 2:
            svg.arrow_down(x + 237, y + lane_h + 2, y + lane_h + 16)

    return svg.render()


def social(paths):
    svg = Svg(1280, 640, paths)
    svg.rect(0, 0, 1280, 640, CREAM)
    svg.rect(0, 0, 1280, 8, DEEP)

    svg.text(48, 64, "digital-care-roadmap", "InterBold", 16, GOLD)
    svg.text(48, 118, "Digital care roadmap", "Fraunces", 44, DEEP)
    svg.text(48, 152, facts.CAVEAT, "Inter", 15, MUTED)

    cards = facts.HORIZONS
    gap = 18
    card_w = (1280 - 96 - gap * 2) / 3
    card_y, card_h = 180, 300
    for index, horizon in enumerate(cards):
        x = 48 + index * (card_w + gap)
        color = HORIZON_COLOR[horizon["key"]]
        tab_ink = DEEP if horizon["key"] == "LATER" else WHITE
        svg.open_card(f"social{index}", x, card_y, card_w, card_h, 16)
        svg.rect(x, card_y, card_w, 64, color)
        svg.close_card(x, card_y, card_w, card_h, 16)
        svg.center(x + card_w / 2, card_y + 34, horizon["key"], "InterBold", 18, tab_ink)
        svg.text(x + 22, card_y + 108, horizon["title"], "Fraunces", 22, DEEP)
        for line_index, line in enumerate(horizon["lines"]):
            ly = card_y + 162 + line_index * 42
            wrapped = wrap(paths, line, "Inter", 13, card_w - 64)
            if len(wrapped) != 1:
                raise SystemExit(f"social line wraps: {line} -> {wrapped}")
            svg.circle(x + 28, ly - 4, 3.2, GOLD)
            svg.text(x + 40, ly, wrapped[0], "Inter", 13, INK)

    svg.line(48, 524, 1232, 524, GOLD, 2)
    tagline = facts.QUESTION
    svg.text(48, 572, tagline, "Fraunces", 22, DEEP)
    return svg.render()


def quadrant(paths):
    svg = Svg(1560, 900, paths)
    svg.frame()
    svg.text(48, 52, "Value versus effort", "Fraunces", 32, DEEP)
    svg.text(
        48,
        82,
        "14 stories from backlog.csv. The table is the score. Colour is the quadrant column.",
        "Inter",
        15,
        MUTED,
    )

    plot_x, plot_y, plot_w, plot_h = 90, 130, 980, 680
    svg.rect(plot_x, plot_y, plot_w, plot_h, WHITE, rx=16, stroke=LINE, sw=1.5)

    pad = 70
    inner_x = plot_x + pad
    inner_y = plot_y + 36
    inner_w = plot_w - pad - 36
    inner_h = plot_h - 36 - 56

    def xp(effort):
        return inner_x + (effort - 1) / 4 * inner_w

    def yp(value):
        return inner_y + inner_h - (value - 1) / 4 * inner_h

    mid_x = xp(2.5)
    mid_y = yp(2.5)
    regions = [
        (inner_x, inner_y, mid_x - inner_x, mid_y - inner_y, "do-first", "Do first"),
        (mid_x, inner_y, xp(5) - mid_x, mid_y - inner_y, "major-bet", "Major bet"),
        (inner_x, mid_y, mid_x - inner_x, yp(1) - mid_y, "fill-in", "Fill-in"),
        (mid_x, mid_y, xp(5) - mid_x, yp(1) - mid_y, "reconsider", "Reconsider"),
    ]
    for rx, ry, rw, rh, key, label in regions:
        svg.rect(rx, ry, rw, rh, QUADRANT_FILL[key])
    # Names sit in open space, away from the dots.
    svg.text(xp(1) + 4, yp(3.05), "Do first", "InterBold", 15, QUADRANT_INK["do-first"])
    svg.text(xp(3.15), yp(3.15), "Major bet", "InterBold", 15, QUADRANT_INK["major-bet"])
    svg.center((inner_x + mid_x) / 2, (mid_y + yp(1)) / 2, "Fill-in", "InterBold", 15, QUADRANT_INK["fill-in"])
    svg.text(xp(4.15), yp(1.55), "Reconsider", "InterBold", 15, QUADRANT_INK["reconsider"])

    svg.line(inner_x, mid_y, xp(5), mid_y, "#E4D9C6", 1.5)
    svg.line(mid_x, inner_y, mid_x, yp(1), "#E4D9C6", 1.5)

    for score in range(1, 6):
        svg.line(xp(score), yp(1), xp(score), yp(1) + 8, MUTED, 1.5)
        svg.center(xp(score), yp(1) + 26, str(score), "Inter", 14, MUTED)
        svg.line(inner_x - 8, yp(score), inner_x, yp(score), MUTED, 1.5)
        svg.text(inner_x - 18, yp(score) + 5, str(score), "Inter", 14, MUTED, "end")

    svg.center((inner_x + xp(5)) / 2, plot_y + plot_h - 16, "Effort", "InterSemi", 14, INK)
    svg.add(
        f'<text x="{plot_x + 22}" y="{(inner_y + yp(1)) / 2}" font-family="InterSemi" font-size="14" fill="{INK}" text-anchor="middle" transform="rotate(-90 {plot_x + 22} {(inner_y + yp(1)) / 2})">Value</text>'
    )

    groups = {}
    for story in facts.stories():
        if facts.band(story["value"], story["effort"]) != story["quadrant"]:
            raise SystemExit(f"quadrant mismatch for #{story['issue']}")
        groups.setdefault((story["value"], story["effort"]), []).append(story)

    for (value, effort), group in groups.items():
        px, py = xp(effort), yp(value)
        color = DOT[group[0]["quadrant"]]
        svg.circle(px, py, 9, color, stroke=WHITE, sw=2)
        label = "  ".join(f"#{story['issue']}" for story in group)
        if effort >= 4:
            anchor, lx = "end", px - 16
        else:
            anchor, lx = "start", px + 16
        svg.text(lx, py + 4, label, "InterBold", 13, INK, anchor)

    legend_x = 1100
    svg.text(legend_x, 150, "Stories", "Fraunces", 22, DEEP)
    svg.text(legend_x, 176, "value / effort", "Inter", 13, MUTED)
    cursor = 210
    order = [("do-first", "Do first"), ("major-bet", "Major bet"), ("reconsider", "Reconsider")]
    by_quad = {key: [] for key, _ in order}
    for story in facts.stories():
        by_quad[story["quadrant"]].append(story)
    for key, label in order:
        svg.circle(legend_x + 6, cursor - 4, 6, DOT[key])
        svg.text(legend_x + 20, cursor, label, "InterBold", 14, INK)
        cursor += 26
        for story in by_quad[key]:
            line = f"#{story['issue']}  {story['short']}"
            svg.text(legend_x + 20, cursor, line, "Inter", 13, INK)
            svg.text(
                1500,
                cursor,
                f"{story['value']} / {story['effort']}",
                "Inter",
                13,
                MUTED,
                "end",
            )
            cursor += 22
        cursor += 14

    svg.text(48, 860, facts.CAVEAT, "Inter", 14, MUTED)
    svg.text(
        1512,
        860,
        "Shared scores share one dot.",
        "Inter",
        14,
        MUTED,
        "end",
    )
    return svg.render()


def okrs(paths):
    svg = Svg(1600, 980, paths)
    svg.frame()
    svg.text(40, 52, "Three OKRs", "Fraunces", 32, DEEP)
    svg.text(40, 82, facts.CAVEAT, "Inter", 15, MUTED)
    svg.rect(1180, 36, 16, 16, GOLD, rx=3)
    svg.text(1204, 49, "Illustrative target", "Inter", 13, INK)
    svg.rect(1400, 36, 16, 16, DEEP, rx=3)
    svg.text(1424, 49, "Demo already", "Inter", 13, INK)

    gap = 18
    card_w = (1600 - 80 - gap * 2) / 3
    card_y, card_h = 110, 820
    for index, objective in enumerate(facts.OKRS):
        x = 40 + index * (card_w + gap)
        svg.open_card(f"okr{index}", x, card_y, card_w, card_h, 16)
        svg.rect(x, card_y, card_w, 118, DEEP)
        svg.close_card(x, card_y, card_w, card_h, 16)
        svg.text(x + 20, card_y + 36, f"Objective {objective['n']}", "InterBold", 13, GOLD)
        title_lines = objective.get("title_lines") or wrap(
            paths, objective["title"], "InterSemi", 15, card_w - 40
        )
        svg.block(x + 20, card_y + 64, title_lines, "InterSemi", 15, WHITE, 22)

        cursor = card_y + 146
        for kr_id, target, demo in objective["krs"]:
            svg.text(x + 20, cursor, kr_id, "InterBold", 13, GOLD_DEEP)
            cursor += 22
            svg.rect(x + 20, cursor - 12, 8, 8, GOLD, rx=2)
            svg.text(x + 34, cursor, "Illustrative target", "InterBold", 12, GOLD_DEEP)
            cursor += 20
            target_lines = wrap(paths, target, "Inter", 13, card_w - 48)
            svg.block(x + 34, cursor, target_lines, "Inter", 13, INK, 18)
            cursor += len(target_lines) * 18 + 8
            svg.rect(x + 20, cursor - 12, 8, 8, DEEP, rx=2)
            svg.text(x + 34, cursor, "What the demos already show", "InterBold", 12, DEEP)
            cursor += 20
            demo_lines = wrap(paths, demo, "Inter", 13, card_w - 48)
            svg.block(x + 34, cursor, demo_lines, "Inter", 13, INK, 18)
            cursor += len(demo_lines) * 18 + 22
    return svg.render()


def sprints(paths):
    svg = Svg(1440, 780, paths)
    svg.frame()
    svg.text(40, 52, "Two sprint plans", "Fraunces", 32, DEEP)
    svg.text(40, 82, "These sprints were not run.", "InterSemi", 16, GOLD_DEEP)
    by_issue = {story["issue"]: story for story in facts.stories()}

    gap = 24
    card_w = (1440 - 80 - gap) / 2
    card_y, card_h = 112, 600
    for index, sprint in enumerate(facts.SPRINTS):
        x = 40 + index * (card_w + gap)
        color = DEEP if sprint["n"] == "1" else DEEP_MID
        svg.open_card(f"sprint{index}", x, card_y, card_w, card_h, 16)
        svg.rect(x, card_y, card_w, 92, color)
        svg.close_card(x, card_y, card_w, card_h, 16)
        svg.text(x + 24, card_y + 34, f"Sprint {sprint['n']}", "InterBold", 13, GOLD)
        svg.text(x + 24, card_y + 64, sprint["title"], "Fraunces", 22, WHITE)
        goal_lines = wrap(paths, sprint["goal"], "Inter", 15, card_w - 48)
        svg.block(x + 24, card_y + 128, goal_lines, "Inter", 15, MUTED, 22)

        cursor = card_y + 128 + len(goal_lines) * 22 + 18
        for issue in sprint["issues"]:
            story = by_issue[issue]
            svg.rect(x + 24, cursor, card_w - 48, 78, CREAM, rx=12)
            svg.text(x + 40, cursor + 28, f"#{issue}", "InterBold", 16, DEEP)
            svg.text(x + 100, cursor + 28, story["short"], "InterSemi", 16, INK)
            svg.text(x + 40, cursor + 54, story["status_label"], "Inter", 14, MUTED)
            cursor += 92
        out_lines = wrap(paths, sprint["out"], "Inter", 14, card_w - 48)
        svg.block(x + 24, cursor + 8, out_lines, "Inter", 14, MUTED, 20)

    svg.text(
        40,
        748,
        "Given / When / Then criteria are in the sprint plan. A pilot charter template sits beside it.",
        "Inter",
        14,
        MUTED,
    )
    return svg.render()


def main():
    paths = ensure_fonts()
    # Import path: this file lives in scripts/, story_facts is a sibling.
    ASSETS.mkdir(parents=True, exist_ok=True)
    figures = {
        "hero.png": (hero(paths), 1600, 800),
        "social-preview.png": (social(paths), 1280, 640),
        "backlog-quadrant.png": (quadrant(paths), 1560, 900),
        "okrs.png": (okrs(paths), 1600, 980),
        "sprints.png": (sprints(paths), 1440, 780),
    }
    for name, (svg, width, height) in figures.items():
        path = ASSETS / name
        save_png(svg, path, width, height)
        print(f"{path} {width}x{height} {path.stat().st_size} bytes")


if __name__ == "__main__":
    main()
