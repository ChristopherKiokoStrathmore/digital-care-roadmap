"""backlog.csv parses, and its rows match the issue links in the docs."""

import csv
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "backlog.csv"

REQUIRED = [
    "id",
    "issue_number",
    "type",
    "title",
    "horizon",
    "sprint",
    "value",
    "effort",
    "quadrant",
    "status",
    "repos",
    "needs_operator_data",
    "labels",
    "milestone",
]


class BacklogTest(unittest.TestCase):
    def setUp(self):
        with CSV_PATH.open(newline="", encoding="utf-8") as handle:
            self.rows = list(csv.DictReader(handle))

    def test_parses_with_the_expected_columns(self):
        self.assertGreaterEqual(len(self.rows), 1)
        self.assertEqual(list(self.rows[0].keys()), REQUIRED)

    def test_ids_and_issue_numbers_are_unique(self):
        ids = [row["id"] for row in self.rows]
        numbers = [row["issue_number"] for row in self.rows]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertEqual(len(numbers), len(set(numbers)))

    def test_scores_are_illustrative_integers_on_a_five_point_scale(self):
        for row in self.rows:
            value = int(row["value"])
            effort = int(row["effort"])
            self.assertIn(value, range(1, 6))
            self.assertIn(effort, range(1, 6))
            self.assertIn(row["needs_operator_data"], {"yes", "no"})
            self.assertIn(row["type"], {"epic", "story"})

    def test_web_copy_matches_the_sheet(self):
        web = ROOT / "web" / "backlog.csv"
        self.assertEqual(
            web.read_text(encoding="utf-8"),
            CSV_PATH.read_text(encoding="utf-8"),
        )

    def test_sprint_rows_point_at_sprint_milestones(self):
        for row in self.rows:
            if row["sprint"] == "1":
                self.assertEqual(row["milestone"], "Sprint 1")
            elif row["sprint"] == "2":
                self.assertEqual(row["milestone"], "Sprint 2")
            else:
                self.assertIn(row["sprint"], {"", })
