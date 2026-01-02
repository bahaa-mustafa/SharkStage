"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AdminUsersTable from "@/app/components/admin/AdminUsersTable";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const { currentUser } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      return;
    }
    if (currentUser.accountType !== "admin") {
      toast.error("Access denied. Admin only.");
      router.push("/account");
      return;
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.accountType !== "admin") {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0f172a] via-[#1a1a2e] to-[#16213e] dark:from-background-dark dark:via-background-dark dark:to-background-dark">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] dark:from-background/20 dark:via-background/20 dark:to-background/20 p-6 sm:p-8 mb-8 shadow-2xl border border-[#0f3460]/50 dark:border-background/30"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0f3460]/20 dark:bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#16213e]/30 dark:bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-[#0f3460] to-[#16213e] dark:from-primary/20 dark:to-secondary/20 rounded-2xl shadow-xl border border-[#0f3460]/50 dark:border-primary/30">
              <Users className="text-blue-400 dark:text-primary-dark" size={40} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-yellow-400 dark:text-buttons" size={24} />
                <h1 className="text-3xl sm:text-4xl font-bold text-white dark:text-background">
                  Users Management
                </h1>
              </div>
              <p className="text-gray-300 dark:text-paragraph text-lg">
                Manage all platform users, ban/unban accounts, and change account types
              </p>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <AdminUsersTable />
      </div>
    </div>
  );
}

