import type { Metadata } from "next";

import { OBJECTIVES } from "@/lib/content";
import { ROADMAP_REPO } from "@/lib/links";

export const metadata: Metadata = {
  title: "Illustrative OKRs",
  description:
    "Illustrative OKR targets. None of these is a result this portfolio has achieved on operator data.",
};

export default function Page() {
  return (
    <div className="okr-page">
      <header className="page-intro">
        <p className="eyebrow">Illustrative</p>
        <h1>Illustrative OKRs</h1>
        <p className="lede">
          Illustrative targets. None of these is a result this portfolio has
          achieved on operator data.
        </p>
        <p className="counts">
          The red label is the illustrative target. The ink label is what the
          public demos already show.{" "}
          <a href={ROADMAP_REPO}>Source write-up on GitHub</a>.
        </p>
      </header>
      <div className="objective-list">
        {OBJECTIVES.map((objective) => (
          <article key={objective.id} className="objective">
            <p className="eyebrow">Objective {objective.id} · Illustrative</p>
            <h2>{objective.title}</h2>
            <ol>
              {objective.keyResults.map((keyResult) => (
                <li key={keyResult.id}>
                  <h3>{keyResult.id}</h3>
                  <div className="kr-grid">
                    <div>
                      <p className="kicker">Illustrative target</p>
                      <p>{keyResult.target}</p>
                    </div>
                    <div>
                      <p className="kicker">What the demos already show</p>
                      <p>{keyResult.shown}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </div>
  );
}
