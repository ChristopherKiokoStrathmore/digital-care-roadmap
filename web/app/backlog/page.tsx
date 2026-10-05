import type { Metadata } from "next";

import { BacklogExplorer } from "@/components/BacklogExplorer";
import { loadBacklog } from "@/lib/backlog";

export const metadata: Metadata = {
  title: "Value versus effort",
  description:
    "Scatter and scored list of the 17 backlog rows. Value and effort are copied from backlog.csv and are not recomputed.",
};

export default function Page() {
  const items = loadBacklog();

  return <BacklogExplorer items={items} />;
}
