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
    <div className="bg-white rounded-md shadow overflow-x-auto w-full">
      <table className="min-w-[1500px] w-full text-left text-sm">
        <thead className="sticky top-0 bg-gray-50 z-10">
          <tr className="border-b bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="py-3 px-3 font-medium text-gray-700 whitespace-nowrap"
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
                className="py-4 text-center text-gray-500"
              >
                No Records Found
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b hover:bg-gray-100 transition ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-2 px-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] ${
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
