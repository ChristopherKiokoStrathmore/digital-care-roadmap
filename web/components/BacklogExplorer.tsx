"use client";

import { useMemo, useState } from "react";

import { ItemDetail } from "@/components/ItemDetail";
import { NOTES } from "@/lib/content";
import { horizonName, quadrantLabel, shortLabel, statusLabel } from "@/lib/labels";
import { issueUrl } from "@/lib/links";
import type { BacklogItem, Quadrant } from "@/lib/types";

type HorizonFilter = "all" | "1" | "2" | "3" | "none";
type QuadrantFilter = "all" | Quadrant;
type TypeFilter = "all" | "epic" | "story";
type SortKey = "issue" | "value" | "effort";

const QUADRANT_OPTIONS: Quadrant[] = ["do-first", "major-bet", "reconsider", "fill-in"];

function nudge(index: number, count: number): { dx: number; dy: number } {
  if (count <= 1) return { dx: 0, dy: 0 };
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  const radius = 18;
  return {
    dx: Math.cos(angle) * radius,
    dy: Math.sin(angle) * radius,
  };
}

export function BacklogExplorer({ items }: { items: BacklogItem[] }) {
  const [horizon, setHorizon] = useState<HorizonFilter>("all");
  const [quadrant, setQuadrant] = useState<QuadrantFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("issue");
  const [selectedId, setSelectedId] = useState<string>("S1");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (horizon === "none" && item.horizon !== null) return false;
      if (horizon !== "all" && horizon !== "none" && item.horizon !== Number(horizon)) {
        return false;
      }
      if (quadrant !== "all" && item.quadrant !== quadrant) return false;
      if (type !== "all" && item.type !== type) return false;
      if (!needle) return true;
      const haystack = `${item.id} ${item.issueNumber} ${item.title} ${shortLabel(item.issueNumber, item.title)}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [items, horizon, quadrant, type, query]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((left, right) => {
      const primary =
        sortKey === "value"
          ? right.value - left.value
          : sortKey === "effort"
            ? left.effort - right.effort
            : left.issueNumber - right.issueNumber;
      if (primary !== 0) return primary;
      return left.issueNumber - right.issueNumber;
    });
    return copy;
  }, [filtered, sortKey]);

  const selected = items.find((item) => item.id === selectedId) ?? null;
  const selectedVisible = selected !== null && filtered.some((item) => item.id === selected.id);

  const groups = useMemo(() => {
    const map = new Map<string, BacklogItem[]>();
    for (const item of filtered) {
      const key = `${item.value}-${item.effort}`;
      const group = map.get(key);
      if (group) group.push(item);
      else map.set(key, [item]);
    }
    return map;
  }, [filtered]);

  return (
    <div className="backlog-page">
      <header className="page-intro">
        <p className="eyebrow">Value versus effort</p>
        <h1>The backlog, plotted from the sheet.</h1>
        <p className="lede">
          Scores are illustrative planning scores for this artefact, on a 1 to 5 scale.
          They are not measured benefit and not hours. Epics stay on the chart
          because the sheet scores them. The quadrant labels are a reading aid.
          The table is the score.
        </p>
        <p className="counts">
          Showing {sorted.length} of {items.length} backlog items
        </p>
      </header>

      <div className="filters">
        <label>
          Horizon
          <select
            value={horizon}
            onChange={(event) => setHorizon(event.target.value as HorizonFilter)}
          >
            <option value="all">All horizons</option>
            <option value="1">Now</option>
            <option value="2">Next</option>
            <option value="3">Later</option>
            <option value="none">No horizon</option>
          </select>
        </label>
        <label>
          Quadrant
          <select
            value={quadrant}
            onChange={(event) => setQuadrant(event.target.value as QuadrantFilter)}
          >
            <option value="all">All quadrants</option>
            {QUADRANT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {quadrantLabel(option)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Type
          <select
            value={type}
            onChange={(event) => setType(event.target.value as TypeFilter)}
          >
            <option value="all">Epics and stories</option>
            <option value="epic">Epics</option>
            <option value="story">Stories</option>
          </select>
        </label>
        <label className="filter-search">
          Search
          <input
            type="search"
            value={query}
            placeholder="Title or issue"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <div className="explorer">
        <figure className="plot-card">
          <figcaption>
            Effort runs left to right. Value runs bottom to top. Both axes are the
            1 to 5 columns in backlog.csv. Dots that share a value and an effort are
            nudged so each issue can be selected. The table is the score.
          </figcaption>
          <div className="plot">
            <div className="plot-y" aria-hidden="true">
              {[5, 4, 3, 2, 1].map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>
            <div className="plot-area">
              <div className="quad-labels" aria-hidden="true">
                <span>Do first</span>
                <span>Major bets</span>
                <span>Fill-in</span>
                <span>Reconsider</span>
              </div>
              {filtered.map((item) => {
                const group = groups.get(`${item.value}-${item.effort}`) ?? [item];
                const index = group.findIndex((entry) => entry.id === item.id);
                const { dx, dy } = nudge(index, group.length);
                const x = ((item.effort - 1) / 4) * 100;
                const y = ((item.value - 1) / 4) * 100;
                const label = shortLabel(item.issueNumber, item.title);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`dot quadrant-${item.quadrant}`}
                    style={{
                      left: `${x}%`,
                      bottom: `${y}%`,
                      transform: `translate(calc(-50% + ${dx}px), calc(50% + ${dy}px))`,
                    }}
                    aria-pressed={selectedVisible && selected?.id === item.id}
                    aria-label={`${label}, issue ${item.issueNumber}, value ${item.value}, effort ${item.effort}, ${quadrantLabel(item.quadrant)}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    {item.issueNumber}
                  </button>
                );
              })}
            </div>
            <div className="plot-x" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>
            <p className="axis-name axis-x-name">Effort</p>
          </div>
          <ul className="legend">
            <li>
              <span className="swatch quadrant-do-first" /> Do first
            </li>
            <li>
              <span className="swatch quadrant-major-bet" /> Major bet
            </li>
            <li>
              <span className="swatch quadrant-reconsider" /> Reconsider
            </li>
            <li>
              <span className="swatch quadrant-fill-in" /> Fill-in
            </li>
          </ul>
        </figure>

        <aside className="detail-slot" aria-live="polite">
          {selected && selectedVisible ? (
            <ItemDetail item={selected} note={NOTES[selected.issueNumber]} />
          ) : (
            <div className="detail detail-empty">
              <h2>{selected ? "Selection hidden" : "No row selected"}</h2>
              <p>
                {selected
                  ? `${selected.title} is outside the current filters.`
                  : "Select a dot or a table row. Value and effort are copied from backlog.csv."}
              </p>
            </div>
          )}
        </aside>
      </div>

      <div className="table-wrap">
        <table>
          <caption>
            All visible backlog rows. Value and effort are the backlog.csv columns, on a 1 to 5 scale.
          </caption>
          <thead>
            <tr>
              <th scope="col" aria-sort={sortKey === "issue" ? "ascending" : "none"}>
                <button type="button" onClick={() => setSortKey("issue")}>
                  Item{sortKey === "issue" ? " · issue order" : ""}
                </button>
              </th>
              <th scope="col">Issue</th>
              <th scope="col">Horizon</th>
              <th scope="col" aria-sort={sortKey === "value" ? "descending" : "none"}>
                <button type="button" onClick={() => setSortKey("value")}>
                  Value{sortKey === "value" ? " · high first" : ""}
                </button>
              </th>
              <th scope="col" aria-sort={sortKey === "effort" ? "ascending" : "none"}>
                <button type="button" onClick={() => setSortKey("effort")}>
                  Effort{sortKey === "effort" ? " · low first" : ""}
                </button>
              </th>
              <th scope="col">Quadrant</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={7}>No backlog row matches these filters.</td>
              </tr>
            ) : (
              sorted.map((item) => {
                const isSelected = selectedVisible && selected?.id === item.id;
                return (
                  <tr key={item.id} data-selected={isSelected ? "true" : "false"}>
                    <th scope="row">
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedId(item.id)}
                      >
                        {item.title}
                      </button>
                    </th>
                    <td>
                      <a href={issueUrl(item.issueNumber)}>#{item.issueNumber}</a>
                    </td>
                    <td>{horizonName(item.horizon)}</td>
                    <td>{item.value}</td>
                    <td>{item.effort}</td>
                    <td>{quadrantLabel(item.quadrant)}</td>
                    <td>{statusLabel(item.status)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
