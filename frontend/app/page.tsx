"use client";

import FilterDropdown from "@/components/FilterDropdown";
import SearchBar from "@/components/SearchBar";

export default function Home() {
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

            <select className="px-4 py-2 rounded-md border shadow bg-white text-sm">
              <option>Sort by: Customer Name (A–Z)</option>
              <option>Sort by: Date (Newest)</option>
              <option>Sort by: Quantity</option>
            </select>
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

        <section className="bg-white rounded-md shadow p-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Transaction ID</th>
                <th className="py-2">Date</th>
                <th className="py-2">Customer ID</th>
                <th className="py-2">Customer name</th>
                <th className="py-2">Phone Number</th>
                <th className="py-2">Gender</th>
                <th className="py-2">Age</th>
                <th className="py-2">Product Category</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Total Amount</th>
                <th className="py-2">Customer Region</th>
                <th className="py-2">Product ID</th>
                <th className="py-2">Employee name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">1234567</td>
                <td className="py-2">2023-09-26</td>
                <td className="py-2">CUST12016</td>
                <td className="py-2">Neha Yadav</td>
                <td className="py-2">+91 9123456789</td>
                <td className="py-2">Female</td>
                <td className="py-2">25</td>
                <td className="py-2">Clothing</td>
                <td className="py-2">01</td>
                <td className="py-2">₹1,000</td>
                <td className="py-2">South</td>
                <td className="py-2">PROD0001</td>
                <td className="py-2">Harsh Agrawal</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="flex justify-center items-center mt-4 gap-2">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              className={`px-3 py-1 rounded-md ${
                num === 1 ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {num}
            </button>
          ))}
        </section>
      </div>
    </main>
  );
}
