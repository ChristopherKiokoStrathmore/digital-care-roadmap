import Link from "next/link";

import {
  HORIZONS,
  STORY_INTENT,
  issueUrl,
  objectivesForIssue,
  repoUrl,
} from "@/lib/content";
import { horizonKicker, quadrantLabel, statusLabel } from "@/lib/labels";
import type { BacklogItem } from "@/lib/types";

type Horizon = (typeof HORIZONS)[number];

export function Inspector({
  item,
  horizon,
  hiddenByFilters = false,
  onClose,
}: {
  item: BacklogItem | null;
  horizon: Horizon | null;
  hiddenByFilters?: boolean;
  onClose: () => void;
}) {
  return (
    <aside className="inspector" id="detail-panel" aria-live="polite">
      {item ? (
        <ItemDetail item={item} hiddenByFilters={hiddenByFilters} onClose={onClose} />
      ) : horizon ? (
        <HorizonDetail horizon={horizon} onClose={onClose} />
      ) : (
        <div>
          <p className="kicker">Detail</p>
          <h2>Select a card</h2>
          <p className="note">
            Choose Now, Next, or Later, then open a backlog row. This panel reads that
            row from the sheet: value, effort, status, and the repos named on it.
          </p>
        </div>
      )}
    </aside>
  );
}

function ItemDetail({
  item,
  hiddenByFilters,
  onClose,
}: {
  item: BacklogItem;
  hiddenByFilters: boolean;
  onClose: () => void;
}) {
  const intent = STORY_INTENT[item.issueNumber];
  const objectives = objectivesForIssue(item.issueNumber);
  const horizonName = horizonKicker(item.horizon);
  const milestone =
    item.milestone && item.milestone !== `Sprint ${item.sprint}` && item.milestone !== horizonName
      ? item.milestone
      : "";

  return (
    <div>
      <div className="panel-head">
        <p className="kicker">
          #{item.issueNumber} · {item.type}
        </p>
        <button type="button" className="chip" onClick={onClose}>
          Close
        </button>
      </div>
      <h2>{item.title}</h2>
      {intent ? <p>{intent}</p> : null}
      <p className="score-line">
        <span>Value {item.value}</span>
        <span>Effort {item.effort}</span>
        <span className="quadrant" data-quadrant={item.quadrant}>
          {quadrantLabel(item.quadrant)}
        </span>
      </p>
      <p>
        {item.id} · {statusLabel(item.status)} · {horizonName}
        {item.sprint ? ` · Sprint ${item.sprint}` : ""}
        {milestone ? ` · ${milestone}` : ""}
      </p>
      <p>Operator data: {item.needsOperatorData ? "yes" : "no"}</p>
      <p>Labels: {item.labels.length > 0 ? item.labels.join(", ") : "none"}</p>
      {hiddenByFilters ? (
        <p className="note">The current filters hide this row on the board. The sheet row is unchanged.</p>
      ) : null}
      <p>
        <a href={issueUrl(item.issueNumber)}>Issue #{item.issueNumber}</a>
      </p>
      {item.repos.length > 0 ? (
        <ul className="repo-list">
          {item.repos.map((repo) => (
            <li key={repo}>
              <a href={repoUrl(repo)}>{repo}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No repo listed on this row.</p>
      )}
      <div className="detail-block">
        <p className="kicker">Illustrative OKR</p>
        {objectives.length > 0 ? (
          <ul className="inline-links">
            {objectives.map((objective) => (
              <li key={`${objective.n}-${objective.kr}`}>
                <Link href={`/okrs?objective=${objective.n}&kr=${objective.kr}`}>
                  Objective {objective.n} · {objective.kr}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="note">No key result in the illustrative set points at this row.</p>
        )}
      </div>
    </div>
  );
}

function HorizonDetail({ horizon, onClose }: { horizon: Horizon; onClose: () => void }) {
  return (
    <div>
      <div className="panel-head">
        <p className="kicker">{horizon.kicker}</p>
        <button type="button" className="chip" onClick={onClose}>
          Close
        </button>
      </div>
      <h2>{horizon.title}</h2>
      <ul className="facts">
        {horizon.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {horizon.note.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <p>
        <strong>Still needs. </strong>
        {horizon.stillNeeds}
      </p>
      <p>
        <Link className="text-link" href={`/article#horizon-${horizon.id}`}>
          Read this horizon in the write-up
        </Link>
      </p>
    </div>
  );
}
