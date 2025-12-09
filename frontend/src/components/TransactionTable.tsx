"use client";

interface Column {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
}

interface TransactionTableProps {
  columns: readonly Column[];
  data: any[];
}

export default function TransactionTable({
  columns,
  data,
}: TransactionTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-gray-200 bg-white">
      <table className="w-full min-w-[1500px] text-left text-sm">
        <thead className="sticky top-0 z-10 bg-gray-50">
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-3 py-2 text-xs font-medium tracking-wide text-gray-600 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-4 text-center text-sm text-gray-500"
              >
                No Records Found
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 bg-white text-[13px] text-gray-800 hover:bg-gray-50"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-3 py-2 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                    title={row[col.key]}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
