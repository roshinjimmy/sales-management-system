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
    } else {
      setSelected([option]);
      onChange?.(option);
      setOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-4 py-2 bg-white border rounded-md shadow text-sm hover:bg-gray-50 flex items-center gap-2"
      >
        {label}
        <span className="text-gray-500">▾</span>
      </button>

      {open && (
        <div className="absolute mt-2 w-48 bg-white border rounded-md shadow-lg z-20 max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => toggleOption(option)}
              className={
                `px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 ${selected.includes(option)? "bg-gray-200 font-medium":""}`
              }
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
