import { Suspense } from "react";
import Link from "next/link";

import { RoadmapBoard } from "@/components/RoadmapBoard";
import { CAVEAT } from "@/lib/content";
import { countHorizons, loadBacklog } from "@/lib/backlog";

export default function HomePage() {
  const items = loadBacklog();
  const epics = items.filter((item) => item.type === "epic").length;
  const stories = items.filter((item) => item.type === "story").length;

  return (
    <main id="content" className="wrap page">
      <header className="demo-intro">
        <p className="eyebrow">Telecom care analytics · interactive roadmap</p>
        <div className="demo-intro-top">
          <h1>Which care-analytics capability should a telco build first?</h1>
          <Link className="text-link article-jump" href="/article">
            Read the write-up
          </Link>
        </div>
        <p className="lede">
          Open a horizon, select a backlog card, and follow it into the illustrative OKRs.
          The sheet has {epics} epics and {stories} stories.
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
      </header>
      <Suspense fallback={<p className="note">Loading the board.</p>}>
        <RoadmapBoard items={items} />
      </Suspense>
    </main>
  );
}
