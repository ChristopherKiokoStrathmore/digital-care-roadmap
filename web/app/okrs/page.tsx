import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { OkrsExplorer } from "@/components/OkrsExplorer";
import { OkrTables } from "@/components/OkrTables";
import { CAVEAT } from "@/lib/content";
import { loadBacklog } from "@/lib/backlog";

export const metadata: Metadata = {
  title: "Illustrative OKRs",
  description:
    "Click an illustrative OKR, compare the target with what the public demos already show, and open the linked backlog row.",
};

export default function OkrsPage() {
  const items = loadBacklog();

  return (
    <main id="content" className="wrap page">
      <header className="page-head">
        <p className="kicker">Illustrative</p>
        <h1>OKRs</h1>
        <p className="lede">
          Pick an objective, then a key result. The target stays a planning label. The
          second pane is what the public demos already show.
        </p>
        <p className="caveat">{CAVEAT}</p>
        <p>
          <Link className="text-link" href="/article#okrs">
            Read the OKRs in the write-up
          </Link>
        </p>
      </header>
      <Suspense fallback={<p className="note">Loading the OKR view.</p>}>
        <OkrsExplorer items={items} />
      </Suspense>
      <details className="fold">
        <summary>Show the full illustrative table</summary>
        <OkrTables />
      </details>
    </main>
  );
}
