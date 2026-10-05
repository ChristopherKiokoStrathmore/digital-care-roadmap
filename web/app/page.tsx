import { RoadmapBoard } from "@/components/RoadmapBoard";
import { CAVEAT, MULTI_HEAD, SERIES } from "@/lib/content";
import { countHorizons, loadBacklog } from "@/lib/backlog";

export default function HomePage() {
  const items = loadBacklog();
  const epics = items.filter((item) => item.type === "epic").length;
  const stories = items.filter((item) => item.type === "story").length;

  return (
    <main id="content" className="wrap page">
      <header className="hero">
        <p className="eyebrow">Telecom care analytics · portfolio roadmap</p>
        <h1>Which care-analytics capability should a telco build first?</h1>
        <p className="lede">
          And how would you know it worked? The four public demos, sequenced as Now,
          Next, and Later, with illustrative OKRs and a backlog of {epics} epics and{" "}
          {stories} stories.
        </p>
        <dl className="stats">
          <div>
            <dt>Horizons</dt>
            <dd>{countHorizons(items)}</dd>
          </div>
          <div>
            <dt>Backlog items</dt>
            <dd>{items.length}</dd>
          </div>
          <div>
            <dt>Score scale</dt>
            <dd>1–5</dd>
          </div>
        </dl>
        <p className="caveat">{CAVEAT}</p>
        <ul className="series">
          {SERIES.map((repo) => (
            <li key={repo.href}>
              <a href={repo.href}>
                {repo.name}
                <span>{repo.role}</span>
              </a>
            </li>
          ))}
          <li>
            <a href={MULTI_HEAD.href}>
              {MULTI_HEAD.name}
              <span>{MULTI_HEAD.role}</span>
            </a>
          </li>
        </ul>
      </header>
      <RoadmapBoard items={items} />
    </main>
  );
}
