export type DropdownItem = {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
};

export type DropdownGroup = {
  label: string;
  items: DropdownItem[];
};

export type DropdownDataSource = DropdownItem[] | DropdownGroup[];

export type FlattenedItem =
  | { type: "group"; id: string; label: string }
  | { type: "option"; id: string; item: DropdownItem };

export type AdvancedDropdownProps = {
  items: DropdownDataSource;
  value: DropdownItem[];
  onChange: (selected: DropdownItem[]) => void;
  /** Enable multi-select. Default: true */
  multiple?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  maxHeight?: number;
  /** Min item count to enable virtualization. Use 0 to disable. Default: 50 */
  virtualizeThreshold?: number;
  disabled?: boolean;
};
