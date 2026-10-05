import { horizonName, quadrantLabel, shortLabel, statusLabel } from "@/lib/labels";
import { issueUrl, repoUrl } from "@/lib/links";
import type { BacklogItem } from "@/lib/types";

export function ItemDetail({
  item,
  note,
}: {
  item: BacklogItem;
  note?: string;
}) {
  return (
    <article className="detail" aria-labelledby={`detail-${item.id}`}>
      <p className="eyebrow">
        {item.type === "epic" ? "Epic" : "Story"} {item.id} · {horizonName(item.horizon)}
      </p>
      <h2 id={`detail-${item.id}`}>{item.title}</h2>
      <p className="detail-short">{shortLabel(item.issueNumber, item.title)}</p>
      <dl className="score-pair">
        <div>
          <dt>Value</dt>
          <dd>{item.value}</dd>
        </div>
        <div>
          <dt>Effort</dt>
          <dd>{item.effort}</dd>
        </div>
      </dl>
      <p className="detail-meta">
        {quadrantLabel(item.quadrant)} · {statusLabel(item.status)}
        {item.needsOperatorData ? " · Needs operator data" : ""}
      </p>
      <dl className="fact-list">
        <div>
          <dt>Issue</dt>
          <dd>
            <a href={issueUrl(item.issueNumber)}>#{item.issueNumber}</a>
          </dd>
        </div>
        <div>
          <dt>Sprint</dt>
          <dd>{item.sprint === null ? "None in the sheet" : `Sprint ${item.sprint}`}</dd>
        </div>
        {item.milestone ? (
          <div>
            <dt>Milestone</dt>
            <dd>{item.milestone}</dd>
          </div>
        ) : null}
        <div>
          <dt>Repos</dt>
          <dd>
            {item.repos.length === 0 ? (
              "None listed"
            ) : (
              <ul className="inline-links">
                {item.repos.map((name) => {
                  const href = repoUrl(name);
                  return (
                    <li key={name}>
                      {href ? (
                        <a href={href}>{name}</a>
                      ) : (
                        name
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </dd>
        </div>
        {item.labels.length > 0 ? (
          <div>
            <dt>Labels</dt>
            <dd>{item.labels.join(", ")}</dd>
          </div>
        ) : null}
      </dl>
      {note ? (
        <p className="note">
          <span className="kicker">From the roadmap notes</span>
          {note}
        </p>
      ) : null}
      <p className="fine-print">
        Value {item.value} and effort {item.effort} are the integers in backlog.csv.
        They are illustrative planning scores, not measured benefit and not hours.
      </p>
    </article>
  );
}
