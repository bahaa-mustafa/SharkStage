"use client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import { TrendingUp, FolderKanban, Users } from "lucide-react";

const COLORS = ["#0f3460", "#16213e", "#1a1a2e", "#3a5a92", "#6fa8dc", "#10b981"];

export default function AdminCharts({ userGrowth, projectGrowth, categoryDistribution, accountTypeDistribution }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* User Growth Chart */}
      <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#0f3460]/30">
        <h3 className="text-xl font-bold mb-6 text-gray-200 flex items-center gap-2">
          <Users className="text-blue-400" size={24} />
          User Growth (Last 6 Months)
        </h3>
        <div className="w-full h-64">
          {userGrowth && userGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3a5a92" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0f3460" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  formatter={(value) => `${value} users`}
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #0f3460",
                    borderRadius: "8px",
                    color: "#f3f4f6",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3a5a92"
                  strokeWidth={2}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Project Growth Chart */}
      <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#0f3460]/30">
        <h3 className="text-xl font-bold mb-6 text-gray-200 flex items-center gap-2">
          <FolderKanban className="text-purple-400" size={24} />
          Project Growth (Last 6 Months)
        </h3>
        <div className="w-full h-64">
          {projectGrowth && projectGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectGrowth}>
                <defs>
                  <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0f3460" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  formatter={(value) => `${value} projects`}
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #0f3460",
                    borderRadius: "8px",
                    color: "#f3f4f6",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="projects"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#colorProjects)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#0f3460]/30">
        <h3 className="text-xl font-bold mb-6 text-gray-200 flex items-center gap-2">
          <FolderKanban className="text-green-400" size={24} />
          Category Distribution
        </h3>
        <div className="w-full h-64">
          {categoryDistribution && Object.keys(categoryDistribution).length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(categoryDistribution).map(([name, value]) => ({ name, value }))}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {Object.entries(categoryDistribution).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-sm font-medium text-gray-300">{value}</span>}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #0f3460",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                  labelStyle={{
                    color: "#f3f4f6",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "6px",
                  }}
                  itemStyle={{
                    color: "#e5e7eb",
                    fontSize: "13px",
                    padding: "2px 0",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Account Type Distribution */}
      <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#0f3460]/30">
        <h3 className="text-xl font-bold mb-6 text-gray-200 flex items-center gap-2">
          <Users className="text-yellow-400" size={24} />
          Account Type Distribution
        </h3>
        <div className="w-full h-64">
          {accountTypeDistribution && Object.keys(accountTypeDistribution).length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(accountTypeDistribution).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))}>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #0f3460",
                    borderRadius: "8px",
                    color: "#f3f4f6",
                  }}
                />
                <Bar dataKey="value" fill="#3a5a92" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

