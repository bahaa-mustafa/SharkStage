"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import DeleteAlert from "@/app/components/DeleteAlert";
import { Eye, Search, MessageSquare, Sparkles, Trash2, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function UserCommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await api.get("/blog/user/comments");
      setComments(res.data.userComments || []);
    } catch (err) {
      console.error("Error fetching user comments:", err);
      setError(true);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    setDeleteLoading(true);
    try {
      await api.post(`/blog/comment/delete/${commentId}`);
      toast.success("Comment deleted successfully");
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = searchQuery
    ? comments.filter((comment) =>
        comment.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : comments;

  return (
    <div className="p-4 sm:p-6 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-background-dark dark:via-background-dark dark:to-background-dark">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3a5a92] via-[#6fa8dc] to-[#8b5cf6] p-6 sm:p-8 mb-8 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <MessageSquare className="text-yellow-300" size={40} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-yellow-300" size={24} />
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  My Comments
                </h1>
              </div>
              <p className="text-white/90 text-lg">
                Manage and view all your blog comments
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        {comments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-background/10 backdrop-blur-lg border-2 border-gray-200 dark:border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3a5a92] dark:focus:ring-primary-dark focus:border-transparent transition-all shadow-lg dark:text-background dark:placeholder-background/30"
              />
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/80 dark:bg-background/10 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-none p-6 animate-shimmer border border-white/20 dark:border-0">
                <div className="h-6 bg-gray-200 dark:bg-background/20 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-background/20 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/30 rounded-2xl p-8 text-center shadow-xl">
            <p className="text-red-600 dark:text-red-400 font-semibold text-lg mb-4">
              Failed to load comments
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchComments}
              className="px-6 py-3 bg-red-600 dark:bg-red-700 text-white rounded-xl hover:bg-red-700 dark:hover:bg-red-800 transition-all shadow-lg font-semibold"
            >
              Retry
            </motion.button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && comments.length === 0 && (
          <div className="bg-white/80 dark:bg-background/10 backdrop-blur-lg border border-gray-200 dark:border-0 rounded-2xl p-12 text-center shadow-xl">
            <MessageSquare className="mx-auto text-gray-400 dark:text-paragraph mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-800 dark:text-background mb-2">No comments yet</h3>
            <p className="text-gray-600 dark:text-paragraph">
              Start engaging with blog posts by leaving comments
            </p>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && filtered.length === 0 && comments.length > 0 && (
          <div className="bg-white/80 dark:bg-background/10 backdrop-blur-lg border border-gray-200 dark:border-0 rounded-2xl p-8 text-center shadow-xl">
            <Search className="mx-auto text-gray-400 dark:text-paragraph mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800 dark:text-background mb-2">No comments found</h3>
            <p className="text-gray-600 dark:text-paragraph">
              Try adjusting your search query
            </p>
          </div>
        )}

        {/* Comments List */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((comment, index) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/80 dark:bg-background/10 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-none border border-white/20 dark:border-0 p-6 hover:shadow-2xl transition-all"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-paragraph mb-3">
                    <Calendar size={14} />
                    <span>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-800 dark:text-background font-medium line-clamp-4 mb-4">
                    {comment.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-background/30">
                  <Link
                    href={`/blog/${comment.post}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3a5a92] to-[#6fa8dc] dark:to-heading text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
                  >
                    <Eye size={16} />
                    View Post
                  </Link>
                  <DeleteAlert
                    handleDelete={() => handleDeleteComment(comment._id)}
                    deleteLoading={deleteLoading}
                    title="Delete this comment?"
                    className="p-2.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
