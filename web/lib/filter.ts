import { shortLabel } from "./labels";
import type { BacklogItem, Quadrant } from "./types";

export type FilterState = {
  query: string;
  quadrant: "all" | Quadrant;
  operator: "all" | "yes" | "no";
  type: "all" | "epic" | "story";
};

export const INITIAL_FILTERS: FilterState = {
  query: "",
  quadrant: "all",
  operator: "all",
  type: "all",
};

export function filterItems(items: BacklogItem[], filters: FilterState): BacklogItem[] {
  const query = filters.query.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.quadrant !== "all" && item.quadrant !== filters.quadrant) return false;
    if (filters.type !== "all" && item.type !== filters.type) return false;
    if (filters.operator === "yes" && !item.needsOperatorData) return false;
    if (filters.operator === "no" && item.needsOperatorData) return false;
    if (!query) return true;
    const haystack = [
      item.id,
      item.title,
      shortLabel(item.issueNumber, item.title),
      String(item.issueNumber),
      `#${item.issueNumber}`,
      item.status,
      item.quadrant,
      item.milestone,
      item.horizon,
      ...item.repos,
      ...item.labels,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}
