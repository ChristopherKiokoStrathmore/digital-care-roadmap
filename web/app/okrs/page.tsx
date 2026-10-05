import type { Metadata } from "next";

import { CAVEAT, OKRS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Illustrative OKRs",
  description:
    "Illustrative OKR targets for the digital care roadmap. None of these is a result achieved on operator data.",
};

export default function OkrsPage() {
  return (
    <main id="content" className="wrap page">
      <header className="page-head">
        <p className="kicker">Illustrative</p>
        <h1>OKRs</h1>
        <p className="lede">
          Illustrative targets. None of these is a result this portfolio has achieved on
          operator data.
        </p>
        <p className="caveat">{CAVEAT}</p>
      </header>
      <div className="okr-list">
        {OKRS.map((objective) => (
          <article key={objective.n} className="okr-card">
            <p className="objective-no">Objective {objective.n}</p>
            <h2>{objective.title}</h2>
            <table className="okr-table">
              <caption className="caption">
                The illustrative target is the planning label. The second column is what
                the public demos already show.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Key result</th>
                  <th scope="col">Illustrative target</th>
                  <th scope="col">What the demos already show</th>
                </tr>
              </thead>
              <tbody>
                {objective.krs.map((kr) => (
                  <tr key={kr.id}>
                    <th scope="row">{kr.id}</th>
                    <td>{kr.target}</td>
                    <td>{kr.shown}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ))}
      </div>
    </main>
  );
}
