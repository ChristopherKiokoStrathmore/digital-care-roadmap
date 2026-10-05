import type { Metadata } from "next";

import { PilotStrip } from "@/components/PilotStrip";
import { RoadmapBoard } from "@/components/RoadmapBoard";
import { loadBacklog } from "@/lib/backlog";

export const metadata: Metadata = {
  title: "Now, Next, Later",
  description:
    "Interactive Now, Next, and Later board for the digital care roadmap. Scores are the value and effort columns in backlog.csv.",
};

export default function Page() {
  const items = loadBacklog();

  return (
    <>
      <RoadmapBoard items={items} />
      <PilotStrip />
    </>
  );
}
