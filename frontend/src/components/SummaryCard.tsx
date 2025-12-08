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
    <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex flex-col gap-1.5 w-full">
      <div className="flex items-center gap-1 text-gray-500 text-xs font-medium">
        {title}
        <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px] rounded-full bg-gray-100 text-gray-500">
          i
        </span>
      </div>

      <p className="text-xl font-semibold text-gray-900">{value}</p>

      {subtext && (
        <p className="text-gray-500 text-[11px] font-medium">{subtext}</p>
      )}
    </div>
  );
}
