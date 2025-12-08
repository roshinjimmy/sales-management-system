"use client";

import { useState } from "react";

interface FilterDropdownProps {
  label: string;
  options: string[];
  multi?: boolean;
  onChange?: (selected: string[] | string) => void;
}

export default function FilterDropdown({
  label,
  options,
  multi = false,
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    if (multi) {
      const newSelected = selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option];
      setSelected(newSelected);
      onChange?.(newSelected);
      return;
    }

    if (selected[0] === option) {
      setSelected([]);
      onChange?.("");
      setOpen(false);
      return;
    }
    setSelected([option]);
    onChange?.(option);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center gap-2"
      >
        {label} {selected.length > 0 ? `(${selected.length})` : ""}
        <span className="text-gray-500">▾</span>
      </button>

      {open && (
        <div className="absolute mt-2 w-56 bg-white border rounded-md shadow-lg z-20 max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => toggleOption(option)}
              className={`px-4 py-2 cursor-pointer text-sm flex items-center gap-2 hover:bg-gray-100 ${
                selected.includes(option) ? "bg-gray-200 font-medium" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                readOnly
                className="w-4 h-4"
              />
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
