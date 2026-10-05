import type { HorizonId, Quadrant } from "@/lib/types";

const QUADRANTS: Record<Quadrant, string> = {
  "do-first": "Do first",
  "major-bet": "Major bet",
  reconsider: "Reconsider",
  "fill-in": "Fill-in",
};

const STATUSES: Record<string, string> = {
  "demo-exists": "Demo exists",
  "demo-partial": "Demo partial",
  "export-not-run": "Export, not run",
  "not-started": "Not started",
  "not-built": "Not built",
  declined: "Declined",
};

/**
 * Short chart labels already used in the README value table and epic line.
 * Missing keys fall back to the CSV title at the call site.
 */
export const SHORT_LABEL: Record<number, string> = {
  3: "Triage",
  4: "Triage quality gap",
  5: "Abstain at 0.6",
  6: "n8n emergency branch",
  7: "Labelled triage sample",
  8: "NBA and churn",
  9: "POST /score",
  10: "CI gates",
  11: "Fairness table",
  12: "Operator churn refit",
  13: "Self-healing journeys",
  14: "Synthetic journey KPIs",
  15: "Assumption ROI",
  16: "Operator journey swap",
  17: "Self-healing loop",
  18: "pm4py",
  19: "Streamlit",
};

export function quadrantLabel(quadrant: Quadrant): string {
  return QUADRANTS[quadrant];
}

export function statusLabel(status: string): string {
  return STATUSES[status] ?? status;
}

export function horizonName(horizon: HorizonId | null): string {
  if (horizon === 1) return "Now";
  if (horizon === 2) return "Next";
  if (horizon === 3) return "Later";
  return "No horizon";
}

export function shortLabel(issueNumber: number, title: string): string {
  return SHORT_LABEL[issueNumber] ?? title;
}
