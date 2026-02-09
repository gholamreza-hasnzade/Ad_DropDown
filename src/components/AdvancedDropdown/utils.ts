import type { DropdownDataSource, DropdownGroup, DropdownItem, FlattenedItem } from "./types";

export function isGrouped(items: DropdownDataSource): items is DropdownGroup[] {
  if (items.length === 0) return false;
  const first = items[0];
  return "items" in first && Array.isArray(first.items);
}

export function flattenItems(items: DropdownDataSource): FlattenedItem[] {
  const result: FlattenedItem[] = [];

  if (isGrouped(items)) {
    for (const group of items) {
      result.push({
        type: "group",
        id: `group-${group.label}`,
        label: group.label,
      });
      for (const item of group.items) {
        result.push({ type: "option", id: item.id, item });
      }
    }
  } else {
    for (const item of items) {
      result.push({ type: "option", id: item.id, item });
    }
  }

  return result;
}

export function filterFlattenedItems(
  flattened: FlattenedItem[],
  searchQuery: string
): FlattenedItem[] {
  if (!searchQuery.trim()) return flattened;

  const query = searchQuery.toLowerCase().trim();
  const result: FlattenedItem[] = [];
  let currentGroup: (FlattenedItem & { type: "group" }) | null = null;
  let lastAddedGroupId: string | null = null;

  for (const row of flattened) {
    if (row.type === "group") {
      currentGroup = row;
    } else {
      const matches = row.item.label.toLowerCase().includes(query);
      if (matches) {
        if (currentGroup && currentGroup.id !== lastAddedGroupId) {
          result.push(currentGroup);
          lastAddedGroupId = currentGroup.id;
        }
        result.push(row);
      }
    }
  }

  return result;
}

export function getAllOptions(flattened: FlattenedItem[]): DropdownItem[] {
  return flattened
    .filter((r): r is FlattenedItem & { type: "option" } => r.type === "option")
    .map((r) => r.item);
}

export function isSelected(item: DropdownItem, selected: DropdownItem[]): boolean {
  return selected.some((s) => s.id === item.id);
}
