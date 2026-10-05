import { ITEM_STATUSES, shortLabel, statusLabel, type ItemStatus } from "./labels";
import type { BacklogItem, HorizonId, Quadrant } from "./types";

export type FilterState = {
  query: string;
  quadrant: "all" | Quadrant;
  operator: "all" | "yes" | "no";
  type: "all" | "epic" | "story";
  horizon: "all" | HorizonId | "none";
  status: "all" | ItemStatus;
  sprint: "all" | "1" | "2" | "none";
};

export const INITIAL_FILTERS: FilterState = {
  query: "",
  quadrant: "all",
  operator: "all",
  type: "all",
  horizon: "all",
  status: "all",
  sprint: "all",
};

const QUADRANTS = ["all", "do-first", "major-bet", "reconsider"] as const;
const OPERATORS = ["all", "yes", "no"] as const;
const TYPES = ["all", "epic", "story"] as const;
const HORIZONS = ["all", "1", "2", "3", "none"] as const;
const STATUSES = ["all", ...ITEM_STATUSES] as const;
const SPRINTS = ["all", "1", "2", "none"] as const;

function pick<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export function filtersFromSearchParams(params: { get(name: string): string | null }): FilterState {
  return {
    query: params.get("q") ?? "",
    quadrant: pick(params.get("quadrant"), QUADRANTS, "all"),
    operator: pick(params.get("operator"), OPERATORS, "all"),
    type: pick(params.get("type"), TYPES, "all"),
    horizon: pick(params.get("h"), HORIZONS, "all"),
    status: pick(params.get("status"), STATUSES, "all"),
    sprint: pick(params.get("sprint"), SPRINTS, "all"),
  };
}

export function isInitialFilter(filters: FilterState): boolean {
  return (
    filters.query.trim() === "" &&
    filters.quadrant === "all" &&
    filters.operator === "all" &&
    filters.type === "all" &&
    filters.horizon === "all" &&
    filters.status === "all" &&
    filters.sprint === "all"
  );
}

export function filterItems(items: BacklogItem[], filters: FilterState): BacklogItem[] {
  const query = filters.query.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.quadrant !== "all" && item.quadrant !== filters.quadrant) return false;
    if (filters.type !== "all" && item.type !== filters.type) return false;
    if (filters.operator === "yes" && !item.needsOperatorData) return false;
    if (filters.operator === "no" && item.needsOperatorData) return false;
    if (filters.horizon === "none" && item.horizon !== "") return false;
    if (filters.horizon !== "all" && filters.horizon !== "none" && item.horizon !== filters.horizon) {
      return false;
    }
    if (filters.status !== "all" && item.status !== filters.status) return false;
    if (filters.sprint === "none" && item.sprint !== "") return false;
    if (filters.sprint !== "all" && filters.sprint !== "none" && item.sprint !== filters.sprint) {
      return false;
    }
    if (!query) return true;
    const haystack = [
      item.id,
      item.title,
      shortLabel(item.issueNumber, item.title),
      String(item.issueNumber),
      `#${item.issueNumber}`,
      item.status,
      statusLabel(item.status),
      item.quadrant,
      item.milestone,
      item.horizon,
      item.sprint ? `sprint ${item.sprint}` : "",
      ...item.repos,
      ...item.labels,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}
