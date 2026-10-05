export type ItemType = "epic" | "story";

export type HorizonId = "1" | "2" | "3";

export type Quadrant = "do-first" | "major-bet" | "reconsider";

export type BacklogItem = {
  id: string;
  issueNumber: number;
  type: ItemType;
  title: string;
  horizon: HorizonId | "";
  sprint: "1" | "2" | "";
  value: number;
  effort: number;
  quadrant: Quadrant;
  status: string;
  repos: string[];
  needsOperatorData: boolean;
  labels: string[];
  milestone: string;
};
