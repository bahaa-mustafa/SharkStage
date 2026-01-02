"use client";
import { useState, useEffect } from "react";
import { Search, Trash2, Eye, RefreshCw, FolderKanban } from "lucide-react";
import { getAllProjects, deleteProject } from "@/lib/api/admin.api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminProjectsTable() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getAllProjects({
        page,
        limit: 20,
        search: searchQuery,
        status: statusFilter || undefined,
        sortBy: "newest",
      });

      if (response.success) {
        setProjects(response.data.projects);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, searchQuery, statusFilter]);

  const handleDelete = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#0f3460]/30">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">Projects Management</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a]/50 border border-[#0f3460]/30 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 bg-[#0f172a]/50 border border-[#0f3460]/30 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
          <button
            onClick={fetchProjects}
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
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Owner</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Funding</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Progress</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <motion.tr
                    key={project._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-[#0f3460]/20 hover:bg-[#0f172a]/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-12 h-12 rounded-lg object-cover border border-[#0f3460]/30"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0f3460] to-[#16213e] flex items-center justify-center border border-[#0f3460]/30">
                            <FolderKanban className="text-gray-400" size={20} />
                          </div>
                        )}
                        <div>
                          <p className="text-gray-200 font-semibold">{project.title}</p>
                          <p className="text-gray-400 text-xs">
                            {project.category?.en || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {project.owner ? (
                        <div>
                          <p className="text-gray-200 font-medium">{project.owner.firstName} {project.owner.lastName}</p>
                          <p className="text-gray-400 text-xs">{project.owner.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-200 font-semibold">${project.totalPrice.toLocaleString()}</p>
                      <p className="text-gray-400 text-xs">
                        ${((project.totalPrice * project.progress) / 100).toLocaleString()} received
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-24 bg-[#0f172a]/50 rounded-full h-2 border border-[#0f3460]/30">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#0f3460] to-[#3a5a92]"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <p className="text-gray-400 text-xs mt-1">{project.progress}%</p>
                    </td>
                    <td className="px-4 py-4">
                      {project.status === "active" ? (
                        <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-lg text-sm font-bold border border-green-600/30">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-600/20 text-gray-400 rounded-lg text-sm font-bold border border-gray-600/30">
                          Closed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/projects/${project._id}`}
                          className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all border border-blue-600/30"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(project._id)}
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
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} projects
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

