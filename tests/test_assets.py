"""Story figures exist, and every number they use is already in the repo."""

import importlib.util
import re
import struct
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
README = (ROOT / "README.md").read_text(encoding="utf-8")
NUMBER = re.compile(r"\d{1,3}(?:,\d{3})+|\d+\.\d+|\d+")


def load_facts():
    path = ROOT / "scripts" / "story_facts.py"
    spec = importlib.util.spec_from_file_location("story_facts", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def png_size(path):
    blob = path.read_bytes()
    if blob[:8] != b"\x89PNG\r\n\x1a\n" or blob[12:16] != b"IHDR":
        raise AssertionError(f"{path.name} is not a PNG")
    return struct.unpack(">II", blob[16:24])


def visible_strings(facts):
    found = [facts.CAVEAT, facts.QUESTION, facts.QUESTION_TAIL, *facts.SERIES]
    found.extend(facts.SHORT.values())
    found.extend(facts.STATUS.values())
    for value, label in facts.HERO_STATS:
        found.extend((value, label))
    for horizon in facts.HORIZONS:
        found.append(horizon["title"])
        found.extend(horizon["lines"])
    for objective in facts.OKRS:
        found.append(objective["title"])
        found.extend(objective.get("title_lines", []))
        for kr_id, target, demo in objective["krs"]:
            found.extend((kr_id, target, demo))
    for sprint in facts.SPRINTS:
        found.extend((sprint["title"], sprint["goal"], sprint["out"]))
    for title, line_a, line_b in facts.METHOD:
        found.extend((title, line_a, line_b))
    return found


class AssetTest(unittest.TestCase):
    def test_figures_are_pngs_under_about_one_megabyte(self):
        expected = {
            "hero.png": (1600, 800),
            "social-preview.png": (1280, 640),
            "backlog-quadrant.png": (1560, 900),
            "okrs.png": (1600, 980),
            "sprints.png": (1440, 780),
        }
        for name, size in expected.items():
            path = ROOT / "assets" / name
            self.assertEqual(png_size(path), size, name)
            self.assertLess(path.stat().st_size, 1_000_000, name)

    def test_readme_embeds_the_story_and_not_the_social_preview(self):
        self.assertIn("assets/hero.png", README)
        self.assertIn("assets/okrs.png", README)
        self.assertIn("assets/backlog-quadrant.png", README)
        self.assertIn("assets/sprints.png", README)
        self.assertNotIn("social-preview.png", README)
        self.assertLess(README.find("# Digital care roadmap"), README.find("assets/hero.png"))
        self.assertLess(README.find("assets/hero.png"), README.find("[![CI]"))

    def test_story_numbers_and_labels_come_from_the_repo(self):
        facts = load_facts()
        corpus = facts.corpus()
        folded = corpus.casefold()
        self.assertIn(facts.CAVEAT, corpus)
        self.assertIn(facts.QUESTION.rstrip("?").casefold(), folded)
        self.assertIn(facts.QUESTION_TAIL.rstrip("?").casefold(), folded)
        for text in visible_strings(facts):
            self.assertNotIn("--", text, text)
            self.assertNotIn("\u2014", text, text)
            self.assertNotIn("\u2013", text, text)
            for number in NUMBER.findall(text):
                self.assertIn(number, corpus, f"{number} from {text}")

    def test_quadrant_bands_match_the_backlog_column(self):
        facts = load_facts()
        rows = facts.stories()
        self.assertEqual(len(rows), 14)
        self.assertEqual(len(facts.epics()), 3)
        issues = {row["issue"] for row in rows} | {int(row["issue_number"]) for row in facts.epics()}
        self.assertEqual(issues, set(range(3, 20)))
        for row in rows:
            self.assertEqual(facts.band(row["value"], row["effort"]), row["quadrant"])
            self.assertIn(row["short"], README)
            self.assertIn(row["status_label"], README)
