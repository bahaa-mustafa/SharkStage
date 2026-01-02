"use client";
import { useState, useEffect } from "react";
import { Search, Trash2, Edit, RefreshCw, MessageSquare } from "lucide-react";
import { getAllFAQs } from "@/lib/api/admin.api";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminFAQsTable() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await getAllFAQs({
        page,
        limit: 20,
        search: searchQuery,
        category: categoryFilter || undefined,
        sortBy: "newest",
      });

      if (response.success) {
        setFaqs(response.data.faqs);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [page, searchQuery, categoryFilter]);

  const handleDelete = async (faqId) => {
    if (!confirm("Are you sure you want to delete this FAQ? This action cannot be undone.")) return;
    try {
      await api.delete(`/faq/delete/${faqId}`);
      toast.success("FAQ deleted successfully");
      fetchFAQs();
    } catch (error) {
      toast.error("Failed to delete FAQ");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#0f3460]/30">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">FAQs Management</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a]/50 border border-[#0f3460]/30 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 bg-[#0f172a]/50 border border-[#0f3460]/30 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="features">Features</option>
            <option value="projects">Projects</option>
            <option value="categories">Categories</option>
            <option value="account">Account</option>
            <option value="security">Security</option>
            <option value="usage">Usage</option>
          </select>
          <button
            onClick={fetchFAQs}
            className="px-4 py-2.5 bg-gradient-to-r from-[#0f3460] to-[#16213e] text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 border border-[#0f3460]/50"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f3460] mx-auto"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#0f3460]/30">
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Question</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Answer</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Usage</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq) => (
                  <motion.tr
                    key={faq._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-[#0f3460]/20 hover:bg-[#0f172a]/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0f3460] to-[#16213e] flex items-center justify-center border border-[#0f3460]/30">
                          <MessageSquare className="text-gray-400" size={18} />
                        </div>
                        <div>
                          <p className="text-gray-200 font-semibold line-clamp-2">{faq.question}</p>
                          {faq.questionAr && (
                            <p className="text-gray-400 text-xs line-clamp-1">{faq.questionAr}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-300 text-sm line-clamp-2">{faq.answer}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-lg text-xs font-bold border border-purple-600/30 capitalize">
                        {faq.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-bold border border-blue-600/30">
                        {faq.usageCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toast.info("Edit functionality coming soon")}
                          className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all border border-blue-600/30"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(faq._id)}
                          className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all border border-red-600/30"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-gray-400 text-sm">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} FAQs
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-[#0f172a]/50 border border-[#0f3460]/30 rounded-lg text-gray-300 hover:bg-[#0f3460]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 bg-[#0f172a]/50 border border-[#0f3460]/30 rounded-lg text-gray-300 hover:bg-[#0f3460]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

