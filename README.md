# Advanced Dropdown (React + TypeScript + Vite)

A reusable dropdown component with search, grouping, optional multi-select, select all/none controls, and virtualization for large lists.

## Features

- Searchable list with grouping support
- Optional multi-select (`multiple` prop)
- Select all / select none (multi-select only)
- Virtualized rendering for large datasets
- Selected labels preview with overflow tooltip
- Dark mode friendly styles (Tailwind)

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Component usage

The component lives in [src/components/AdvancedDropdown](src/components/AdvancedDropdown). Example usage is in [src/App.tsx](src/App.tsx).

### Basic (multi-select)

```tsx
import { useState } from "react";
import { AdvancedDropdown } from "./components/AdvancedDropdown";
import type { DropdownItem } from "./components/AdvancedDropdown";

const items: DropdownItem[] = [
  { id: "apple", label: "Apple", value: "apple" },
  { id: "banana", label: "Banana", value: "banana" },
];

export function Example() {
  const [selected, setSelected] = useState<DropdownItem[]>([]);

  return (
    <AdvancedDropdown
      items={items}
      value={selected}
      onChange={setSelected}
      placeholder="Select fruit..."
    />
  );
}
```

### Single-select

```tsx
<AdvancedDropdown
  items={items}
  value={selected}
  onChange={setSelected}
  multiple={false}
  placeholder="Select one..."
/>
```

In single-select mode, the component still uses the array API. `value` is `DropdownItem[]` and `onChange` returns an array with zero or one item.

### Grouped items

```tsx
import type { DropdownGroup } from "./components/AdvancedDropdown";

const grouped: DropdownGroup[] = [
  {
    label: "Fruits",
    items: [
      { id: "apple", label: "Apple", value: "apple" },
      { id: "banana", label: "Banana", value: "banana" },
    ],
  },
  {
    label: "Vegetables",
    items: [
      { id: "carrot", label: "Carrot", value: "carrot" },
    ],
  },
];
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `DropdownItem[] \| DropdownGroup[]` | required | Flat or grouped items |
| `value` | `DropdownItem[]` | required | Selected items |
| `onChange` | `(selected: DropdownItem[]) => void` | required | Selection change handler |
| `multiple` | `boolean` | `true` | Enable multi-select |
| `placeholder` | `string` | `"Select..."` | Button placeholder |
| `searchPlaceholder` | `string` | `"Search..."` | Search input placeholder |
| `maxHeight` | `number` | `320` | Dropdown max height |
| `virtualizeThreshold` | `number` | `50` | Min item count to enable virtualization |
| `disabled` | `boolean` | `false` | Disable interaction |

## Styling

This project uses Tailwind CSS v4 via the Vite plugin. Global styles are in [src/index.css](src/index.css).
