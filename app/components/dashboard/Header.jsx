"use client";
import { useEffect, useState, useRef } from "react";
import { ChevronDown, User, LogOut, LayoutGrid, Settings } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logoutUser } from "@/lib/features/auth/auththunks";
import Notifications from "./Notifications";
import { motion, AnimatePresence } from "framer-motion";
import ThemeButton from "../ThemeButton";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className=" bg-white/80 dark:bg-background-dark dark:text-background backdrop-blur-xl shadow-lg border-b border-gray-200/50 p-3 sm:p-4 flex justify-between items-center sticky top-0 z-40">
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3a5a92]/5 via-[#6fa8dc]/5 to-[#8b5cf6]/5" />

      <div className="relative z-10 flex-1 flex items-center">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary  bg-clip-text text-transparent">
          Dashboard
        </h1>
      </div>

      <div className="relative z-10 flex items-center space-x-3 sm:space-x-4">
        <ThemeButton />
        {/* Notifications */}
        <Notifications />

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gradient-to-r hover:from-[#3a5a92]/10 hover:to-[#6fa8dc]/10 transition-all focus:outline-none focus:ring-2 focus:ring-[#3a5a92]/20"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border-2 border-gradient-to-r from-[#3a5a92] to-[#6fa8dc] shadow-lg relative">
              {currentUser?.profilePicUrl ? (
                <img
                  src={currentUser.profilePicUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#3a5a92] to-[#6fa8dc] dark:to-heading flex items-center justify-center text-white text-sm font-semibold">
                  {currentUser?.firstName?.charAt(0) || "U"}
                  {currentUser?.lastName?.charAt(0) || ""}
                </div>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 dark:text-background">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-paragraph capitalize">
                {currentUser?.accountType}
              </p>
            </div>
            <motion.div
              animate={{ rotate: userMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </motion.div>
          </motion.button>

          {/* Enhanced Dropdown Menu */}
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 mt-2 bg-white/95 dark:bg-background-dark backdrop-blur-xl shadow-2xl rounded-2xl w-64 py-2 z-50 border border-gray-200/50 overflow-hidden"
              >
                {/* Gradient Header */}
                <div className="px-4 py-4 bg-gradient-to-r from-[#3a5a92] to-[#6fa8dc] dark:to-heading text-white">
                  <p className="text-sm font-semibold">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <p className="text-xs text-white/80 truncate">
                    {currentUser?.email}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    href="/account"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-background hover:bg-gradient-to-r hover:from-[#3a5a92]/10 hover:to-[#6fa8dc]/10 transition-all group"
                  >
                    <LayoutGrid className="w-4 h-4 text-[#3a5a92] group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Dashboard</span>
                  </Link>

                  <Link
                    href="/account/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-background hover:bg-gradient-to-r hover:from-[#3a5a92]/10 hover:to-[#6fa8dc]/10 transition-all group"
                  >
                    <User className="w-4 h-4 text-[#3a5a92] group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Profile</span>
                  </Link>

                  <Link
                    href="/account/projects"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-background hover:bg-gradient-to-r hover:from-[#3a5a92]/10 hover:to-[#6fa8dc]/10 transition-all group"
                  >
                    <LayoutGrid className="w-4 h-4 text-[#3a5a92] group-hover:scale-110 transition-transform" />
                    <span className="font-medium">
                      {currentUser?.accountType === "investor"
                        ? "My Investments"
                        : "My Projects"}
                    </span>
                  </Link>

                  <Link
                    href="/account/offers"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-background hover:bg-gradient-to-r hover:from-[#3a5a92]/10 hover:to-[#6fa8dc]/10 transition-all group"
                  >
                    <LayoutGrid className="w-4 h-4 text-[#3a5a92] group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Offers</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200/50 pt-2">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-all group"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
