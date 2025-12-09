"use client";

import { useState, useEffect } from "react";

import FilterDropdown from "@/src/components/FilterDropdown";
import SearchBar from "@/src/components/SearchBar";
import SortingDropdown from "@/src/components/SortingDropdown";
import TransactionTable from "@/src/components/TransactionTable";
import Pagination from "@/src/components/Pagination";
import SummaryCard from "@/src/components/SummaryCard";
import Loader from "@/src/components/Loader";
import Sidebar from "@/src/components/Sidebar";

type FilterState = {
  region: string[];
  gender: string[];
  ageRange: string;
  category: string[];
  tags: string[];
  payment: string[];
  date: string;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

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

  const [filters, setFilters] = useState<FilterState>({
    region: [],
    gender: [],
    ageRange: "",
    category: [],
    tags: [],
    payment: [],
    date: "",
    search: "",
    sortBy: "",
    sortOrder: "asc",
  });

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [stats, setStats] = useState({
    total_units: 0,
    total_amount: 0,
    total_discount: 0,
  });

  const handleSort = (field: string) => {
    if (!field) {
      updateFilter("sortBy", "");
      updateFilter("sortOrder", "asc");
      return;
    }

    const newOrder: "asc" | "desc" =
      filters.sortBy === field && filters.sortOrder === "asc" ? "desc" : "asc";
    updateFilter("sortBy", field);
    updateFilter("sortOrder", newOrder);
  };

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
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

      if (filters.search) params.append("search", filters.search);
      if (filters.sortBy) {
        params.append("sortBy", filters.sortBy);
        params.append("sortOrder", filters.sortOrder);
      }

      const res = await fetch(`${API}/api/transactions?${params.toString()}`);

      const json = await res.json();
      setTransactions(Array.isArray(json.data) ? json.data : []);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const API = process.env.NEXT_PUBLIC_API_URL;
      const params = new URLSearchParams();

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
      if (filters.search) params.append("search", filters.search);

      const res = await fetch(
        `${API}/api/transactions/stats?${params.toString()}`
      );
      const json = await res.json();

      setStats({
        total_units: Number(json.total_units || 0),
        total_amount: Number(json.total_amount || 0),
        total_discount: Number(json.total_discount || 0),
      });
    } catch (err) {
      console.error("Stats Fetch Error:", err);
    }
  };

  const updateFilter = (
    key: keyof FilterState,
    value: FilterState[keyof FilterState]
  ) => {
    if (JSON.stringify(filters[key]) === JSON.stringify(value)) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    setPage(1);
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page, filters]);

  useEffect(() => {
    fetchStats();
  }, [filters]);

  return (
    <main className="min-h-screen w-full bg-white text-black">
      <div className="flex h-screen w-full gap-0">
        <Sidebar />
        <div className="flex-1 px-5 py-2 flex flex-col gap-6 overflow-hidden">
          <header className="mb-0 flex items-center justify-between gap-4 pr-2">
            <h1 className="text-l font-semibold text-gray-800">
              Sales Management System
            </h1>
            <div className="w-full max-w-md flex justify-end">
              <SearchBar
                onSearch={(value) => {
                  updateFilter("search", value);
                }}
              />
            </div>
          </header>

          <section className="w-full flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
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
                  onChange={(value) =>
                    updateFilter("gender", value ? [value as string] : [])
                  }
                />
                <FilterDropdown
                  label="Age Range"
                  options={["18-25", "26-35", "36-45", "46-60", "60+"]}
                  multi={false}
                  onChange={(value) => updateFilter("ageRange", value)}
                />
                <FilterDropdown
                  label="Product Category"
                  options={[
                    "Electronics",
                    "Clothing",
                    "Groceries",
                    "Accessories",
                  ]}
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
                  options={[
                    "Today",
                    "Last 7 Days",
                    "Last 30 Days",
                    "This Year",
                  ]}
                  multi={false}
                  onChange={(value) => updateFilter("date", value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <SortingDropdown
                  options={[
                    { label: "Customer Name", value: "customer_name" },
                    { label: "Date", value: "date" },
                    { label: "Quantity", value: "quantity" },
                    { label: "None", value: "" },
                  ]}
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                  onChange={handleSort}
                />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-fit">
            <SummaryCard
              title="Total Units Sold"
              value={stats.total_units.toLocaleString()}
            />
            <SummaryCard
              title="Total Amount"
              value={`₹${stats.total_amount.toLocaleString()}`}
            />
            <SummaryCard
              title="Total Discount"
              value={`₹${stats.total_discount.toLocaleString()}`}
            />
          </section>

          {loading ? (
            <Loader />
          ) : (
            <TransactionTable columns={columns} data={transactions} />
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </main>
  );
}
