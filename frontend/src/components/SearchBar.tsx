"use client";

import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (value: string) => void;
  delay?: number;
  initialValue?: string;
}

export default function SearchBar({
  onSearch,
  delay = 400,
  initialValue = "",
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (inputValue === "") {
      onSearch("");
    }
  }, [inputValue, onSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(inputValue);
    }, delay);

    return () => clearTimeout(handler);
  }, [inputValue]);

  return (
    <div className="flex items-center bg-gray-150 border border-gray-300 rounded-md px-3 py-1 w-80 gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.65 3.65a7.5 7.5 0 0012.9 12.9z"
        />
      </svg>
      <input
        type="text"
        placeholder="Name, Phone No."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="bg-transparent text-sm w-full focus:outline-none"
      />
    </div>
  );
}
