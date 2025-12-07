"use client";

interface Column {
  key: string;
  label: string;
}

interface TransactionTableProps {
  columns: Column[];
  data: any[];
}

export default function TransactionTable({
  columns,
  data,
}: TransactionTableProps) {
  return (
    <div className="bg-white rounded-md shadow p-4 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="py-2 px-2 font-medium text-gray-700 whitespace-nowrap"
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
              <tr key={idx} className="border-b hover:bg-gray-50 transition">
                {columns.map((col) => (
                  <td key={col.key} className="py-2 px-2 whitespace-nowrap">
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
