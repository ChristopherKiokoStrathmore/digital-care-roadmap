"""Relative links resolve on disk, and every linked GitHub repo answers."""

import re
import time
import unittest
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LINK = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
REQUIRED_REPOS = [
    "https://github.com/ChristopherKiokoStrathmore/telco-churn-nba-engine",
    "https://github.com/ChristopherKiokoStrathmore/responsible-ai-pack",
    "https://github.com/ChristopherKiokoStrathmore/omnichannel-care-analytics",
    "https://github.com/ChristopherKiokoStrathmore/care-automation-roi",
    "https://github.com/ChristopherKiokoStrathmore/MULTI-HEAD-",
]


def markdown_files():
    yield ROOT / "README.md"
    yield from (ROOT / "docs").glob("*.md")


def links_in(path):
    text = path.read_text(encoding="utf-8")
    return LINK.findall(text)


class LinkTest(unittest.TestCase):
    def test_roadmap_png_is_a_png(self):
        blob = (ROOT / "docs" / "roadmap.png").read_bytes()
        self.assertTrue(blob.startswith(b"\x89PNG"))
        self.assertGreater(len(blob), 1000)

    def test_required_repos_are_named_in_the_readme(self):
        readme = (ROOT / "README.md").read_text(encoding="utf-8")
        for url in REQUIRED_REPOS:
            self.assertIn(url, readme)

    def test_relative_links_exist(self):
        for path in markdown_files():
            for raw in links_in(path):
                if raw.startswith(("http://", "https://", "mailto:")):
                    continue
                target = raw.split("#", 1)[0]
                if not target:
                    continue
                resolved = (path.parent / target).resolve()
                self.assertTrue(resolved.exists(), f"{path.name} -> {raw}")

    def test_http_links_resolve(self):
        seen = []
        for path in markdown_files():
            for raw in links_in(path):
                if raw.startswith(("http://", "https://")) and raw not in seen:
                    seen.append(raw.split("#", 1)[0] if " " not in raw else raw)
        # Drop anchors. Keep each URL once.
        urls = []
        for raw in seen:
            url = raw.split("#", 1)[0].strip()
            if url and url not in urls:
                urls.append(url)
        self.assertGreaterEqual(len(urls), len(REQUIRED_REPOS))
        for url in urls:
            self.assertLess(fetch(url), 400, url)


def fetch(url):
    request = urllib.request.Request(
        url,
        method="GET",
        headers={"User-Agent": "digital-care-roadmap-linkcheck"},
    )
    last_error = None
    for _ in range(3):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return response.status
        except urllib.error.HTTPError as error:
            if error.code in {429, 500, 502, 503, 504}:
                last_error = error
                time.sleep(1)
                continue
            return error.code
        except urllib.error.URLError as error:
            last_error = error
            time.sleep(1)
            continue
    raise AssertionError(f"{url} failed: {last_error}")


if __name__ == "__main__":
    unittest.main()
