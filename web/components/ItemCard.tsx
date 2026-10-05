import { horizonKicker, quadrantLabel, statusLabel } from "@/lib/labels";
import { issueUrl, repoUrl } from "@/lib/content";
import type { BacklogItem } from "@/lib/types";

export function ItemCard({ item }: { item: BacklogItem }) {
  return (
    <details className="item">
      <summary>
        <span className="item-top">
          <span className="issue-no">#{item.issueNumber}</span>
          <span className="type-tag">{item.type}</span>
        </span>
        <span className="item-title">{item.title}</span>
        <span className="score-line">
          <span>Value {item.value}</span>
          <span>Effort {item.effort}</span>
          <span className="quadrant" data-quadrant={item.quadrant}>
            {quadrantLabel(item.quadrant)}
          </span>
        </span>
      </summary>
      <div className="detail">
        <p>
          {item.id} · {statusLabel(item.status)} · {horizonKicker(item.horizon)}
          {item.sprint ? ` · Sprint ${item.sprint}` : ""}
          {item.milestone ? ` · ${item.milestone}` : ""}
        </p>
        <p>Operator data: {item.needsOperatorData ? "yes" : "no"}</p>
        <p>Labels: {item.labels.length > 0 ? item.labels.join(", ") : "none"}</p>
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
      </div>
    </details>
  );
}
