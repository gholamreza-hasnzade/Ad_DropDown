import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  filterFlattenedItems,
  flattenItems,
  getAllOptions,
  isSelected,
} from "./utils";
import type { AdvancedDropdownProps, DropdownItem } from "./types";

const ITEM_HEIGHT = 36;
const GROUP_HEADER_HEIGHT = 32;

function getItemHeight(item: { type: string }) {
  return item.type === "group" ? GROUP_HEADER_HEIGHT : ITEM_HEIGHT;
}

export function AdvancedDropdown({
  items,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  maxHeight = 320,
  virtualizeThreshold = 50,
  disabled = false,
}: AdvancedDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [buttonWidth, setButtonWidth] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setButtonWidth(entry.contentRect.width);
    });
    observer.observe(el);
    setButtonWidth(el.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const flattened = useMemo(() => flattenItems(items), [items]);
  const filtered = useMemo(
    () => filterFlattenedItems(flattened, searchQuery),
    [flattened, searchQuery]
  );
  const filterableOptions = useMemo(
    () => getAllOptions(filtered),
    [filtered]
  );

  const shouldVirtualize =
    filtered.length >= virtualizeThreshold && virtualizeThreshold > 0;

  const rowHeights = useMemo(
    () => filtered.map((row) => getItemHeight(row)),
    [filtered]
  );
  const totalHeight = useMemo(
    () => rowHeights.reduce((a, b) => a + b, 0),
    [rowHeights]
  );

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => rowHeights[i] ?? ITEM_HEIGHT,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const handleSelectAll = useCallback(() => {
    const selectable = filterableOptions.filter((o) => !o.disabled);
    const newSelected = [...value];
    for (const opt of selectable) {
      if (!isSelected(opt, newSelected)) {
        newSelected.push(opt);
      }
    }
    onChange(newSelected);
  }, [filterableOptions, value, onChange]);

  const handleSelectNone = useCallback(() => {
    const selectableIds = new Set(filterableOptions.map((o) => o.id));
    onChange(value.filter((v) => !selectableIds.has(v.id)));
  }, [filterableOptions, value, onChange]);

  useEffect(() => {
    if (activeIndex >= 0 && shouldVirtualize) {
      virtualizer.scrollToIndex(activeIndex, { align: "auto" });
    }
  }, [activeIndex, shouldVirtualize, virtualizer]);

  return (
    <Listbox
      value={value}
      onChange={(selected: DropdownItem[]) => onChange(selected)}
      multiple
      disabled={disabled}
      as="div"
      className="relative w-full"
    >
      <ListboxButton
        ref={buttonRef}
        className={`
          relative w-full rounded-lg border bg-white px-4 py-2.5 pr-10 text-left
          text-sm shadow-sm ring-1 ring-inset ring-slate-300
          transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400
          data-[headlessui-state=open]:ring-2 data-[headlessui-state=open]:ring-amber-500
          dark:bg-slate-800 dark:ring-slate-600 dark:data-[headlessui-state=open]:ring-amber-500
        `}
      >
        <span className="block truncate">
          {value.length === 0
            ? placeholder
            : `${value.length} selected`}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-5 w-5 text-slate-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </ListboxButton>

      <ListboxOptions
        anchor="bottom start"
        style={buttonWidth ? { width: buttonWidth } : undefined}
        className={`
          z-50 mt-1 overflow-hidden rounded-lg border
          border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5
          dark:border-slate-700 dark:bg-slate-800
        `}
      >
        <div
          className="border-b border-slate-200 px-3 py-2 dark:border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2
              text-sm placeholder:text-slate-400 focus:border-amber-500 focus:outline-none
              focus:ring-1 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-800
              dark:placeholder:text-slate-500"
            autoComplete="off"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="rounded bg-amber-500 px-2 py-1 text-xs font-medium text-white
                transition hover:bg-amber-600 focus:outline-none focus:ring-2
                focus:ring-amber-500 focus:ring-offset-1"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={handleSelectNone}
              className="rounded border border-slate-300 px-2 py-1 text-xs font-medium
                text-slate-700 transition hover:bg-slate-100 focus:outline-none
                focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 dark:border-slate-600
                dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Select none
            </button>
          </div>
        </div>

        <div
          ref={parentRef}
          style={{
            height: filtered.length > 0 ? maxHeight : "auto",
            overflow: "auto",
          }}
          className="overscroll-contain"
        >
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No results found
            </div>
          ) : shouldVirtualize && virtualItems.length > 0 ? (
            <div
              style={{
                height: totalHeight,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualItems.map((virtualRow) => {
                const row = filtered[virtualRow.index];
                const height = rowHeights[virtualRow.index];

                if (row.type === "group") {
                  return (
                    <div
                      key={row.id}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualRow.start}px)`,
                        height,
                      }}
                      className="flex items-center bg-slate-100 px-3 py-1.5 text-xs font-semibold
                        uppercase tracking-wider text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                    >
                      {row.label}
                    </div>
                  );
                }

                return (
                  <ListboxOption
                    key={row.id}
                    value={row.item}
                    disabled={row.item.disabled}
                    onFocus={() => setActiveIndex(virtualRow.index)}
                    className={({ focus, selected }) => `
                      absolute left-0 flex w-full cursor-pointer items-center gap-2 px-3
                      py-2 text-sm transition-colors
                      ${focus ? "bg-amber-50 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100" : ""}
                      ${selected ? "bg-amber-50 font-medium dark:bg-amber-900/20" : ""}
                      ${row.item.disabled ? "cursor-not-allowed opacity-50" : ""}
                    `}
                    style={{
                      top: 0,
                      transform: `translateY(${virtualRow.start}px)`,
                      height,
                    }}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border
                        ${isSelected(row.item, value) ? "border-amber-500 bg-amber-500" : "border-slate-300"}
                      `}
                    >
                      {isSelected(row.item, value) && (
                        <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                        </svg>
                      )}
                    </span>
                    <span className="truncate">{row.item.label}</span>
                  </ListboxOption>
                );
              })}
            </div>
          ) : (
            <div className="py-1">
              {filtered.map((row) => {
                if (row.type === "group") {
                  return (
                    <div
                      key={row.id}
                      className="flex items-center bg-slate-100 px-3 py-1.5 text-xs font-semibold
                        uppercase tracking-wider text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                    >
                      {row.label}
                    </div>
                  );
                }

                return (
                  <ListboxOption
                    key={row.id}
                    value={row.item}
                    disabled={row.item.disabled}
                    className={({ focus, selected }) => `
                      flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors
                      ${focus ? "bg-amber-50 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100" : ""}
                      ${selected ? "bg-amber-50 font-medium dark:bg-amber-900/20" : ""}
                      ${row.item.disabled ? "cursor-not-allowed opacity-50" : ""}
                    `}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border
                        ${isSelected(row.item, value) ? "border-amber-500 bg-amber-500" : "border-slate-300"}
                      `}
                    >
                      {isSelected(row.item, value) && (
                        <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                        </svg>
                      )}
                    </span>
                    <span className="truncate">{row.item.label}</span>
                  </ListboxOption>
                );
              })}
            </div>
          )}
        </div>
      </ListboxOptions>
    </Listbox>
  );
}
