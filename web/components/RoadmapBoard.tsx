"use client";

import { useMemo } from "react";

import { FilterBar } from "@/components/FilterBar";
import { Inspector } from "@/components/Inspector";
import { ItemCard } from "@/components/ItemCard";
import { useDemoFilters, useIssueSelection } from "@/components/useDemoQuery";
import { DOCS, HORIZONS, SPRINTS, issueUrl } from "@/lib/content";
import { filterItems } from "@/lib/filter";
import type { BacklogItem, HorizonId } from "@/lib/types";

type RoadmapBoardProps = {
  items: BacklogItem[];
};

export function RoadmapBoard({ items }: RoadmapBoardProps) {
  const [filters, setFilters] = useDemoFilters();
  const { selected, horizonNote, selectIssue, selectNote } = useIssueSelection(items);
  const shown = useMemo(() => filterItems(items, filters), [items, filters]);

  const byHorizon = (horizon: HorizonId) =>
    shown.filter((item) => item.horizon === horizon).sort(byIssue);
  const unassigned = shown.filter((item) => item.horizon === "").sort(byIssue);
  const lanes =
    filters.horizon === "all" || filters.horizon === "none"
      ? HORIZONS
      : HORIZONS.filter((horizon) => horizon.id === filters.horizon);
  const showUnassigned = filters.horizon === "all" || filters.horizon === "none";
  const selectedHidden =
    selected !== null && !shown.some((item) => item.id === selected.id);

  function moveSelection(key: string) {
    const columns = [
      ...lanes.map((horizon) => byHorizon(horizon.id)),
      ...(showUnassigned ? [unassigned] : []),
    ].filter((column) => column.length > 0);
    if (!selected) {
      const first = columns[0]?.[0];
      if (first) selectIssue(first);
      return;
    }
    const columnIndex = columns.findIndex((column) => column.some((item) => item.id === selected.id));
    const rowIndex = columns[columnIndex]?.findIndex((item) => item.id === selected.id) ?? -1;
    if (columnIndex < 0 || rowIndex < 0) return;
    let next: BacklogItem | undefined;
    if (key === "ArrowDown") {
      next = columns[columnIndex]?.[rowIndex + 1] ?? columns[columnIndex + 1]?.[0];
    } else if (key === "ArrowUp") {
      next = rowIndex > 0 ? columns[columnIndex]?.[rowIndex - 1] : columns[columnIndex - 1]?.at(-1);
    } else if (key === "ArrowRight" || key === "ArrowLeft") {
      const neighbor = columns[columnIndex + (key === "ArrowRight" ? 1 : -1)];
      if (neighbor && neighbor.length > 0) next = neighbor[Math.min(rowIndex, neighbor.length - 1)];
    }
    if (!next) return;
    selectIssue(next);
    document.getElementById(`item-${next.id}`)?.focus();
  }

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
      <div className="horizon-switch" role="group" aria-label="Horizon">
        <button
          type="button"
          aria-pressed={filters.horizon === "all"}
          onClick={() => setFilters({ ...filters, horizon: "all" })}
        >
          <span className="kicker">Sequence</span>
          <strong>All horizons</strong>
          <span className="switch-count">{filterItems(items, { ...filters, horizon: "all" }).length}</span>
        </button>
        {HORIZONS.map((horizon) => {
          const count = filterItems(items, { ...filters, horizon: horizon.id }).length;
          return (
            <button
              key={horizon.id}
              type="button"
              data-horizon={horizon.id}
              aria-pressed={filters.horizon === horizon.id}
              onClick={() => setFilters({ ...filters, horizon: horizon.id })}
            >
              <span className="kicker">{horizon.kicker}</span>
              <strong>{horizon.title}</strong>
              <span className="switch-count">{count}</span>
            </button>
          );
        })}
      </div>
      <FilterBar
        value={filters}
        onChange={setFilters}
        shown={shown.length}
        total={items.length}
        showHorizon={false}
        compact
      />
      <div
        className="workspace"
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
          const target = event.target as HTMLElement;
          if (!target.closest(".item-button")) return;
          event.preventDefault();
          moveSelection(event.key);
        }}
      >
        <div className="board-column">
          <div className={lanes.length === 1 ? "board board-single" : "board"}>
            {lanes.map((horizon) => {
              const laneItems = byHorizon(horizon.id);
              return (
                <section
                  key={horizon.id}
                  className="lane"
                  data-horizon={horizon.id}
                  aria-labelledby={`lane-${horizon.id}`}
                >
                  <div className="lane-head">
                    <div>
                      <p className="kicker">{horizon.kicker}</p>
                      <h3 id={`lane-${horizon.id}`}>{horizon.title}</h3>
                    </div>
                    <button
                      type="button"
                      className="chip"
                      aria-pressed={horizonNote?.id === horizon.id}
                      onClick={() => selectNote(horizonNote?.id === horizon.id ? null : horizon.id)}
                    >
                      Horizon note
                    </button>
                  </div>
                  <ul className="facts">
                    {horizon.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  {laneItems.length > 0 ? (
                    <ol className="stack">
                      {laneItems.map((item) => (
                        <li key={item.id}>
                          <ItemCard
                            item={item}
                            domId={`item-${item.id}`}
                            selected={selected?.id === item.id}
                            onSelect={selectIssue}
                          />
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
          {showUnassigned ? (
            <section className="unassigned" aria-labelledby="unassigned-heading">
              <p className="kicker">Sheet</p>
              <h3 id="unassigned-heading">No horizon on the sheet</h3>
              {unassigned.length > 0 ? (
                <ol className="stack">
                  {unassigned.map((item) => (
                    <li key={item.id}>
                      <ItemCard
                        item={item}
                        domId={`item-${item.id}`}
                        selected={selected?.id === item.id}
                        onSelect={selectIssue}
                      />
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="empty">No unassigned row matches the filters.</p>
              )}
            </section>
          ) : null}
        </div>
        <Inspector
          item={selected}
          horizon={horizonNote}
          hiddenByFilters={selectedHidden}
          onClose={() => {
            selectIssue(null);
            selectNote(null);
          }}
        />
      </div>
      <SprintPlans items={items} selectedId={selected?.id ?? null} onSelect={selectIssue} />
    </section>
  );
}

function SprintPlans({
  items,
  selectedId,
  onSelect,
}: {
  items: BacklogItem[];
  selectedId: string | null;
  onSelect: (item: BacklogItem) => void;
}) {
  return (
    <section className="section-gap" aria-labelledby="sprint-heading">
      <div className="sprint-head">
        <div>
          <p className="kicker">Plans</p>
          <h2 id="sprint-heading">Two sprint plans</h2>
          <p className="note">These sprints were not run. Open a story to read it on the board.</p>
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
                    {item ? (
                      <button
                        type="button"
                        className={item.id === selectedId ? "sprint-link is-current" : "sprint-link"}
                        onClick={() => {
                          onSelect(item);
                          document.getElementById(`item-${item.id}`)?.focus();
                        }}
                      >
                        #{issueNumber} {item.title}
                      </button>
                    ) : (
                      <a href={issueUrl(issueNumber)}>#{issueNumber}</a>
                    )}
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
