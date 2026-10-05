"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { HORIZONS, OKRS } from "@/lib/content";
import { filtersFromSearchParams, type FilterState } from "@/lib/filter";
import type { BacklogItem, HorizonId } from "@/lib/types";

function replaceQuery(
  pathname: string,
  params: URLSearchParams,
  router: ReturnType<typeof useRouter>,
) {
  const query = params.toString();
  router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
}

export function useDemoFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const horizonParam = params.get("h");
  const [filters, setFilters] = useState(() => filtersFromSearchParams(params));

  useEffect(() => {
    const nextHorizon = filtersFromSearchParams({
      get: (name) => (name === "h" ? horizonParam : null),
    }).horizon;
    setFilters((current) =>
      current.horizon === nextHorizon ? current : { ...current, horizon: nextHorizon },
    );
  }, [horizonParam]);

  function update(next: FilterState) {
    setFilters(next);
    if (next.horizon === filters.horizon) return;
    const query = new URLSearchParams(params.toString());
    if (next.horizon === "all") query.delete("h");
    else query.set("h", next.horizon);
    replaceQuery(pathname, query, router);
  }

  return [filters, update] as const;
}

export function useIssueSelection(items: BacklogItem[]) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const issue = params.get("issue");
  const note = params.get("note");
  const selected = items.find((item) => String(item.issueNumber) === issue) ?? null;
  const horizonNote = HORIZONS.find((horizon) => horizon.id === note) ?? null;

  function selectIssue(item: BacklogItem | null) {
    const next = new URLSearchParams(params.toString());
    next.delete("note");
    if (item) next.set("issue", String(item.issueNumber));
    else next.delete("issue");
    replaceQuery(pathname, next, router);
  }

  function selectNote(id: HorizonId | null) {
    const next = new URLSearchParams(params.toString());
    next.delete("issue");
    if (id) next.set("note", id);
    else next.delete("note");
    replaceQuery(pathname, next, router);
  }

  return {
    selected,
    horizonNote: selected ? null : horizonNote,
    selectIssue,
    selectNote,
  };
}

export function useOkrSelection() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const requested = params.get("objective");
  const objective = OKRS.some((item) => item.n === requested) ? requested! : OKRS[0].n;
  const current = OKRS.find((item) => item.n === objective) ?? OKRS[0];
  const requestedKr = params.get("kr");
  const kr = current.krs.some((item) => item.id === requestedKr) ? requestedKr! : current.krs[0].id;

  function select(objectiveN: string, krId: string) {
    const next = new URLSearchParams(params.toString());
    next.set("objective", objectiveN);
    next.set("kr", krId);
    next.delete("issue");
    replaceQuery(pathname, next, router);
  }

  return { objective, kr, select };
}
