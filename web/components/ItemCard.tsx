import { quadrantLabel, statusLabel } from "@/lib/labels";
import type { BacklogItem } from "@/lib/types";

export function ItemCard({
  item,
  selected = false,
  domId,
  onSelect,
}: {
  item: BacklogItem;
  selected?: boolean;
  domId?: string;
  onSelect: (item: BacklogItem) => void;
}) {
  return (
    <button
      id={domId}
      type="button"
      className="item-button"
      aria-pressed={selected}
      onClick={() => onSelect(item)}
    >
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
      <span className="badge">{statusLabel(item.status)}</span>
    </button>
  );
}
