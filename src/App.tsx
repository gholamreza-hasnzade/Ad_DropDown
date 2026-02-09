import { useState } from "react";
import { AdvancedDropdown } from "./components/AdvancedDropdown";
import type { DropdownGroup, DropdownItem } from "./components/AdvancedDropdown";

const groupedItems: DropdownGroup[] = [
  {
    label: "Fruits",
    items: [
      { id: "apple", label: "Apple", value: "apple" },
      { id: "banana", label: "Banana", value: "banana" },
      { id: "cherry", label: "Cherry", value: "cherry" },
      { id: "date", label: "Date", value: "date" },
      { id: "elderberry", label: "Elderberry", value: "elderberry" },
    ],
  },
  {
    label: "Vegetables",
    items: [
      { id: "asparagus", label: "Asparagus", value: "asparagus" },
      { id: "broccoli", label: "Broccoli", value: "broccoli" },
      { id: "carrot", label: "Carrot", value: "carrot" },
      { id: "dill", label: "Dill", value: "dill" },
    ],
  },
  {
    label: "Proteins",
    items: [
      { id: "beef", label: "Beef", value: "beef" },
      { id: "chicken", label: "Chicken", value: "chicken" },
      { id: "fish", label: "Fish", value: "fish" },
    ],
  },
];

const flatItems: DropdownItem[] = Array.from({ length: 200 }, (_, i) => ({
  id: `item-${i}`,
  label: `Option ${i + 1}`,
  value: `item-${i}`,
}));

function App() {
  const [groupedSelected, setGroupedSelected] = useState<DropdownItem[]>([]);
  const [flatSelected, setFlatSelected] = useState<DropdownItem[]>([]);

  return (
    <div className="min-h-screen bg-slate-50 p-8 dark:bg-slate-900">
      <div className="mx-auto max-w-2xl space-y-12">
        <div>
          <h1 className="mb-6 text-2xl font-bold text-slate-800 dark:text-slate-100">
            Advanced Dropdown
          </h1>
          <p className="mb-8 text-slate-600 dark:text-slate-400">
            Multi-select with search, grouping, select all/none, selection count,
            and virtualization for large lists.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Grouped items (Fruits, Vegetables, Proteins)
          </h2>
          <AdvancedDropdown
            items={groupedItems}
            value={groupedSelected}
            onChange={setGroupedSelected}
            placeholder="Select foods..."
            searchPlaceholder="Search..."
            virtualizeThreshold={0}
            multiple={false}

          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Large list (200 items, virtualized)
          </h2>
          <AdvancedDropdown
            items={flatItems}
            value={flatSelected}
            onChange={setFlatSelected}
            placeholder="Select options..."
            searchPlaceholder="Search..."
            virtualizeThreshold={10}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
