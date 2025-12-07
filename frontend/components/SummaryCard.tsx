"use client";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtext?: string;
}

export default function SummaryCard({
  title,
  value,
  subtext,
}: SummaryCardProps) {
  return (
    <div className="bg-white p-4 rounded-md shadow flex flex-col gap-1">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
      {subtext && <p className="text-gray-500 text-xs">{subtext}</p>}
    </div>
  );
}
