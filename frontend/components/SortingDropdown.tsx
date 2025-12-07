"use client";

import { useState } from "react";

interface SortingDropdownProps {
  label?: string;
  options: { label: string; value: string }[];
  onChange?: (value: string) => void;
}

export default function SortingDropdown({
  label = "Sort By",
  options,
  onChange,
}: SortingDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange?.(value);
    setOpen(false);
  };

  const selectedLabel =
    options.find((o) => o.value === selected)?.label ?? "Select";

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
