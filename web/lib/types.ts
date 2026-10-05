export type HorizonId = 1 | 2 | 3;

export type ItemType = "epic" | "story";

export type Quadrant = "do-first" | "major-bet" | "reconsider" | "fill-in";

export type SprintId = 1 | 2;

/** One row of backlog.csv. Value and effort are the sheet's 1–5 integers. */
export type BacklogItem = {
  id: string;
  issueNumber: number;
  type: ItemType;
  title: string;
  horizon: HorizonId | null;
  sprint: SprintId | null;
  value: number;
  effort: number;
  quadrant: Quadrant;
  status: string;
  repos: string[];
  needsOperatorData: boolean;
  labels: string[];
  milestone: string;
};
