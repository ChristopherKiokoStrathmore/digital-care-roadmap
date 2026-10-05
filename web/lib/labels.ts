import type { HorizonId, Quadrant } from "./types";

const STATUS_LABEL: Record<string, string> = {
  "demo-exists": "Demo exists",
  "demo-partial": "Demo partial",
  "export-not-run": "Export, not run",
  "not-started": "Not started",
  "not-built": "Not built",
  declined: "Declined",
};

const QUADRANT_LABEL: Record<Quadrant, string> = {
  "do-first": "Do first",
  "major-bet": "Major bet",
  reconsider: "Reconsider",
};

/** README value-table names. Epics are not in that table. */
const STORY_SHORT: Record<number, string> = {
  4: "Triage quality gap",
  5: "Abstain at 0.6",
  6: "n8n emergency branch",
  7: "Labelled triage sample",
  9: "POST /score",
  10: "CI gates",
  11: "Fairness table",
  12: "Operator churn refit",
  14: "Synthetic journey KPIs",
  15: "Assumption ROI",
  16: "Operator journey swap",
  17: "Self-healing loop",
  18: "pm4py",
  19: "Streamlit",
};

export function statusLabel(status: string): string {
  return STATUS_LABEL[status] ?? status;
}

export function quadrantLabel(quadrant: Quadrant): string {
  return QUADRANT_LABEL[quadrant];
}

export function shortLabel(issueNumber: number, title: string): string {
  return STORY_SHORT[issueNumber] ?? title.replace(/^Epic:\s*/, "");
}

export function horizonKicker(horizon: HorizonId | ""): string {
  switch (horizon) {
    case "1":
      return "Now";
    case "2":
      return "Next";
    case "3":
      return "Later";
    default:
      return "No horizon";
  }
}

/**
 * Region implied by the divider between scores 2 and 3.
 * The sheet's quadrant column is what the UI prints. This helper only checks
 * that the column still matches that divider.
 */
export function regionFor(value: number, effort: number): Quadrant | "fill-in" {
  const highValue = value >= 3;
  const highEffort = effort >= 3;
  if (highValue && !highEffort) return "do-first";
  if (highValue && highEffort) return "major-bet";
  if (!highValue && highEffort) return "reconsider";
  return "fill-in";
}
