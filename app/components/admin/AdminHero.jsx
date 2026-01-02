"use client";
import { Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminHero({ currentUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-8 sm:p-10 mb-8 shadow-2xl border border-[#0f3460]/50"
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0f3460]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#16213e]/30 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-gradient-to-br from-[#0f3460] to-[#16213e] rounded-2xl shadow-xl border border-[#0f3460]/50">
            <Shield className="text-yellow-400" size={48} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-yellow-400" size={28} />
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-gray-300 text-lg">
              Welcome back, <span className="text-yellow-400 font-semibold">{currentUser?.firstName} {currentUser?.lastName}</span>
            </p>
            <div className="mt-3">
              <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#0f3460] to-[#16213e] text-yellow-400 rounded-full text-sm font-bold border border-[#0f3460]/50">
                ADMIN PRIVILEGES
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="bg-[#0f172a]/50 backdrop-blur-sm rounded-xl p-4 border border-[#0f3460]/30">
            <p className="text-gray-400 text-xs mb-1">Platform Status</p>
            <p className="text-green-400 font-bold text-lg">Active</p>
          </div>
          <div className="bg-[#0f172a]/50 backdrop-blur-sm rounded-xl p-4 border border-[#0f3460]/30">
            <p className="text-gray-400 text-xs mb-1">Last Login</p>
            <p className="text-gray-300 font-semibold text-sm">Now</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

