"use client";

import { useState, useEffect } from "react";

interface SortingDropdownProps {
  label?: string;
  options: { label: string; value: string }[];
  onChange?: (value: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export default function SortingDropdown({
  label = "Sort By",
  options,
  onChange,
  sortBy,
  sortOrder,
}: SortingDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    setSelected(sortBy || "");
  }, [sortBy]);

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange?.(value);
    setOpen(false);
  };

  let selectedLabel = "None";

  if (sortBy) {
    const found = options.find((o) => o.value === sortBy);
    if (found) {
      selectedLabel = found.label + (sortOrder === "asc" ? " ↑" : " ↓");
    }
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-4 py-2 bg-white border rounded-md shadow text-sm hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
      >
        {label} : {selectedLabel}
        <span className="text-gray-500">▾</span>
      </button>

      {open && (
        <div className="absolute mt-2 w-56 bg-white border rounded-md shadow-lg z-20 max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 ${
                selected === option.value ? "bg-gray-200 font-medium" : ""
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
