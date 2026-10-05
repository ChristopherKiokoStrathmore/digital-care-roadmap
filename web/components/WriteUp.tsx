import Link from "next/link";

import { OkrTables } from "@/components/OkrTables";
import { FIGURES, LESSONS, LIMITATIONS } from "@/lib/article";
import { countHorizons } from "@/lib/backlog";
import {
  CAVEAT,
  DOCS,
  HORIZONS,
  MULTI_HEAD,
  SCORE_NOTE,
  SERIES,
  SPRINTS,
  issueUrl,
} from "@/lib/content";
import { horizonKicker, quadrantLabel, shortLabel, statusLabel } from "@/lib/labels";
import type { BacklogItem } from "@/lib/types";

export function WriteUp({ items }: { items: BacklogItem[] }) {
  const epics = items.filter((item) => item.type === "epic").length;
  const stories = items.filter((item) => item.type === "story").length;

  return (
    <article className="writeup">
      <nav className="jump" aria-label="Write-up sections">
        <a href="#sequence">Sequence</a>
        <a href="#okrs">OKRs</a>
        <a href="#backlog-sheet">Backlog</a>
        <a href="#pilot">Pilot</a>
        <a href="#lessons">Lessons</a>
        <a href="#limitations">Limitations</a>
      </nav>
      <img src={FIGURES.hero.src} alt={FIGURES.hero.alt} />
      <p>
        A Now / Next / Later product roadmap sequences the four earlier projects, with OKRs
        as goals and a value-versus-effort backlog of {items.length} issues ({epics} epics
        and {stories} stories, #3 to #19), two sprint plans, and a pilot charter. It is part
        of an independent portfolio series on telecom customer analytics. The board is the
        click-through view of the same sheet.
      </p>
      <p>
        <Link className="text-link" href="/">
          Open the Now / Next / Later board
        </Link>
      </p>
      <h2>Projects in this series</h2>
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
      <h2 id="sequence">Now, Next, Later</h2>
      <img src={FIGURES.roadmap.src} alt={FIGURES.roadmap.alt} />
      <p>
        Three horizons across {countHorizons(items)} columns on the sheet. Now is triage
        and routing. Next is NBA and churn. Later is self-healing journeys.
      </p>
      {HORIZONS.map((horizon) => (
        <section key={horizon.id} id={`horizon-${horizon.id}`}>
          <h3>
            {horizon.kicker} — {horizon.title}
          </h3>
          <ul>
            {horizon.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {horizon.note.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            <strong>Still needs. </strong>
            {horizon.stillNeeds}
          </p>
          <p>
            <Link className="text-link" href={`/?h=${horizon.id}`}>
              Show {horizon.kicker} on the board
            </Link>
          </p>
        </section>
      ))}
      <h2 id="okrs">OKRs</h2>
      <p>
        Illustrative targets. None of these is a result this portfolio has achieved on
        operator data.
      </p>
      <img src={FIGURES.okrs.src} alt={FIGURES.okrs.alt} />
      <p>
        <em>The gold note is the illustrative target. The green note is what the public demos already show.</em>
      </p>
      <p>
        <Link className="text-link" href="/okrs">
          Open the OKR view
        </Link>
      </p>
      <OkrTables />
      <h2 id="backlog-sheet">Backlog and prioritisation</h2>
      <p>{SCORE_NOTE} The quadrant is a reading aid for the backlog. The table is the score.</p>
      <p>{CAVEAT}</p>
      <img src={FIGURES.backlog.src} alt={FIGURES.backlog.alt} />
      <p>
        <em>Position is the value and effort in the table. Colour is the quadrant column. Stories that share a score share one dot.</em>
      </p>
      <p>
        <Link className="text-link" href="/backlog">
          Open the filterable backlog
        </Link>
      </p>
      <div className="table-wrap">
        <table>
          <caption className="caption">
            Every row in backlog.csv. Scores are the integers on the sheet.
          </caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Issue</th>
              <th scope="col">Horizon</th>
              <th scope="col">Value</th>
              <th scope="col">Effort</th>
              <th scope="col">Quadrant</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{shortLabel(item.issueNumber, item.title)}</td>
                <td>
                  <a href={issueUrl(item.issueNumber)}>#{item.issueNumber}</a>
                </td>
                <td>{horizonKicker(item.horizon)}</td>
                <td className="num">{item.value}</td>
                <td className="num">{item.effort}</td>
                <td>{quadrantLabel(item.quadrant)}</td>
                <td>{statusLabel(item.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Epics:{" "}
        <a href={issueUrl(3)}>#3</a> triage, <a href={issueUrl(8)}>#8</a> NBA and churn,{" "}
        <a href={issueUrl(13)}>#13</a> self-healing journeys. The full sheet is{" "}
        <a href={DOCS.backlog}>backlog.csv</a>.
      </p>
      <h2 id="pilot">Pilot plan</h2>
      <p>
        Two sprint plans, with user stories and Given / When / Then criteria, live in{" "}
        <a href={DOCS.sprints}>docs/sprint-plans.md</a>.
      </p>
      <img src={FIGURES.sprints.src} alt={FIGURES.sprints.alt} />
      <p>
        <em>Sprint 1 and Sprint 2 as written in the sprint plan. These sprints were not run.</em>
      </p>
      {SPRINTS.map((sprint) => (
        <section key={sprint.n}>
          <h3>
            Sprint {sprint.n} — {sprint.title}
          </h3>
          <p>{sprint.goal}</p>
          <ul>
            {sprint.issues.map((issueNumber) => {
              const item = items.find((row) => row.issueNumber === issueNumber);
              return (
                <li key={issueNumber}>
                  <Link href={`/?issue=${issueNumber}`}>
                    #{issueNumber}
                    {item ? ` ${item.title}` : ""}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p>{sprint.out}</p>
        </section>
      ))}
      <p>
        Pilot / PoC charter template: <a href={DOCS.charter}>docs/pilot-charter.md</a>.
      </p>
      <h2 id="lessons">Lessons learned</h2>
      <ul>
        {LESSONS.map((lesson) => (
          <li key={lesson}>{lesson}</li>
        ))}
      </ul>
      <h2>Data and scope</h2>
      <p>Built on public and synthetic data as an independent portfolio project.</p>
      <h2 id="limitations">Limitations</h2>
      <ul>
        {LIMITATIONS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
