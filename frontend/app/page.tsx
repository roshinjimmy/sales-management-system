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

  const [filters, setFilters] = useState({
    region: [],
    gender: [],
    ageRange: "",
    category: [],
    tags: [],
    payment: [],
    date: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const fetchTransactions = async (page = 1) => {
    try {
      const API = process.env.NEXT_PUBLIC_API_URL;

      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", "20");

      if (filters.region.length)
        params.append("region", filters.region.join(","));

      if (filters.gender.length)
        params.append("gender", filters.gender.join(","));

      if (filters.category.length)
        params.append("category", filters.category.join(","));

      if (filters.payment.length)
        params.append("payment", filters.payment.join(","));

      if (filters.tags.length) params.append("tags", filters.tags.join(","));

      if (filters.ageRange) params.append("ageRange", filters.ageRange);

      if (filters.date) params.append("date", filters.date);

      const res = await fetch(`${API}/api/transactions?${params.toString()}`);

      const json = await res.json();
      setTransactions(Array.isArray(json.data) ? json.data : []);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    setPage(1);
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page, filters]);

  return (
    <main className="min-h-screen w-full bg-gray-100 text-black p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <section className="w-full flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <FilterDropdown
              label="Customer Region"
              options={["North", "South", "East", "West"]}
              multi={true}
              onChange={(values) => updateFilter("region", values)}
            />
            <FilterDropdown
              label="Gender"
              options={["Male", "Female", "Other"]}
              multi={false}
              onChange={(value) => updateFilter("gender", value ? [value] : [])}
            />
            <FilterDropdown
              label="Age Range"
              options={["18-25", "26-35", "36-45", "46-60", "60+"]}
              multi={false}
              onChange={(value) => updateFilter("ageRange", value)}
            />
            <FilterDropdown
              label="Product Category"
              options={["Electronics", "Clothing", "Groceries", "Accessories"]}
              multi={true}
              onChange={(values) => updateFilter("category", values)}
            />
            <FilterDropdown
              label="Tags"
              options={["New", "Sale", "Popular", "Limited"]}
              multi={true}
              onChange={(values) => updateFilter("tags", values)}
            />
            <FilterDropdown
              label="Payment Method"
              options={["Cash", "Credit Card", "UPI", "Net Banking"]}
              multi={true}
              onChange={(values) => updateFilter("payment", values)}
            />
            <FilterDropdown
              label="Date"
              options={["Today", "Last 7 Days", "Last 30 Days", "This Year"]}
              multi={false}
              onChange={(value) => updateFilter("date", value)}
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
