import Link from "next/link";

import { CAVEAT, DOCS, REPO_URL, SERIES } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div>
          <p>{CAVEAT}</p>
          <p>This roadmap sequences public demos. It is not a production operating plan.</p>
        </div>
        <div className="footer-links">
          <Link href="/article">Article</Link>
          <a href={REPO_URL}>Repository</a>
          {SERIES.map((repo) => (
            <a key={repo.href} href={repo.href}>
              {repo.name}
            </a>
          ))}
          <a href={DOCS.license}>MIT License</a>
        </div>
      </div>
    </footer>
  );
}
