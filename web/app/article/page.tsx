import type { Metadata } from "next";
import Link from "next/link";

import { WriteUp } from "@/components/WriteUp";
import { CAVEAT } from "@/lib/content";
import { loadBacklog } from "@/lib/backlog";

export const metadata: Metadata = {
  title: "Write-up",
  description:
    "The digital care roadmap write-up: Now, Next, and Later, illustrative OKRs, and the value-versus-effort backlog.",
};

export default function ArticlePage() {
  const items = loadBacklog();

  return (
    <main id="content" className="wrap page">
      <header className="page-head">
        <p className="kicker">Write-up</p>
        <h1>Which care-analytics capability should a telco build first?</h1>
        <p className="lede">
          And how would you know it worked? The narrative stays here. The board, OKRs,
          and backlog are the parts you click.
        </p>
        <p className="caveat">{CAVEAT}</p>
        <p>
          <Link className="text-link" href="/">
            Open the interactive board
          </Link>
        </p>
      </header>
      <WriteUp items={items} />
    </main>
  );
}
