"use client";

import Link from "next/link";

import { ItemCard } from "@/components/ItemCard";
import { useIssueSelection, useOkrSelection } from "@/components/useDemoQuery";
import { OKRS, issueUrl } from "@/lib/content";
import { quadrantLabel, statusLabel } from "@/lib/labels";
import type { BacklogItem } from "@/lib/types";

export function OkrsExplorer({ items }: { items: BacklogItem[] }) {
  const { objective, kr, select } = useOkrSelection();
  const { selected, selectIssue } = useIssueSelection(items);
  const current = OKRS.find((item) => item.n === objective) ?? OKRS[0];
  const keyResult = current.krs.find((item) => item.id === kr) ?? current.krs[0];
  const linked = keyResult.issues
    .map((issueNumber) => items.find((item) => item.issueNumber === issueNumber))
    .filter((item): item is BacklogItem => item !== undefined);

  return (
    <div className="okr-explorer">
      <div className="okr-pick" role="group" aria-label="Objective">
        {OKRS.map((item) => (
          <button
            key={item.n}
            type="button"
            aria-pressed={item.n === current.n}
            onClick={() => select(item.n, item.krs[0].id)}
          >
            <span className="kicker">Objective {item.n}</span>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>
      <div className="workspace">
        <div className="kr-list" role="group" aria-label={`Key results for objective ${current.n}`}>
          {current.krs.map((item) => (
            <button
              key={item.id}
              type="button"
              className="kr-button"
              aria-pressed={item.id === keyResult.id}
              onClick={() => select(current.n, item.id)}
            >
              <span className="issue-no">{item.id}</span>
              <span>{item.target}</span>
            </button>
          ))}
        </div>
        <article className="inspector" aria-live="polite">
          <p className="kicker">
            Objective {current.n} · {keyResult.id}
          </p>
          <h2>{current.title}</h2>
          <div className="compare">
            <section>
              <h3>Illustrative target</h3>
              <p>{keyResult.target}</p>
            </section>
            <section>
              <h3>What the demos already show</h3>
              <p>{keyResult.shown}</p>
            </section>
          </div>
          <p className="kicker">Linked backlog rows</p>
          <ol className="stack">
            {linked.map((item) => (
              <li key={item.id}>
                <ItemCard
                  item={item}
                  domId={`okr-item-${item.id}`}
                  selected={selected?.id === item.id}
                  onSelect={selectIssue}
                />
              </li>
            ))}
          </ol>
          {selected && keyResult.issues.some((issue) => issue === selected.issueNumber) ? (
            <div className="detail-block">
              <p>
                #{selected.issueNumber} · {statusLabel(selected.status)} · Value {selected.value} ·
                Effort {selected.effort} · {quadrantLabel(selected.quadrant)}
              </p>
              <p>
                <Link className="text-link" href={`/?issue=${selected.issueNumber}`}>
                  Open #{selected.issueNumber} on the board
                </Link>
                {" · "}
                <a href={issueUrl(selected.issueNumber)}>GitHub issue</a>
              </p>
            </div>
          ) : (
            <p className="note">Select a linked row, then open it on the Now / Next / Later board.</p>
          )}
        </article>
      </div>
    </div>
  );
}
