"use client";

import { useState } from "react";

import { ITEM_STATUSES, statusLabel } from "@/lib/labels";
import { INITIAL_FILTERS, isInitialFilter, type FilterState } from "@/lib/filter";

const QUADRANTS: { id: FilterState["quadrant"]; label: string }[] = [
  { id: "all", label: "All quadrants" },
  { id: "do-first", label: "Do first" },
  { id: "major-bet", label: "Major bet" },
  { id: "reconsider", label: "Reconsider" },
];

const OPERATORS: { id: FilterState["operator"]; label: string }[] = [
  { id: "all", label: "Any data need" },
  { id: "yes", label: "Needs operator data" },
  { id: "no", label: "No operator data flag" },
];

const TYPES: { id: FilterState["type"]; label: string }[] = [
  { id: "all", label: "Epics and stories" },
  { id: "story", label: "Stories" },
  { id: "epic", label: "Epics" },
];

const HORIZONS: { id: FilterState["horizon"]; label: string }[] = [
  { id: "all", label: "All horizons" },
  { id: "1", label: "Now" },
  { id: "2", label: "Next" },
  { id: "3", label: "Later" },
  { id: "none", label: "No horizon" },
];

const STATUSES: { id: FilterState["status"]; label: string }[] = [
  { id: "all", label: "Any status" },
  ...ITEM_STATUSES.map((id) => ({ id, label: statusLabel(id) })),
];

const SPRINTS: { id: FilterState["sprint"]; label: string }[] = [
  { id: "all", label: "Any sprint" },
  { id: "1", label: "Sprint 1" },
  { id: "2", label: "Sprint 2" },
  { id: "none", label: "Not in a sprint" },
];

type FilterBarProps = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  shown: number;
  total: number;
  showHorizon?: boolean;
  compact?: boolean;
};

export function FilterBar({
  value,
  onChange,
  shown,
  total,
  showHorizon = true,
  compact = false,
}: FilterBarProps) {
  const advancedActive =
    value.status !== "all" || value.sprint !== "all" || value.type !== "all" || value.operator !== "all";
  const [advancedOpen, setAdvancedOpen] = useState(advancedActive);
  const advanced = (
    <>
      <ChipRow
        label="Status"
        options={STATUSES}
        current={value.status}
        onSelect={(status) => onChange({ ...value, status })}
      />
      <ChipRow
        label="Sprint"
        options={SPRINTS}
        current={value.sprint}
        onSelect={(sprint) => onChange({ ...value, sprint })}
      />
      <ChipRow
        label="Type"
        options={TYPES}
        current={value.type}
        onSelect={(type) => onChange({ ...value, type })}
      />
      <ChipRow
        label="Operator data"
        options={OPERATORS}
        current={value.operator}
        onSelect={(operator) => onChange({ ...value, operator })}
      />
    </>
  );

  return (
    <div className="filter-bar">
      <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="backlog-search">Search titles, issues, and repos</label>
        <input
          id="backlog-search"
          type="search"
          value={value.query}
          autoComplete="off"
          placeholder="Try triage, POST /score, pm4py"
          onChange={(event) => onChange({ ...value, query: event.target.value })}
        />
      </form>
      {showHorizon ? (
        <ChipRow
          label="Horizon"
          options={HORIZONS}
          current={value.horizon}
          onSelect={(horizon) => onChange({ ...value, horizon })}
        />
      ) : null}
      <ChipRow
        label="Quadrant"
        options={QUADRANTS}
        current={value.quadrant}
        onSelect={(quadrant) => onChange({ ...value, quadrant })}
      />
      {compact ? (
        <details
          className="more-filters"
          open={advancedOpen}
          onToggle={(event) => setAdvancedOpen(event.currentTarget.open)}
        >
          <summary>Status, sprint, type, and operator data</summary>
          <div className="more-filters-body">{advanced}</div>
        </details>
      ) : (
        advanced
      )}
      <div className="filter-meta">
        <p className="count" aria-live="polite">
          Showing {shown} of {total} backlog items
        </p>
        {isInitialFilter(value) ? null : (
          <button type="button" className="chip" onClick={() => onChange(INITIAL_FILTERS)}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

function ChipRow<T extends string>({
  label,
  options,
  current,
  onSelect,
}: {
  label: string;
  options: { id: T; label: string }[];
  current: T;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="chip-row" role="group" aria-label={label}>
      <span className="chip-label">{label}</span>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="chip"
          aria-pressed={current === option.id}
          onClick={() => onSelect(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
