"use client";

import type { FilterState } from "@/lib/filter";

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

type FilterBarProps = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  shown: number;
  total: number;
};

export function FilterBar({ value, onChange, shown, total }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <form
        className="search"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
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
      <ChipRow
        label="Quadrant"
        options={QUADRANTS}
        current={value.quadrant}
        onSelect={(quadrant: FilterState["quadrant"]) => onChange({ ...value, quadrant })}
      />
      <ChipRow
        label="Type"
        options={TYPES}
        current={value.type}
        onSelect={(type: FilterState["type"]) => onChange({ ...value, type })}
      />
      <ChipRow
        label="Operator data"
        options={OPERATORS}
        current={value.operator}
        onSelect={(operator: FilterState["operator"]) => onChange({ ...value, operator })}
      />
      <p className="count" aria-live="polite">
        Showing {shown} of {total} backlog items
      </p>
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
