import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

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
          {items.length - stories} epics) across {countHorizons(items)} horizons. Filter
          the plot and the table, then open a row on the board. {SCORE_NOTE}
        </p>
        <p>
          <Link className="text-link" href="/article#backlog-sheet">
            Read the backlog in the write-up
          </Link>
        </p>
      </header>
      <div className="section-gap">
        <Suspense fallback={<p className="note">Loading the backlog.</p>}>
          <BacklogExplorer items={items} />
        </Suspense>
      </div>
    </main>
  );
}
