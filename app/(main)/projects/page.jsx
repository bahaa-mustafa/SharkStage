"use client";
import { useState, useMemo } from "react";
import ProjectCard from "@/app/components/projects/ProjectCard";
import FilterBar from "@/app/components/projects/FilterBar";
import Pagination from "@/app/components/projects/Pagination";
import { TrendingUp, Target, DollarSign } from "lucide-react";
import { useSelector } from "react-redux";

const lang = "en";
export default function ProjectsPage() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [roiRange, setRoiRange] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const { projects, projectsLoading } = useSelector((state) => state.projects);

  const projectsPerPage = 9;
  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (project) => project.category[lang] === selectedCategory
      );
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (project) => project.status === selectedStatus
      );
    }

    // Apply ROI filter
    if (roiRange > 0) {
      filtered = filtered.filter((project) => {
        const roi = parseInt(project.expectedROI);
        return roi >= roiRange;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "roi-high":
          return parseInt(b.expectedROI) - parseInt(a.expectedROI);
        case "networth-high":
          return b.totalPrice - a.totalPrice;
        case "most-funded":
          return b.currentFunding - a.currentFunding;
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    projects,
    searchQuery,
    selectedCategory,
    selectedStatus,
    roiRange,
    sortBy,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedProjects.length / projectsPerPage
  );
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredAndSortedProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (callback) => {
    callback();
    setCurrentPage(1);
  };

  // Calculate stats
  // const totalFunding = projects.reduce(
  //   (sum, project) => sum + project.currentFunding,
  //   0
  // );
  const activeProjects = projects.filter(
    (project) => project.status === "active"
  ).length;
  const avgROI =
    projects.reduce((sum, project) => sum + parseInt(project.expectedROI), 0) /
    projects.length;

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary dark:to-heading text-white py-20 pt-40 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Explore Investment Opportunities
          </h1>
          <p className="text-xl text-center mb-8 text-background/90">
            Discover innovative projects seeking strategic investors
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-8 h-8 text-buttons" />
                <h3 className="text-lg font-semibold">Active Projects</h3>
              </div>
              <p className="text-3xl font-bold">{activeProjects}</p>
              <p className="text-sm text-background/80 mt-1">
                Ready for investment
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-8 h-8 text-buttons" />
                <h3 className="text-lg font-semibold">Total Raised</h3>
              </div>
              {/* <p className="text-3xl font-bold">
                ${(totalFunding / 1000000).toFixed(1)}M
              </p> */}
              <p className="text-sm text-background/80 mt-1">
                Across all projects
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-buttons" />
                <h3 className="text-lg font-semibold">Average ROI</h3>
              </div>
              <p className="text-3xl font-bold">{avgROI.toFixed(0)}%</p>
              <p className="text-sm text-background/80 mt-1">
                Expected returns
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter Bar */}
        <FilterBar
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
          roiRange={roiRange}
          onRoiChange={(value) => handleFilterChange(() => setRoiRange(value))}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-paragraph">
            Showing{" "}
            <span className="font-semibold text-heading dark:text-background">
              {currentProjects.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-heading dark:text-background">
              {filteredAndSortedProjects.length}
            </span>{" "}
            projects
          </p>
        </div>

        {/* Projects Grid */}
        {currentProjects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-heading mb-2">
              No projects found
            </h3>
            <p className="text-paragraph">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
