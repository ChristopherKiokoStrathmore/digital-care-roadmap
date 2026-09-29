#!/usr/bin/env python3
"""Draw docs/roadmap.png. Stdlib plus Pillow. No measured results on the image."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "roadmap.png"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

WIDTH = 1400
HEIGHT = 560
BG = (247, 244, 239)
INK = (28, 27, 25)
MUTED = (70, 64, 58)
CARD = (255, 252, 248)
RULE = (210, 200, 186)


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT, size)


def wrap(draw, text, face, width):
    lines = []
    for paragraph in text.split("\n"):
        words = paragraph.split()
        current = ""
        for word in words:
            trial = word if not current else f"{current} {word}"
            if draw.textlength(trial, font=face) <= width:
                current = trial
            else:
                if current:
                    lines.append(current)
                current = word
        lines.append(current)
    return lines


def main():
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)
    title = font(28, bold=True)
    small = font(16)
    draw.text((48, 28), "Digital care roadmap", font=title, fill=INK)
    draw.text(
        (48, 68),
        "Personal portfolio sequence for Chris Nguu. Not an employer strategy.",
        font=small,
        fill=MUTED,
    )

    cards = [
        (
            "1  Triage and routing",
            (27, 79, 114),
            "Demo: MULTI-HEAD labels, the multi-head model card, and an n8n export.\n"
            "The export has not been run. No gold accuracy is published.\n"
            "Needs operator data: a labelled sample, and a live queue.",
        ),
        (
            "2  NBA and churn",
            (11, 110, 79),
            "Demo: POST /score, a rule-based next action, and CI gates\n"
            "on the IBM US sample, plus SHAP and Fairlearn.\n"
            "Needs operator data: any claim of local performance.",
        ),
        (
            "3  Self-healing journeys",
            (108, 52, 131),
            "Demo: synthetic journey KPIs and a cost model from assumptions.\n"
            "A closed loop that changes a live route is not in these repos.\n"
            "Needs operator data: real clocks, costs, and the route change.",
        ),
    ]
    gap = 24
    left = 48
    top = 120
    card_w = (WIDTH - left * 2 - gap * 2) // 3
    card_h = 340
    body = font(18)
    head = font(22, bold=True)
    for index, (heading, colour, text) in enumerate(cards):
        x = left + index * (card_w + gap)
        draw.rounded_rectangle((x, top, x + card_w, top + card_h), radius=16, fill=CARD, outline=RULE, width=2)
        draw.rectangle((x, top, x + card_w, top + 10), fill=colour)
        draw.text((x + 22, top + 28), heading, font=head, fill=colour)
        y = top + 78
        for line in wrap(draw, text, body, card_w - 44):
            draw.text((x + 22, y), line, font=body, fill=INK)
            y += 28
        if index < 2:
            arrow_y = top + card_h // 2
            ax = x + card_w + 4
            draw.line((ax, arrow_y, ax + gap - 8, arrow_y), fill=MUTED, width=3)
            draw.polygon(
                [(ax + gap - 8, arrow_y - 6), (ax + gap - 2, arrow_y), (ax + gap - 8, arrow_y + 6)],
                fill=MUTED,
            )

    draw.text(
        (48, 490),
        "Horizons are a reading order for four public demos. Key-result numbers elsewhere are illustrative targets.",
        font=small,
        fill=MUTED,
    )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    image.save(OUT, format="PNG")
    print(OUT)


if __name__ == "__main__":
    main()
