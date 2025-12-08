"use client";
import { BsLightningCharge } from "react-icons/bs";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { TbPlugConnected } from "react-icons/tb";
import { IoChevronDownOutline } from "react-icons/io5";

const menuSections = [
  {
    label: "Services",
    items: [
      { label: "Pre-active" },
      { label: "Active" },
      { label: "Blocked" },
      { label: "Closed" },
    ],
  },
  {
    label: "Invoices",
    items: [{ label: "Proforma Invoices" }, { label: "Final Invoices" }],
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full min-h-screen w-56 flex-col bg-[#f5f5f6] px-4 pt-3">
      <div className="mb-3 flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white text-sm font-semibold">
            V
          </div>
          <div className="flex flex-col text-[13px]">
            <span className="font-semibold">Vault</span>
            <span className="text-gray-500">Anurag Yadav</span>
          </div>
        </div>
        <IoChevronDownOutline className="text-gray-400" size={16} />
      </div>

      <nav className="flex-1 overflow-y-auto pb-3 text-[13px] text-gray-700">
        <button
          type="button"
          className="mb-1.5 flex w-full items-center gap-2.5 rounded-md px-1 py-1 text-left text-[12px] font-medium text-gray-800 hover:bg-gray-100"
        >
          <MdOutlineDashboard className="text-gray-500" size={16} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className="mb-1.5 flex w-full items-center gap-2.5 rounded-md px-1 py-1 text-left text-[12px] font-medium text-gray-800 hover:bg-gray-100"
        >
          <BsLightningCharge className="text-gray-500" size={16} />
          <span>Nexus</span>
        </button>

        <button
          type="button"
          className="mb-3 flex w-full items-center gap-2.5 rounded-md px-1 py-1 text-left text-[12px] font-medium text-gray-800 hover:bg-gray-100"
        >
          <TbPlugConnected className="text-gray-500" size={16} />
          <span>Intake</span>
        </button>

        {menuSections.map((section) => (
          <div key={section.label} className="mb-3.5">
            <div className="mb-1.5 flex items-center justify-between rounded-md bg-white px-3 py-1.5 text-[12px] font-medium text-gray-700 shadow-sm">
              <span>{section.label}</span>
              <IoChevronDownOutline className="text-gray-400" size={14} />
            </div>
            <div className="space-y-1 rounded-md bg-white px-3 py-1.5 text-[12px] text-gray-700 shadow-sm">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-left hover:bg-gray-50"
                >
                  {section.label === "Invoices" ? (
                    <HiOutlineDocumentText
                      className="text-gray-400"
                      size={15}
                    />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  )}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
