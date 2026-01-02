"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import { categories } from "@/data/categories";
import { useState } from "react";
export const PROJECT_CATEGORIES = [
  { title: "Technology", bg: "bg-purple-500" },
  { title: "E-Commerce", bg: "bg-indigo-500" },
  { title: "Food", bg: "bg-red-700" },
  { title: "Health", bg: "bg-green-700" },
  { title: "Education", bg: "bg-amber-700" },
  { title: "Real Estate", bg: "bg-blue-500" },
  { title: "Industrial", bg: "bg-orange-500" },
  { title: "Other", bg: "bg-neutral-700" },
];
export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  roiRange,
  onRoiChange,
  sortBy,
  onSortChange,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const statuses = [
    { value: "all", label: "All Projects" },
    { value: "active", label: "Active" },
    { value: "funded", label: "Funded" },
    { value: "closed", label: "Closed" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "roi-high", label: "ROI: High to Low" },
    { value: "networth-high", label: "Networth: High to Low" },
    { value: "most-funded", label: "Most Funded" },
  ];

  return (
    <div className="bg-white dark:bg-background/10 rounded-xl shadow-sm p-6 mb-8 border border-gray-100 dark:border-0">
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
            className="dark:placeholder:text-background w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="md:w-64">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 bg-white dark:bg-gray-300 text-paragraph dark:text-background-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent "
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
            <div>
              <label className="block text-sm font-semibold text-heading dark:text-background mb-3">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onCategoryChange("all")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === "all"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-300 text-paragraph dark:text-background-dark hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {PROJECT_CATEGORIES.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => onCategoryChange(cat.title)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                      selectedCategory === cat.title
                        ? `${cat.bg} text-white`
                        : "bg-gray-100 dark:bg-gray-300 text-paragraph dark:text-background-dark hover:bg-gray-200"
                    }`}
                  >
                    {/* <cat.icon className="w-4 h-4" /> */}
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-heading dark:text-background mb-3">
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
                        : "bg-gray-100 dark:bg-gray-300 text-paragraph dark:text-background-dark hover:bg-gray-200"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ROI Range Filter */}
            <div>
              <label className="block text-sm font-semibold text-heading dark:text-background mb-3">
                Minimum ROI: {roiRange}%
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={roiRange}
                onChange={(e) => onRoiChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-paragraph mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
