import { issueUrl, PILOT_CHARTER_URL, SPRINT_PLANS_URL } from "@/lib/links";

export function PilotStrip() {
  return (
    <section className="pilot" aria-labelledby="pilot-heading">
      <p className="eyebrow">Pilot plan</p>
      <h2 id="pilot-heading">Two sprint plans. These sprints were not run.</h2>
      <div className="pilot-grid">
        <article>
          <h3>Sprint 1. Triage routing contract</h3>
          <p>
            Issues{" "}
            <a href={issueUrl(4)}>#4</a>, <a href={issueUrl(5)}>#5</a>, and{" "}
            <a href={issueUrl(6)}>#6</a>. Out of this sprint: measuring precision
            and recall (<a href={issueUrl(7)}>#7</a>), until a labelled sample exists.
          </p>
        </article>
        <article>
          <h3>Sprint 2. NBA demo behind the published gates</h3>
          <p>
            Issues{" "}
            <a href={issueUrl(9)}>#9</a>, <a href={issueUrl(10)}>#10</a>, and{" "}
            <a href={issueUrl(11)}>#11</a>. Out of this sprint: the operator refit (
            <a href={issueUrl(12)}>#12</a>).
          </p>
        </article>
      </div>
      <p className="pilot-links">
        <a href={SPRINT_PLANS_URL}>Sprint plans</a>
        <a href={PILOT_CHARTER_URL}>Pilot charter</a>
      </p>
    </section>
  );
}
