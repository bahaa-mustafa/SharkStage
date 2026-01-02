"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Eye,
  FileDown,
  Trash,
  Pen,
  FolderKanban,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import InvestorFilter from "./InvestorFilter";
import { useDispatch, useSelector } from "react-redux";
import OwnerFilter from "./OwnerFilter";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { getProjects } from "@/lib/features/projects/projectsThunks";
import { motion } from "framer-motion";
const lang = "en";

// Enhanced progress color function
const progressColor = (p) => {
  if (p == 100) return "bg-gradient-to-r from-green-500 to-green-600";
  if (p > 70) return "bg-gradient-to-r from-green-400 to-green-500";
  if (p > 50) return "bg-gradient-to-r from-yellow-400 to-yellow-500";
  return "bg-gradient-to-r from-red-400 to-red-500";
};

export default function ProjectsPage() {
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleFilterChange = (callback) => {
    callback();
  };

  const fetchUserProjects = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/projects/user/${currentUser._id}`);
      setUserProjects(res.data.userProjects || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects");
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProjects();
  }, [currentUser]);

  const handleDelete = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }
    try {
      await api.delete(`/projects/delete/${projectId}`);
      toast.success("Project deleted successfully");
      fetchUserProjects();
      dispatch(getProjects());
    } catch (err) {
      console.error("Failed to delete:", err);
      toast.error("Failed to delete project");
    }
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...userProjects];

    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const project =
          currentUser?.accountType === "investor" ? item.project : item;
        return project.title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    if (currentUser?.accountType === "investor") {
      if (selectedStatus === "owned") {
        filtered = filtered.filter((item) => item.percentage === 100);
      } else if (selectedStatus === "invested") {
        filtered = filtered.filter((item) => item.percentage < 100);
      }
    } else if (currentUser?.accountType === "owner") {
      if (selectedStatus === "sale") {
        filtered = filtered.filter((item) => item.progress === 0);
      } else if (selectedStatus === "invested") {
        filtered = filtered.filter(
          (item) => item.progress < 100 && item.progress > 0
        );
      } else if (selectedStatus === "sold") {
        filtered = filtered.filter((item) => item.progress === 100);
      } else if (selectedStatus === "unlisted") {
        filtered = filtered.filter((item) => item.status == "closed");
      }
    }

    filtered.sort((a, b) => {
      const projectA = currentUser?.accountType === "investor" ? a.project : a;
      const projectB = currentUser?.accountType === "investor" ? b.project : b;

      switch (sortBy) {
        case "newest":
          return new Date(projectB.createdAt) - new Date(projectA.createdAt);
        case "funding-high":
          return projectB.fundingGoal - projectA.fundingGoal;
        case "most-funded":
          return projectB.currentFunding - projectA.currentFunding;
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    userProjects,
    searchQuery,
    selectedCategory,
    selectedStatus,
    sortBy,
    currentUser,
  ]);

  const exportCSV = () => {
    const csv = [
      [
        "Title",
        "Category",
        currentUser?.accountType === "investor" ? "Percentage" : "Progress",
        "Created At",
      ].join(","),
      ...userProjects.map((p) => {
        const project = currentUser?.accountType === "investor" ? p.project : p;
        const progress =
          currentUser?.accountType === "investor"
            ? p.percentage
            : project.progress;
        return [
          project?.title || "N/A",
          project?.category?.[lang] || "N/A",
          `${progress}%`,
          project?.createdAt
            ? new Date(project.createdAt).toISOString().split("T")[0]
            : "N/A",
        ].join(",");
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download =
      currentUser?.accountType === "investor"
        ? "my_investments.csv"
        : "my_projects.csv";
    link.click();
  };

  return (
    <div className="p-4 sm:p-6 min-h-[calc(100vh-4rem)] bg-gradient-to-br">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3a5a92] to-secondary dark:to-heading p-6 sm:p-8 mb-8 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <FolderKanban className="text-yellow-300" size={32} />
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  {currentUser?.accountType === "investor"
                    ? "My Investments"
                    : "My Projects"}
                </h1>
              </div>
              <p className="text-white/90 text-lg">
                {currentUser?.accountType === "investor"
                  ? "Manage and track your investment portfolio"
                  : "Create and manage your projects"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {currentUser?.accountType == "owner" && (
                <Link
                  href="/account/projects/add"
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Plus size={20} />
                  New Project
                </Link>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportCSV}
                className="px-6 py-3 bg-white text-[#3a5a92] rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FileDown size={20} />
                Export CSV
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        {currentUser?.accountType == "investor" ? (
          <InvestorFilter
            searchQuery={searchQuery}
            onSearchChange={(value) =>
              handleFilterChange(() => setSearchQuery(value))
            }
            selectedCategory={selectedCategory}
            onCategoryChange={(value) =>
              handleFilterChange(() => setSelectedCategory(value))
            }
            selectedStatus={selectedStatus}
            onStatusChange={(value) =>
              handleFilterChange(() => setSelectedStatus(value))
            }
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        ) : (
          <OwnerFilter
            searchQuery={searchQuery}
            onSearchChange={(value) =>
              handleFilterChange(() => setSearchQuery(value))
            }
            selectedCategory={selectedCategory}
            onCategoryChange={(value) =>
              handleFilterChange(() => setSelectedCategory(value))
            }
            selectedStatus={selectedStatus}
            onStatusChange={(value) =>
              handleFilterChange(() => setSelectedStatus(value))
            }
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 animate-shimmer"
              >
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-2 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center shadow-xl">
            <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchUserProjects}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg font-semibold"
            >
              Retry
            </motion.button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedProjects.length === 0 && (
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-12 text-center shadow-xl">
            <FolderKanban className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {userProjects.length === 0
                ? currentUser?.accountType === "investor"
                  ? "No investments found"
                  : "No projects found"
                : "No projects match your filters"}
            </h3>
            <p className="text-gray-600 mb-6">
              {userProjects.length === 0
                ? currentUser?.accountType === "investor"
                  ? "Start investing in projects to build your portfolio"
                  : "Create your first project to get started"
                : "Try adjusting your filters to see more results"}
            </p>
            {userProjects.length === 0 &&
              currentUser?.accountType === "owner" && (
                <Link
                  href="/account/projects/add"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3a5a92] to-[#6fa8dc] dark:to-heading text-white rounded-xl hover:shadow-xl transition-all font-semibold"
                >
                  <Plus size={20} />
                  Create Your First Project
                </Link>
              )}
            {userProjects.length === 0 &&
              currentUser?.accountType === "investor" && (
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3a5a92] to-[#6fa8dc] dark:to-heading text-white rounded-xl hover:shadow-xl transition-all font-semibold"
                >
                  <TrendingUp size={20} />
                  Browse Projects
                </Link>
              )}
          </div>
        )}

        {/* Enhanced Projects Grid */}
        {!loading && !error && filteredAndSortedProjects.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedProjects.map((item, index) => {
              const project =
                currentUser?.accountType === "investor" ? item.project : item;
              const percentage =
                currentUser?.accountType === "investor"
                  ? item.percentage
                  : item.progress;
              const text1 =
                currentUser?.accountType === "investor"
                  ? "Fully owned"
                  : currentUser?.accountType === "admin"
                  ? "Fully Funded"
                  : "Sold";
              const text2 =
                currentUser?.accountType === "investor" ? "Invested" : "Funded";

              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/80 dark:bg-background/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 flex flex-col justify-between hover:shadow-2xl transition-all"
                >
                  {/* Project Image/Icon */}
                  <div className="mb-4">
                    {project.image ? (
                      <div className="w-full h-32 rounded-xl overflow-hidden mb-3">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 rounded-xl bg-gradient-to-br from-[#3a5a92]/20 to-[#6fa8dc]/20 flex items-center justify-center mb-3">
                        <FolderKanban className="text-[#3a5a92]" size={48} />
                      </div>
                    )}
                  </div>

                  {/* Project Title */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-background mb-2 line-clamp-2">
                      {project.title}
                    </h3>

                    {/* Category + Created Date */}
                    <div className="flex justify-between items-center text-sm mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-[#3a5a92]/10 to-[#6fa8dc]/10 text-[#3a5a92] rounded-full font-semibold">
                        {project.category?.[lang] || "N/A"}
                      </span>
                      <span className="text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Enhanced Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-paragraph">
                          {percentage === 100
                            ? text1
                            : `${percentage}% ${text2}`}
                        </span>
                        <span className="text-xs text-gray-500">
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200/50 h-3 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${progressColor(
                            percentage
                          )} shadow-lg`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                    <Link
                      href={`/projects/${project._id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3a5a92] to-[#6fa8dc] dark:to-heading text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                    {currentUser?.accountType != "investor" &&
                      percentage == 0 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(project._id)}
                          className="p-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
                          title="Delete"
                        >
                          <Trash size={18} />
                        </motion.button>
                      )}
                    {currentUser?.accountType != "investor" && (
                      <Link
                        href={`/account/projects/edit/${project._id}`}
                        className="p-2.5 text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition-all"
                        title="Edit"
                      >
                        <Pen size={18} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
