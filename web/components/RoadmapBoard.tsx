"use client";

import { useMemo, useState } from "react";

import { ItemDetail } from "@/components/ItemDetail";
import { CAVEAT, HORIZONS, NOTES } from "@/lib/content";
import { horizonName, quadrantLabel, statusLabel } from "@/lib/labels";
import { SERIES } from "@/lib/links";
import type { BacklogItem, HorizonId } from "@/lib/types";

type FilterId = "all" | "story" | "epic" | "operator";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All items" },
  { id: "story", label: "Stories" },
  { id: "epic", label: "Epics" },
  { id: "operator", label: "Needs operator data" },
];

function matches(item: BacklogItem, filter: FilterId): boolean {
  if (filter === "story") return item.type === "story";
  if (filter === "epic") return item.type === "epic";
  if (filter === "operator") return item.needsOperatorData;
  return true;
}

export function RoadmapBoard({ items }: { items: BacklogItem[] }) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [selectedId, setSelectedId] = useState<string>("S1");

  const visible = useMemo(
    () => items.filter((item) => matches(item, filter)),
    [items, filter],
  );
  const visibleIds = useMemo(() => new Set(visible.map((item) => item.id)), [visible]);
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const selectedVisible = selected !== null && visibleIds.has(selected.id);

  const epics = items.filter((item) => item.type === "epic").length;
  const stories = items.filter((item) => item.type === "story").length;
  const unscoped = visible.filter((item) => item.horizon === null);

  function itemsFor(horizon: HorizonId) {
    return visible.filter((item) => item.horizon === horizon);
  }

  return (
    <div className="board-page">
      <header className="page-intro">
        <p className="eyebrow">Now / Next / Later · {HORIZONS.length} horizons</p>
        <h1>Which care-analytics capability should a telco build first?</h1>
        <p className="lede">
          How would you know it worked? This board sequences the four public demos.
          {" "}
          {CAVEAT}
        </p>
        <p className="counts">
          {epics} epics · {stories} stories · {items.length} backlog items
        </p>
        <ul className="series-row">
          {SERIES.map((repo) => (
            <li key={repo.name}>
              <a href={repo.url}>{repo.name}</a>
            </li>
          ))}
        </ul>
      </header>

      <div className="toolbar" role="toolbar" aria-label="Roadmap filters">
        {FILTERS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-pressed={filter === entry.id}
            onClick={() => setFilter(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="board-layout">
        <div className="lanes">
          {HORIZONS.map((horizon) => {
            const laneItems = itemsFor(horizon.id);
            return (
              <section
                key={horizon.id}
                className={`lane lane-${horizon.id}`}
                aria-labelledby={`lane-${horizon.id}`}
              >
                <header className="lane-head">
                  <p className="lane-index">0{horizon.id}</p>
                  <p className="eyebrow">{horizon.name}</p>
                  <h2 id={`lane-${horizon.id}`}>{horizon.title}</h2>
                  <ul>
                    {horizon.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <p className="needs">Needs operator data: {horizon.needs}</p>
                </header>
                <ol className="lane-list">
                  {laneItems.length === 0 ? (
                    <li className="empty">No items in this horizon for the current filter.</li>
                  ) : (
                    laneItems.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className="card"
                          aria-pressed={selectedVisible && selected?.id === item.id}
                          onClick={() => setSelectedId(item.id)}
                        >
                          <span className="card-kicker">
                            #{item.issueNumber} · {item.type === "epic" ? "Epic" : "Story"}
                            {item.sprint ? ` · Sprint ${item.sprint}` : ""}
                          </span>
                          <span className="card-title">{item.title}</span>
                          <span className="card-scores">
                            Value {item.value}
                            <span aria-hidden="true"> · </span>
                            Effort {item.effort}
                          </span>
                          <span className="card-meta">
                            {quadrantLabel(item.quadrant)} · {statusLabel(item.status)}
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ol>
              </section>
            );
          })}
        </div>

        <aside className="detail-slot" aria-live="polite">
          {selected && selectedVisible ? (
            <ItemDetail item={selected} note={NOTES[selected.issueNumber]} />
          ) : (
            <div className="detail detail-empty">
              <h2>Selection hidden</h2>
              <p>
                {selected
                  ? `${selected.title} is outside the current filter.`
                  : "Select an item. Its value and effort come from backlog.csv."}
              </p>
            </div>
          )}
        </aside>
      </div>

      {unscoped.length > 0 ? (
        <section className="unscoped" aria-labelledby="unscoped-heading">
          <h2 id="unscoped-heading">No horizon in the sheet</h2>
          <p>
            {unscoped.length === 1 ? "One row has" : `${unscoped.length} rows have`} an
            empty horizon column. {horizonName(null)} is not inferred from the milestone.
          </p>
          <ul className="lane-list">
            {unscoped.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="card"
                  aria-pressed={selectedVisible && selected?.id === item.id}
                  onClick={() => setSelectedId(item.id)}
                >
                  <span className="card-kicker">
                    #{item.issueNumber} · {item.type === "epic" ? "Epic" : "Story"}
                  </span>
                  <span className="card-title">{item.title}</span>
                  <span className="card-scores">
                    Value {item.value}
                    <span aria-hidden="true"> · </span>
                    Effort {item.effort}
                  </span>
                  <span className="card-meta">
                    {quadrantLabel(item.quadrant)} · {statusLabel(item.status)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
