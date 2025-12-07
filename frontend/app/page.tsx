"use client";

import { useState } from "react";

import FilterDropdown from "@/components/FilterDropdown";
import SearchBar from "@/components/SearchBar";
import SortingDropdown from "@/components/SortingDropdown";
import TransactionTable from "@/components/TransactionTable";
import Pagination from "@/components/Pagination";

export default function Home() {
  const columns = [
    { key: "transactionId", label: "Transaction ID" },
    { key: "date", label: "Date" },
    { key: "customerId", label: "Customer ID" },
    { key: "customerName", label: "Customer Name" },
    { key: "phone", label: "Phone Number" },
    { key: "gender", label: "Gender" },
    { key: "age", label: "Age" },
    { key: "category", label: "Product Category" },
    { key: "quantity", label: "Quantity" },
    { key: "amount", label: "Total Amount" },
    { key: "region", label: "Customer Region" },
    { key: "productId", label: "Product ID" },
    { key: "employee", label: "Employee Name" },
  ];

  const mockData = [
    {
      transactionId: "1234567",
      date: "2023-09-26",
      customerId: "CUST12016",
      customerName: "Neha Yadav",
      phone: "+91 9123456789",
      gender: "Female",
      age: 25,
      category: "Clothing",
      quantity: 1,
      amount: "₹1,000",
      region: "South",
      productId: "PROD0001",
      employee: "Harsh Agrawal",
    },
  ];

  const [page, setPage] = useState(1);

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
          <div className="bg-white p-4 rounded-md shadow">
            <p className="text-gray-400 text-sm">Total units sold</p>
            <p className="text-2xl font-semibold">10</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <p className="text-gray-400 text-sm">Total Amount</p>
            <p className="text-2xl font-semibold">$89,000 (19 SRs)</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <p className="text-gray-400 text-sm">Total Discount</p>
            <p className="text-2xl font-semibold">$15,000 (45 SRs)</p>
          </div>
        </section>

        <TransactionTable columns={columns} data={mockData} />

        <Pagination
          currentPage={page}
          totalPages={6}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </main>
  );
}
