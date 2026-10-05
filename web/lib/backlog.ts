import fs from "fs";
import path from "path";

import { regionFor } from "./labels";
import type { BacklogItem, HorizonId, ItemType, Quadrant } from "./types";

const REQUIRED = [
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

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < src.length; i += 1) {
    const char = src[i];
    if (inQuotes) {
      if (char === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      field = "";
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }

  if (rows.length < 2) {
    throw new Error("backlog.csv has no data rows");
  }

  const [header, ...body] = rows;
  if (!header) {
    throw new Error("backlog.csv is missing a header");
  }

  return body.map((cells, index) => {
    const record: Record<string, string> = {};
    header.forEach((key, cellIndex) => {
      record[key] = cells[cellIndex] ?? "";
    });
    for (const key of REQUIRED) {
      if (!(key in record)) {
        throw new Error(`backlog.csv row ${index + 2} is missing ${key}`);
      }
    }
    return record;
  });
}

function score(raw: string, id: string, field: string): number {
  if (!/^[1-5]$/.test(raw)) {
    throw new Error(`${id} ${field} is not an integer from 1 to 5: ${raw}`);
  }
  return Number(raw);
}

function parseRow(record: Record<string, string>): BacklogItem {
  const id = record.id;
  if (!id) throw new Error("A backlog row is missing an id");

  const type = record.type;
  if (type !== "epic" && type !== "story") {
    throw new Error(`${id} has an unknown type: ${type}`);
  }

  const horizon = record.horizon;
  if (horizon !== "" && horizon !== "1" && horizon !== "2" && horizon !== "3") {
    throw new Error(`${id} has an unknown horizon: ${horizon}`);
  }

  const sprint = record.sprint;
  if (sprint !== "" && sprint !== "1" && sprint !== "2") {
    throw new Error(`${id} has an unknown sprint: ${sprint}`);
  }

  const quadrant = record.quadrant;
  if (quadrant !== "do-first" && quadrant !== "major-bet" && quadrant !== "reconsider") {
    throw new Error(`${id} has an unknown quadrant: ${quadrant}`);
  }

  if (record.needs_operator_data !== "yes" && record.needs_operator_data !== "no") {
    throw new Error(`${id} needs_operator_data must be yes or no`);
  }

  if (!record.status) throw new Error(`${id} is missing a status`);
  if (!record.title) throw new Error(`${id} is missing a title`);

  const issueNumber = Number(record.issue_number);
  if (!Number.isInteger(issueNumber) || issueNumber < 1) {
    throw new Error(`${id} has a bad issue number: ${record.issue_number}`);
  }

  const value = score(record.value, id, "value");
  const effort = score(record.effort, id, "effort");
  const region = regionFor(value, effort);
  if (region !== quadrant) {
    throw new Error(
      `${id} quadrant ${quadrant} does not match value ${value} and effort ${effort}`,
    );
  }

  return {
    id,
    issueNumber,
    type: type as ItemType,
    title: record.title,
    horizon: horizon as HorizonId | "",
    sprint,
    value,
    effort,
    quadrant: quadrant as Quadrant,
    status: record.status,
    repos: record.repos ? record.repos.split(";").filter(Boolean) : [],
    needsOperatorData: record.needs_operator_data === "yes",
    labels: record.labels ? record.labels.split(";").filter(Boolean) : [],
    milestone: record.milestone,
  };
}

export function parseBacklog(csv: string): BacklogItem[] {
  const items = parseCsv(csv).map(parseRow);
  const ids = new Set<string>();
  const issues = new Set<number>();
  for (const item of items) {
    if (ids.has(item.id)) throw new Error(`Duplicate backlog id ${item.id}`);
    if (issues.has(item.issueNumber)) {
      throw new Error(`Duplicate issue number ${item.issueNumber}`);
    }
    ids.add(item.id);
    issues.add(item.issueNumber);
  }
  return items;
}

export function loadBacklog(): BacklogItem[] {
  const file = path.join(process.cwd(), "data", "backlog.csv");
  return parseBacklog(fs.readFileSync(file, "utf8"));
}

export function countHorizons(items: BacklogItem[]): number {
  return new Set(items.map((item) => item.horizon).filter((horizon) => horizon !== "")).size;
}
