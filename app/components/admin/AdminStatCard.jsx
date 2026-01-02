"use client";
import { motion } from "framer-motion";

export default function AdminStatCard({ label, value, icon, color, trend, trendValue, delay = 0 }) {
  const colorMap = {
    blue: {
      bg: "from-blue-600/20 to-blue-800/10",
      border: "border-blue-600/30",
      iconBg: "from-blue-600 to-blue-800",
      text: "text-blue-400",
    },
    green: {
      bg: "from-green-600/20 to-green-800/10",
      border: "border-green-600/30",
      iconBg: "from-green-600 to-green-800",
      text: "text-green-400",
    },
    purple: {
      bg: "from-purple-600/20 to-purple-800/10",
      border: "border-purple-600/30",
      iconBg: "from-purple-600 to-purple-800",
      text: "text-purple-400",
    },
    yellow: {
      bg: "from-yellow-600/20 to-yellow-800/10",
      border: "border-yellow-600/30",
      iconBg: "from-yellow-600 to-yellow-800",
      text: "text-yellow-400",
    },
    red: {
      bg: "from-red-600/20 to-red-800/10",
      border: "border-red-600/30",
      iconBg: "from-red-600 to-red-800",
      text: "text-red-400",
    },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.03, y: -5 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} p-6 shadow-xl backdrop-blur-sm`}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50`} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colors.iconBg} flex items-center justify-center shadow-lg border border-[#0f3460]/30`}>
            {icon}
          </div>
          {trend && trendValue && (
            <div className={`px-3 py-1.5 rounded-lg ${trend === "up" ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"} border ${trend === "up" ? "border-green-600/30" : "border-red-600/30"}`}>
              <span className="text-xs font-bold">{trendValue}</span>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{label}</p>
          <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

