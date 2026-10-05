"use client";

import { useMemo, useState } from "react";

import { FilterBar } from "@/components/FilterBar";
import { DOCS, issueUrl } from "@/lib/content";
import { INITIAL_FILTERS, filterItems } from "@/lib/filter";
import {
  horizonKicker,
  quadrantLabel,
  shortLabel,
  statusLabel,
} from "@/lib/labels";
import type { BacklogItem, Quadrant } from "@/lib/types";

type SortKey = "issue" | "title" | "value" | "effort";
type SortState = { key: SortKey; direction: "asc" | "desc" };
type Focus = { value: number; effort: number; issue: number | null };

type Cluster = {
  value: number;
  effort: number;
  quadrant: Quadrant | "mixed";
  items: BacklogItem[];
};

const PLOT = {
  width: 640,
  height: 640,
  left: 72,
  right: 28,
  top: 28,
  bottom: 64,
};

export function BacklogExplorer({ items }: { items: BacklogItem[] }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortState>({ key: "issue", direction: "asc" });
  const [focus, setFocus] = useState<Focus | null>(null);

  const shown = useMemo(() => filterItems(items, filters), [items, filters]);
  const clusters = useMemo(() => clusterItems(shown), [shown]);
  const sorted = useMemo(() => sortItems(shown, sort), [shown, sort]);

  const focusedCluster =
    focus === null
      ? null
      : clusters.find((cluster) => cluster.value === focus.value && cluster.effort === focus.effort) ??
        null;

  function selectCluster(cluster: Cluster) {
    setFocus((current) =>
      current && current.value === cluster.value && current.effort === cluster.effort && current.issue === null
        ? null
        : { value: cluster.value, effort: cluster.effort, issue: null },
    );
  }

  function moveFocus(key: string) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)) return;
    const ordered = [...clusters].sort((a, b) => a.effort - b.effort || b.value - a.value);
    if (!focus) {
      const first = ordered[0];
      if (first) setFocus({ value: first.value, effort: first.effort, issue: null });
      return;
    }
    const next = nearest(clusters, focus, key);
    if (!next) return;
    setFocus({ value: next.value, effort: next.effort, issue: null });
    document.getElementById(`score-${next.value}-${next.effort}`)?.focus();
  }

  return (
    <div>
      <FilterBar
        value={filters}
        onChange={(next) => {
          setFilters(next);
          setFocus(null);
        }}
        shown={shown.length}
        total={items.length}
      />
      <div className="backlog-layout">
        <div className="plot-card">
          <Scatter
            clusters={clusters}
            focus={focus}
            onSelect={selectCluster}
            onKey={moveFocus}
          />
          <ul className="legend">
            <li>
              <span className="swatch" data-quadrant="do-first" aria-hidden="true" />
              Do first
            </li>
            <li>
              <span className="swatch" data-quadrant="major-bet" aria-hidden="true" />
              Major bet
            </li>
            <li>
              <span className="swatch" data-quadrant="reconsider" aria-hidden="true" />
              Reconsider
            </li>
          </ul>
          <p className="note">
            Each dot sits on the integer value and effort from{" "}
            <a href={DOCS.backlog}>backlog.csv</a>. Rows that share a score share one
            coordinate. The cross is the divider between 2 and 3. The quadrant word is
            the sheet column. Fill-in is empty on this sheet.
          </p>
        </div>
        <aside className="panel" aria-live="polite">
          <div className="panel-head">
            <h2>{focusedCluster ? "At this score" : "Score"}</h2>
            {focus ? (
              <button type="button" className="chip" onClick={() => setFocus(null)}>
                Clear
              </button>
            ) : null}
          </div>
          {focusedCluster ? (
            <>
              <p className="score-line">
                <span>Value {focusedCluster.value}</span>
                <span>Effort {focusedCluster.effort}</span>
                <span>
                  {focusedCluster.quadrant === "mixed"
                    ? "Mixed quadrants"
                    : quadrantLabel(focusedCluster.quadrant)}
                </span>
              </p>
              <ul className="panel-list">
                {focusedCluster.items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={focus?.issue === item.issueNumber ? "is-current" : undefined}
                      onClick={() =>
                        setFocus({
                          value: item.value,
                          effort: item.effort,
                          issue: item.issueNumber,
                        })
                      }
                    >
                      <strong>
                        #{item.issueNumber} {shortLabel(item.issueNumber, item.title)}
                      </strong>
                      <span className="note">{item.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="note">
              Select a dot. Arrow keys move across occupied scores. The number inside a
              dot is how many rows share that value and effort.
            </p>
          )}
        </aside>
      </div>
      <div className="table-wrap">
        <table>
          <caption className="caption">
            All {shown.length} visible rows. Sorting changes the list only. It does not
            change the scores.
          </caption>
          <thead>
            <tr>
              <SortableHeader label="Issue" sortKey="issue" sort={sort} onSort={setSort} numeric />
              <SortableHeader label="Item" sortKey="title" sort={sort} onSort={setSort} />
              <th scope="col">Horizon</th>
              <SortableHeader label="Value" sortKey="value" sort={sort} onSort={setSort} numeric />
              <SortableHeader label="Effort" sortKey="effort" sort={sort} onSort={setSort} numeric />
              <th scope="col">Quadrant</th>
              <th scope="col">Status</th>
              <th scope="col">Operator data</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => {
              const selected =
                focus !== null && focus.value === item.value && focus.effort === item.effort;
              return (
                <tr key={item.id} className={selected ? "is-selected" : undefined}>
                  <th scope="row" className="num">
                    <a href={issueUrl(item.issueNumber)}>#{item.issueNumber}</a>
                  </th>
                  <td className="title-cell">
                    <button
                      type="button"
                      className="row-button"
                      onClick={() =>
                        setFocus({
                          value: item.value,
                          effort: item.effort,
                          issue: item.issueNumber,
                        })
                      }
                    >
                      {item.title}
                    </button>
                    <div className="note">
                      {item.id} · {item.type}
                    </div>
                  </td>
                  <td>{horizonKicker(item.horizon)}</td>
                  <td className="num">{item.value}</td>
                  <td className="num">{item.effort}</td>
                  <td>{quadrantLabel(item.quadrant)}</td>
                  <td>{statusLabel(item.status)}</td>
                  <td>{item.needsOperatorData ? "yes" : "no"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sorted.length === 0 ? <p className="empty">No backlog rows match these filters.</p> : null}
      </div>
    </div>
  );
}

function Scatter({
  clusters,
  focus,
  onSelect,
  onKey,
}: {
  clusters: Cluster[];
  focus: Focus | null;
  onSelect: (cluster: Cluster) => void;
  onKey: (key: string) => void;
}) {
  const plotWidth = PLOT.width - PLOT.left - PLOT.right;
  const plotHeight = PLOT.height - PLOT.top - PLOT.bottom;
  const xOf = (effort: number) => PLOT.left + ((effort - 1) / 4) * plotWidth;
  const yOf = (value: number) => PLOT.top + ((5 - value) / 4) * plotHeight;
  const splitX = xOf(2.5);
  const splitY = yOf(2.5);

  return (
    <div
      className="plot-frame"
      onKeyDown={(event) => {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
          event.preventDefault();
          onKey(event.key);
        }
      }}
    >
      <svg viewBox={`0 0 ${PLOT.width} ${PLOT.height}`} role="img" aria-label="Value versus effort scatter. Effort runs left to right from 1 to 5. Value runs bottom to top from 1 to 5.">
        <rect x={PLOT.left} y={PLOT.top} width={splitX - PLOT.left} height={splitY - PLOT.top} fill="rgba(200,16,46,0.05)" />
        <rect x={splitX} y={PLOT.top} width={PLOT.left + plotWidth - splitX} height={splitY - PLOT.top} fill="rgba(20,18,16,0.04)" />
        <rect x={PLOT.left} y={splitY} width={splitX - PLOT.left} height={PLOT.top + plotHeight - splitY} fill="rgba(20,18,16,0.03)" />
        <rect x={splitX} y={splitY} width={PLOT.left + plotWidth - splitX} height={PLOT.top + plotHeight - splitY} fill="rgba(20,18,16,0.05)" />
        {[1, 2, 3, 4, 5].map((tick) => (
          <g key={tick}>
            <line
              x1={xOf(tick)}
              y1={PLOT.top}
              x2={xOf(tick)}
              y2={PLOT.top + plotHeight}
              stroke="rgba(20,18,16,0.12)"
            />
            <line
              x1={PLOT.left}
              y1={yOf(tick)}
              x2={PLOT.left + plotWidth}
              y2={yOf(tick)}
              stroke="rgba(20,18,16,0.12)"
            />
            <text x={xOf(tick)} y={PLOT.height - 28} textAnchor="middle" fill="#141210" fontSize="16">
              {tick}
            </text>
            <text x={PLOT.left - 16} y={yOf(tick) + 5} textAnchor="end" fill="#141210" fontSize="16">
              {tick}
            </text>
          </g>
        ))}
        <line x1={splitX} y1={PLOT.top} x2={splitX} y2={PLOT.top + plotHeight} stroke="#141210" strokeDasharray="4 4" />
        <line x1={PLOT.left} y1={splitY} x2={PLOT.left + plotWidth} y2={splitY} stroke="#141210" strokeDasharray="4 4" />
        <text x={PLOT.left + 8} y={PLOT.top + 18} fill="#3a342e" fontSize="13">
          Do first
        </text>
        <text x={splitX + 8} y={PLOT.top + 18} fill="#3a342e" fontSize="13">
          Major bet
        </text>
        <text x={PLOT.left + 8} y={PLOT.top + plotHeight - 10} fill="#3a342e" fontSize="13">
          Fill-in
        </text>
        <text x={splitX + 8} y={PLOT.top + plotHeight - 10} fill="#3a342e" fontSize="13">
          Reconsider
        </text>
        <text x={PLOT.left + plotWidth / 2} y={PLOT.height - 6} textAnchor="middle" fill="#141210" fontSize="14">
          Effort
        </text>
        <text
          x="18"
          y={PLOT.top + plotHeight / 2}
          textAnchor="middle"
          fill="#141210"
          fontSize="14"
          transform={`rotate(-90 18 ${PLOT.top + plotHeight / 2})`}
        >
          Value
        </text>
      </svg>
      {clusters.map((cluster) => {
        const pressed =
          focus !== null && focus.value === cluster.value && focus.effort === cluster.effort;
        const names = cluster.items
          .map((item) => shortLabel(item.issueNumber, item.title))
          .join(", ");
        return (
          <button
            key={`${cluster.value}-${cluster.effort}`}
            type="button"
            id={`score-${cluster.value}-${cluster.effort}`}
            className="plot-hit"
            data-quadrant={cluster.quadrant}
            aria-pressed={pressed}
            aria-label={`${names}. Value ${cluster.value}, effort ${cluster.effort}. ${
              cluster.quadrant === "mixed" ? "Mixed quadrants" : quadrantLabel(cluster.quadrant)
            }.`}
            style={{
              left: `${(xOf(cluster.effort) / PLOT.width) * 100}%`,
              top: `${(yOf(cluster.value) / PLOT.height) * 100}%`,
            }}
            onClick={() => onSelect(cluster)}
          >
            {cluster.items.length > 1 ? cluster.items.length : ""}
          </button>
        );
      })}
    </div>
  );
}

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
  numeric = false,
}: {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (next: SortState) => void;
  numeric?: boolean;
}) {
  const active = sort.key === sortKey;
  const nextDirection = active && sort.direction === "asc" ? "desc" : "asc";
  return (
    <th scope="col" className={numeric ? "num" : undefined} aria-sort={active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        className="sort"
        onClick={() => onSort({ key: sortKey, direction: active ? nextDirection : sortKey === "title" || sortKey === "issue" ? "asc" : "desc" })}
      >
        {label}
        {active ? (sort.direction === "asc" ? " ↑" : " ↓") : ""}
      </button>
    </th>
  );
}

function clusterItems(items: BacklogItem[]): Cluster[] {
  const groups = new Map<string, BacklogItem[]>();
  for (const item of items) {
    const key = `${item.value}:${item.effort}`;
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }
  return [...groups.values()].map((group) => {
    const ordered = [...group].sort((a, b) => a.issueNumber - b.issueNumber);
    const first = ordered[0];
    if (!first) {
      throw new Error("Empty score cluster");
    }
    const unanimous = ordered.every((item) => item.quadrant === first.quadrant);
    return {
      value: first.value,
      effort: first.effort,
      quadrant: unanimous ? first.quadrant : "mixed",
      items: ordered,
    };
  });
}

function sortItems(items: BacklogItem[], sort: SortState): BacklogItem[] {
  const copy = [...items];
  const factor = sort.direction === "asc" ? 1 : -1;
  copy.sort((a, b) => {
    if (sort.key === "title") return a.title.localeCompare(b.title) * factor;
    const left = sort.key === "issue" ? a.issueNumber : a[sort.key];
    const right = sort.key === "issue" ? b.issueNumber : b[sort.key];
    return (left - right) * factor;
  });
  return copy;
}

function nearest(clusters: Cluster[], focus: Focus, key: string): Cluster | null {
  const candidates = clusters.filter((cluster) => {
    if (key === "ArrowRight") return cluster.effort > focus.effort;
    if (key === "ArrowLeft") return cluster.effort < focus.effort;
    if (key === "ArrowUp") return cluster.value > focus.value;
    return cluster.value < focus.value;
  });
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => {
    const primary =
      key === "ArrowRight" || key === "ArrowLeft"
        ? Math.abs(a.effort - focus.effort) - Math.abs(b.effort - focus.effort)
        : Math.abs(a.value - focus.value) - Math.abs(b.value - focus.value);
    if (primary !== 0) return primary;
    const secondary =
      key === "ArrowRight" || key === "ArrowLeft"
        ? Math.abs(a.value - focus.value) - Math.abs(b.value - focus.value)
        : Math.abs(a.effort - focus.effort) - Math.abs(b.effort - focus.effort);
    return secondary;
  });
  return candidates[0] ?? null;
}
