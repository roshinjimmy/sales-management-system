"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>({
    region: searchParams.get("region")?.split(",").filter(Boolean) || [],
    gender: searchParams.get("gender")?.split(",").filter(Boolean) || [],
    ageRange: searchParams.get("ageRange") || "",
    category: searchParams.get("category")?.split(",").filter(Boolean) || [],
    tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
    payment: searchParams.get("payment")?.split(",").filter(Boolean) || [],
    date: searchParams.get("date") || "",
    search: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || "",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
  });

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));

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

  const updateURL = (newFilters: FilterState, newPage: number) => {
    const params = new URLSearchParams();

    if (newPage > 1) params.set("page", String(newPage));
    if (newFilters.region.length)
      params.set("region", newFilters.region.join(","));
    if (newFilters.gender.length)
      params.set("gender", newFilters.gender.join(","));
    if (newFilters.ageRange) params.set("ageRange", newFilters.ageRange);
    if (newFilters.category.length)
      params.set("category", newFilters.category.join(","));
    if (newFilters.tags.length) params.set("tags", newFilters.tags.join(","));
    if (newFilters.payment.length)
      params.set("payment", newFilters.payment.join(","));
    if (newFilters.date) params.set("date", newFilters.date);
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.sortBy) params.set("sortBy", newFilters.sortBy);
    if (newFilters.sortBy && newFilters.sortOrder)
      params.set("sortOrder", newFilters.sortOrder);

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/", { scroll: false });
  };

  const updateFilter = (
    key: keyof FilterState,
    value: FilterState[keyof FilterState]
  ) => {
    if (JSON.stringify(filters[key]) === JSON.stringify(value)) {
      return;
    }

    const newFilters = {
      ...filters,
      [key]: value,
    };

    setFilters(newFilters);
    setPage(1);
    updateURL(newFilters, 1);
  };

  const resetFilters = () => {
    const newFilters = {
      region: [],
      gender: [],
      ageRange: "",
      category: [],
      tags: [],
      payment: [],
      date: "",
      search: "",
      sortBy: "",
      sortOrder: "asc" as "asc" | "desc",
    };
    setFilters(newFilters);
    setPage(1);
    updateURL(newFilters, 1);
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page, filters]);

  useEffect(() => {
    fetchStats();
  }, [filters]);

  // Update URL when page changes
  useEffect(() => {
    updateURL(filters, page);
  }, [page]);

  return (
    <main className="min-h-screen w-full bg-white text-black">
      <div className="flex h-screen w-full gap-0">
        <Sidebar />
        <div className="flex-1 px-5 py-2 flex flex-col gap-3 overflow-hidden">
          <header className="mb-0 flex items-center justify-between gap-4 pr-2">
            <h1 className="text-l font-semibold text-gray-800">
              Sales Management System
            </h1>
            <div className="w-full max-w-md flex justify-end">
              <SearchBar
                initialValue={filters.search}
                onSearch={(value) => {
                  updateFilter("search", value);
                }}
              />
            </div>
          </header>

          <section className="w-full flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={resetFilters}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Reset all filters"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                  </svg>
                </button>
                <FilterDropdown
                  label="Customer Region"
                  options={["North", "South", "East", "West"]}
                  multi={true}
                  value={filters.region}
                  onChange={(values) => updateFilter("region", values)}
                />
                <FilterDropdown
                  label="Gender"
                  options={["Male", "Female", "Other"]}
                  multi={false}
                  value={filters.gender[0] || ""}
                  onChange={(value) =>
                    updateFilter("gender", value ? [value as string] : [])
                  }
                />
                <FilterDropdown
                  label="Age Range"
                  options={["18-25", "26-35", "36-45", "46-60", "60+"]}
                  multi={false}
                  value={filters.ageRange}
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
                  value={filters.category}
                  onChange={(values) => updateFilter("category", values)}
                />
                <FilterDropdown
                  label="Tags"
                  options={["New", "Sale", "Popular", "Limited"]}
                  multi={true}
                  value={filters.tags}
                  onChange={(values) => updateFilter("tags", values)}
                />
                <FilterDropdown
                  label="Payment Method"
                  options={["Cash", "Credit Card", "UPI", "Net Banking"]}
                  multi={true}
                  value={filters.payment}
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
                  value={filters.date}
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

          <div className="flex-1 flex flex-col overflow-hidden">
            {loading ? (
              <Loader />
            ) : (
              <TransactionTable columns={columns} data={transactions} />
            )}
          </div>

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

export default function Home() {
  return (
    <Suspense fallback={<Loader />}>
      <HomeContent />
    </Suspense>
  );
}
