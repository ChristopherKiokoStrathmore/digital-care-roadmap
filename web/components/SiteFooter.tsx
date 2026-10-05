import { CAVEAT } from "@/lib/content";
import { ISSUES_URL, ROADMAP_REPO, SERIES } from "@/lib/links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>{CAVEAT}</p>
      <div className="footer-grid">
        <div>
          <p className="kicker">Series</p>
          <ul>
            {SERIES.map((repo) => (
              <li key={repo.name}>
                <a href={repo.url}>{repo.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="kicker">This roadmap</p>
          <ul>
            <li>
              <a href={ROADMAP_REPO}>digital-care-roadmap</a>
            </li>
            <li>
              <a href={ISSUES_URL}>GitHub issues #3 to #19</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
