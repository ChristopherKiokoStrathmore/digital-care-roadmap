import { cache } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { parseCsv } from "@/lib/csv";
import type {
  BacklogItem,
  HorizonId,
  ItemType,
  Quadrant,
  SprintId,
} from "@/lib/types";

const COLUMNS = [
  "id",
  "issue_number",
  "type",
  "title",
  "horizon",
  "sprint",
  "value",
  "effort",
  "quadrant",
  "status",
  "repos",
  "needs_operator_data",
  "labels",
  "milestone",
] as const;

const QUADRANTS = new Set<Quadrant>([
  "do-first",
  "major-bet",
  "reconsider",
  "fill-in",
]);

/**
 * Region implied by the divider between scores 2 and 3.
 * Same rule as scripts/story_facts.py. Used only to refuse a sheet
 * whose quadrant column disagrees with that divider.
 */
function band(value: number, effort: number): Quadrant {
  const highValue = value >= 3;
  const highEffort = effort >= 3;
  if (highValue && !highEffort) return "do-first";
  if (highValue && highEffort) return "major-bet";
  if (!highValue && highEffort) return "reconsider";
  return "fill-in";
}

function score(raw: string, field: string, id: string): number {
  if (!/^[1-5]$/.test(raw)) {
    throw new Error(
      `${id} ${field} must be an integer from 1 to 5 in backlog.csv. Received ${JSON.stringify(raw)}.`,
    );
  }
  return Number(raw);
}

function splitList(raw: string): string[] {
  return raw
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function rowToItem(row: Record<string, string>): BacklogItem {
  const id = row.id?.trim() ?? "";
  if (!id) {
    throw new Error("backlog.csv has a row with an empty id.");
  }

  const issueNumber = Number(row.issue_number);
  if (!Number.isInteger(issueNumber)) {
    throw new Error(`${id} has an issue number that is not an integer.`);
  }

  const type = row.type;
  if (type !== "epic" && type !== "story") {
    throw new Error(`${id} has type ${JSON.stringify(type)}.`);
  }

  const title = row.title?.trim() ?? "";
  if (!title) {
    throw new Error(`${id} has an empty title.`);
  }

  let horizon: HorizonId | null = null;
  if (row.horizon !== "") {
    if (row.horizon !== "1" && row.horizon !== "2" && row.horizon !== "3") {
      throw new Error(`${id} has horizon ${JSON.stringify(row.horizon)}.`);
    }
    horizon = Number(row.horizon) as HorizonId;
  }

  let sprint: SprintId | null = null;
  if (row.sprint !== "") {
    if (row.sprint !== "1" && row.sprint !== "2") {
      throw new Error(`${id} has sprint ${JSON.stringify(row.sprint)}.`);
    }
    sprint = Number(row.sprint) as SprintId;
  }

  const value = score(row.value ?? "", "value", id);
  const effort = score(row.effort ?? "", "effort", id);

  const quadrant = row.quadrant as Quadrant;
  if (!QUADRANTS.has(quadrant)) {
    throw new Error(`${id} has quadrant ${JSON.stringify(row.quadrant)}.`);
  }
  if (quadrant !== band(value, effort)) {
    throw new Error(
      `${id} quadrant ${quadrant} disagrees with the divider between scores 2 and 3.`,
    );
  }

  if (row.needs_operator_data !== "yes" && row.needs_operator_data !== "no") {
    throw new Error(
      `${id} needs_operator_data must be yes or no. Received ${JSON.stringify(row.needs_operator_data)}.`,
    );
  }

  const status = row.status?.trim() ?? "";
  if (!status) {
    throw new Error(`${id} has an empty status.`);
  }

  return {
    id,
    issueNumber,
    type: type as ItemType,
    title,
    horizon,
    sprint,
    value,
    effort,
    quadrant,
    status,
    repos: splitList(row.repos ?? ""),
    needsOperatorData: row.needs_operator_data === "yes",
    labels: splitList(row.labels ?? ""),
    milestone: row.milestone?.trim() ?? "",
  };
}

function readBacklog(): BacklogItem[] {
  const file = join(process.cwd(), "backlog.csv");
  const text = readFileSync(file, "utf8");
  const records = parseCsv(text);
  if (records.length === 0) {
    throw new Error("backlog.csv has no data rows.");
  }

  const header = Object.keys(records[0] ?? {});
  if (header.join(",") !== COLUMNS.join(",")) {
    throw new Error(
      `backlog.csv columns must be ${COLUMNS.join(", ")}. Received ${header.join(", ")}.`,
    );
  }

  const items = records.map(rowToItem);
  const issues = items.map((item) => item.issueNumber).sort((a, b) => a - b);
  const expected = Array.from({ length: 17 }, (_, index) => index + 3);
  if (issues.join(",") !== expected.join(",")) {
    throw new Error(
      `backlog.csv must list issues #3 to #19 once each. Parsed ${issues.join(", ")}.`,
    );
  }

  const ids = new Set(items.map((item) => item.id));
  if (ids.size !== items.length) {
    throw new Error("backlog.csv ids must be unique.");
  }

  return items;
}

export const loadBacklog = cache(readBacklog);
