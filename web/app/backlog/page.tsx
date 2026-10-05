import type { Metadata } from "next";

import { BacklogExplorer } from "@/components/BacklogExplorer";
import { SCORE_NOTE } from "@/lib/content";
import { countHorizons, loadBacklog } from "@/lib/backlog";

export const metadata: Metadata = {
  title: "Backlog",
  description:
    "Value versus effort for every row in backlog.csv. Scores are illustrative planning labels on a 1 to 5 scale.",
};

export default function BacklogPage() {
  const items = loadBacklog();
  const stories = items.filter((item) => item.type === "story").length;

  return (
    <main id="content" className="wrap page">
      <header className="page-head">
        <p className="kicker">Value versus effort</p>
        <h1>Backlog</h1>
        <p className="lede">
          {items.length} rows from the sheet ({stories} stories and{" "}
          {items.length - stories} epics) across {countHorizons(items)} horizons.{" "}
          {SCORE_NOTE}
        </p>
      </header>
      <div className="section-gap">
        <BacklogExplorer items={items} />
      </div>
    </main>
  );
}
