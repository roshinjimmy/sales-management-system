"use client";

import { useState, useEffect } from "react";

import FilterDropdown from "@/components/FilterDropdown";
import SearchBar from "@/components/SearchBar";
import SortingDropdown from "@/components/SortingDropdown";
import TransactionTable from "@/components/TransactionTable";
import Pagination from "@/components/Pagination";
import SummaryCard from "@/components/SummaryCard";

export default function Home() {
  const columns = [
    { key: "transactionId", label: "Transaction ID" },
    { key: "date", label: "Date" },
    { key: "customerId", label: "Customer ID" },
    { key: "customerName", label: "Customer Name" },
    { key: "phone", label: "Phone Number" },
    { key: "gender", label: "Gender" },
    { key: "age", label: "Age", align: "right" },
    { key: "category", label: "Product Category" },
    { key: "quantity", label: "Quantity", align: "right" },
    { key: "amount", label: "Total Amount", align: "right" },
    { key: "region", label: "Customer Region" },
    { key: "productId", label: "Product ID" },
    { key: "employee", label: "Employee Name" },
  ] as const;

  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const fetchTransactions = async (pageNum = 1) => {
    try {
      const API = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(
        `${API}/api/transactions?page=${pageNum}&limit=20`
      );
      const json = await res.json();

      setTransactions(json.data || []);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  return (
    <main className="min-h-screen w-full bg-gray-100 text-black p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <section className="w-full flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <FilterDropdown
              label="Customer Region"
              options={["North", "South", "East", "West"]}
              multi={true}
            />
            <FilterDropdown
              label="Gender"
              options={["Male", "Female", "Other"]}
              multi={false}
            />
            <FilterDropdown
              label="Age Range"
              options={["18-25", "26-35", "36-45", "46-60", "60+"]}
              multi={false}
            />
            <FilterDropdown
              label="Product Category"
              options={["Electronics", "Clothing", "Groceries", "Accessories"]}
              multi={true}
            />
            <FilterDropdown
              label="Tags"
              options={["New", "Sale", "Popular", "Limited"]}
              multi={true}
            />
            <FilterDropdown
              label="Payment Method"
              options={["Cash", "Credit Card", "UPI", "Net Banking"]}
              multi={true}
            />
            <FilterDropdown
              label="Date"
              options={["Today", "Last 7 Days", "Last 30 Days", "This Year"]}
              multi={false}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <SearchBar onSearch={(value) => console.log("Searching:", value)} />

            <SortingDropdown
              options={[
                { label: "Customer Name (A–Z)", value: "name_asc" },
                { label: "Date (Newest)", value: "date_desc" },
                { label: "Quantity", value: "qty" },
              ]}
              onChange={(value) => console.log("Sort:", value)}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard title="Total units sold" value="10" />
          <SummaryCard
            title="Total Amount"
            value="₹89,000"
            subtext="(19 SRs)"
          />
          <SummaryCard
            title="Total Discount"
            value="₹15,000"
            subtext="(45 SRs)"
          />
        </section>

        <TransactionTable columns={columns} data={transactions} />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </main>
  );
}
