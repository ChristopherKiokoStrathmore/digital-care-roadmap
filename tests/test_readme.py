"""README sections, license, and Python 3.12 project files."""

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
README = (ROOT / "README.md").read_text(encoding="utf-8")

SERIES = [
    "https://github.com/ChristopherKiokoStrathmore/telco-churn-nba-engine",
    "https://github.com/ChristopherKiokoStrathmore/responsible-ai-pack",
    "https://github.com/ChristopherKiokoStrathmore/omnichannel-care-analytics",
    "https://github.com/ChristopherKiokoStrathmore/care-automation-roi",
]

# Phrases from the old forensic notes. They go stale or record a tool failure.
ABSENT = [
    "createProjectV2",
    "HTTP 403",
    "permission denied",
    "26 commits",
    "six CI",
    "Commit counts",
    "Issues, and the board",
    "Do not invent a board URL",
]


class ReadmeTest(unittest.TestCase):
    def test_required_sections_and_series_links(self):
        self.assertIn("## Projects in this series", README)
        self.assertIn("## Run", README)
        self.assertIn("Requires Python 3.12", README)
        self.assertIn("## Backlog", README)
        self.assertIn("## Lessons learned", README)
        self.assertIn("## Limitations", README)
        self.assertIn(
            "https://github.com/ChristopherKiokoStrathmore/digital-care-roadmap/issues",
            README,
        )
        self.assertIn("scripts/create_board.sh", README)
        for url in SERIES:
            self.assertIn(url, README)
        for phrase in ABSENT:
            self.assertNotIn(phrase, README)

    def test_license_python_version_and_make_targets(self):
        license_text = (ROOT / "LICENSE").read_text(encoding="utf-8")
        self.assertIn("Copyright (c) 2026 Christopher Nguu Kioko", license_text)
        self.assertIn("MIT License", license_text)
        version = (ROOT / ".python-version").read_text(encoding="utf-8").strip()
        self.assertEqual(version, "3.12")
        makefile = (ROOT / "Makefile").read_text(encoding="utf-8")
        for target in ("install:", "test:", "render:"):
            self.assertIn(target, makefile)

    def test_board_script_comments_stay_professional(self):
        script = (ROOT / "scripts" / "create_board.sh").read_text(encoding="utf-8")
        comments = "\n".join(
            line for line in script.splitlines() if line.strip().startswith("#")
        )
        for phrase in ("createProjectV2", "HTTP 403", "permission denied", "Do not invent"):
            self.assertNotIn(phrase, comments)
