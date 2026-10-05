"use client";

import { useMemo, useState } from "react";

import { FilterBar } from "@/components/FilterBar";
import { ItemCard } from "@/components/ItemCard";
import { DOCS, HORIZONS, SPRINTS, issueUrl } from "@/lib/content";
import { INITIAL_FILTERS, filterItems } from "@/lib/filter";
import type { BacklogItem, HorizonId } from "@/lib/types";

type RoadmapBoardProps = {
  items: BacklogItem[];
};

export function RoadmapBoard({ items }: RoadmapBoardProps) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const shown = useMemo(() => filterItems(items, filters), [items, filters]);

  const byHorizon = (horizon: HorizonId) =>
    shown
      .filter((item) => item.horizon === horizon)
      .sort(byIssue);

  const unassigned = shown.filter((item) => item.horizon === "").sort(byIssue);

  return (
    <section className="section-gap" aria-labelledby="board-heading">
      <div className="sprint-head">
        <div>
          <p className="kicker">Board</p>
          <h2 id="board-heading" className="lane-title">
            Now, Next, Later
          </h2>
        </div>
      </div>
      <p className="note">
        Value and effort on each card are the integers in backlog.csv. A blank horizon
        stays off the three lanes.
      </p>
      <FilterBar
        value={filters}
        onChange={setFilters}
        shown={shown.length}
        total={items.length}
      />
      <div className="board">
        {HORIZONS.map((horizon) => {
          const laneItems = byHorizon(horizon.id);
          return (
            <section key={horizon.id} className="lane" data-horizon={horizon.id} aria-labelledby={`lane-${horizon.id}`}>
              <p className="kicker">{horizon.kicker}</p>
              <h3 id={`lane-${horizon.id}`}>{horizon.title}</h3>
              <ul className="facts">
                {horizon.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="still">
                <strong>Still needs. </strong>
                {horizon.stillNeeds}
              </p>
              {laneItems.length > 0 ? (
                <ol className="stack">
                  {laneItems.map((item) => (
                    <li key={item.id}>
                      <ItemCard item={item} />
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="empty">No backlog rows in this horizon match the filters.</p>
              )}
            </section>
          );
        })}
      </div>
      <section className="unassigned" aria-labelledby="unassigned-heading">
        <p className="kicker">Sheet</p>
        <h3 id="unassigned-heading">No horizon on the sheet</h3>
        {unassigned.length > 0 ? (
          <ol className="stack">
            {unassigned.map((item) => (
              <li key={item.id}>
                <ItemCard item={item} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty">No unassigned row matches the filters.</p>
        )}
      </section>
      <SprintPlans items={items} />
    </section>
  );
}

function SprintPlans({ items }: { items: BacklogItem[] }) {
  return (
    <section className="section-gap" aria-labelledby="sprint-heading">
      <div className="sprint-head">
        <div>
          <p className="kicker">Plans</p>
          <h2 id="sprint-heading">Two sprint plans</h2>
          <p className="note">These sprints were not run.</p>
        </div>
        <a className="text-link" href={DOCS.sprints}>
          Sprint plan
        </a>
      </div>
      <div className="sprints">
        {SPRINTS.map((sprint) => (
          <article key={sprint.n} className="sprint">
            <p className="kicker">Sprint {sprint.n}</p>
            <h3>{sprint.title}</h3>
            <p>{sprint.goal}</p>
            <ol>
              {sprint.issues.map((issueNumber) => {
                const item = items.find((row) => row.issueNumber === issueNumber);
                return (
                  <li key={issueNumber}>
                    <a href={issueUrl(issueNumber)}>
                      #{issueNumber}
                      {item ? ` ${item.title}` : ""}
                    </a>
                  </li>
                );
              })}
            </ol>
            <p>{sprint.out}</p>
          </article>
        ))}
      </div>
      <p>
        <a className="text-link" href={DOCS.charter}>
          Pilot / proof-of-concept charter
        </a>
      </p>
    </section>
  );
}

function byIssue(a: BacklogItem, b: BacklogItem): number {
  if (a.type !== b.type) return a.type === "epic" ? -1 : 1;
  return a.issueNumber - b.issueNumber;
}
