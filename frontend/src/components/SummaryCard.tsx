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
    <div className="flex w-full max-w-xs flex-col gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5">
      <div className="flex items-center gap-1 text-[12px] font-medium text-gray-500">
        {title}
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-500">
          i
        </span>
      </div>

      <p className="text-sm font-semibold text-gray-900">{value}</p>

      {subtext && (
        <p className="text-gray-500 text-[11px] font-medium">{subtext}</p>
      )}
    </div>
  );
}
