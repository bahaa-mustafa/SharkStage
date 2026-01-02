"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import { categories } from "@/data/categories";
import { useState } from "react";

export default function InvestorFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const statuses = [
    { value: "all", label: "All Projects" },
    { value: "owned", label: "Fully Owned" },
    { value: "invested", label: "Invested" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "roi-high", label: "ROI: High to Low" },
    { value: "funding-high", label: "Funding Goal: High to Low" },
    { value: "most-funded", label: "Most Funded" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
      {/* Search and Sort Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search Bar */}
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects by name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="md:w-64">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Filters Button (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Filters Section */}
      <div
        className={`${
          showFilters ? "block" : "hidden"
        } md:block transition-all duration-300`}
      >
        <div className="pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            {/* <div>
              <label className="block text-sm font-semibold text-heading mb-3">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onCategoryChange("all")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === "all"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-paragraph hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onCategoryChange(cat.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                      selectedCategory === cat.id
                        ? `${cat.bg} text-white`
                        : "bg-gray-100 text-paragraph hover:bg-gray-200"
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.title}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-heading mb-3">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => onStatusChange(status.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === status.value
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-paragraph hover:bg-gray-200"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
