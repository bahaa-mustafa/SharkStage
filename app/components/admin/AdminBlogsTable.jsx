"use client";
import { useState, useEffect } from "react";
import { Search, Trash2, Eye, RefreshCw, FileText } from "lucide-react";
import { getAllBlogs } from "@/lib/api/admin.api";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminBlogsTable() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getAllBlogs({
        page,
        limit: 20,
        search: searchQuery,
        sortBy: "newest",
      });

      if (response.success) {
        setPosts(response.data.posts);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, searchQuery]);

  const handleDelete = async (postId) => {
    if (
      !confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone."
      )
    )
      return;
    try {
      await api.post(`/blog/post/delete/${postId}`);
      toast.success("Blog post deleted successfully");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete blog post");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#0f3460]/30">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">
          Blogs Management
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a]/50 border border-[#0f3460]/30 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchBlogs}
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
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">
                    Comments
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <motion.tr
                    key={post._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-[#0f3460]/20 hover:bg-[#0f172a]/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0f3460] to-[#16213e] flex items-center justify-center border border-[#0f3460]/30">
                          <FileText className="text-gray-400" size={18} />
                        </div>
                        <div>
                          <p className="text-gray-200 font-semibold line-clamp-1">
                            {post.title}
                          </p>
                          <p className="text-gray-400 text-xs line-clamp-1">
                            {post.content?.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {post.author ? (
                        <div className="flex items-center gap-2">
                          {post.author.profilePicUrl ? (
                            <img
                              src={post.author.profilePicUrl}
                              alt={post.author.firstName}
                              className="w-8 h-8 rounded-full border border-[#0f3460]/30"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0f3460] to-[#16213e] flex items-center justify-center border border-[#0f3460]/30">
                              <span className="text-gray-300 text-xs font-bold">
                                {post.author.firstName?.[0]}
                                {post.author.lastName?.[0]}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-200 text-sm font-medium">
                              {post.author.firstName} {post.author.lastName}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {post.author.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-bold border border-blue-600/30">
                        {post.commentsCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-300 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/blog/${post._id}`}
                          className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all border border-blue-600/30"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
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
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} posts
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-[#0f172a]/50 border border-[#0f3460]/30 rounded-lg text-gray-300 hover:bg-[#0f3460]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.pages, p + 1))
                  }
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
