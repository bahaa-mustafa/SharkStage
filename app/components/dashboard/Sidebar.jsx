"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import {
  LayoutGrid,
  FolderKanban,
  UserCog,
  House,
  PanelTop,
  Handshake,
  Activity,
  Shield,
  Users,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const { currentUser, isLoggedIn } = useSelector((state) => state.auth);

  // Auto-close sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getLinkClass = (isActive) => {
    const base = `flex items-center gap-3 rounded-xl transition-all duration-200 ${
      open ? "px-4 py-3 justify-start" : "px-0 py-3 justify-center"
    }`;
    const color = isActive
      ? "bg-gradient-to-r from-[#3a5a92] to-[#6fa8dc] text-white shadow-lg"
      : "text-gray-700 dark:text-background hover:bg-gradient-to-r hover:from-[#3a5a92]/10 hover:to-[#6fa8dc]/10 hover:text-[#3a5a92] dark:hover:text-[#6fa8dc]";
    return `${base} ${color}`;
  };

  return (
    <aside
      className={`sticky top-0 bg-white/80 dark:bg-background-dark/70 backdrop-blur-xl text-gray-700 border-r border-gray-200/50 h-screen flex flex-col transition-all duration-300 shadow-xl ${
        open ? "w-64" : "w-20"
      }`}
      aria-label="Sidebar"
    >
      {/* Enhanced Header */}
      <div
        className={`flex items-center p-4 border-b border-gray-200/50 bg-gradient-to-r from-[#3a5a92]/5 to-[#6fa8dc]/5 ${
          open ? "justify-between" : "justify-center"
        }`}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: open ? 1 : 0 }}
          className={`font-bold text-lg bg-gradient-to-r from-[#3a5a92] to-[#6fa8dc] bg-clip-text text-transparent transition-all duration-400 overflow-hidden ${
            open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3 w-0"
          }`}
        >
          Shark Stage
        </motion.span>

        {/* Toggle button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen((s) => !s)}
          className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-[#3a5a92]/10 hover:to-[#6fa8dc]/10 focus:outline-none focus:ring-2 focus:ring-[#3a5a92]/20 transition"
          aria-label="Toggle sidebar"
        >
          <FiMenu size={20} className="text-[#3a5a92]" />
        </motion.button>
      </div>

      {/* Enhanced Nav */}
      <nav className="p-3 flex-1 flex flex-col gap-2 text-slate-700">
        <motion.div
          className={"dark:text-background"}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            href="/account"
            className={getLinkClass(pathname === "/account")}
          >
            <LayoutGrid
              className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
            />
            {open && <span className="text-sm font-medium">Overview</span>}
          </Link>
        </motion.div>

        {currentUser?.accountType != "admin" && (
          <motion.div
            className={"dark:text-background"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Link
              href="/account/projects"
              className={getLinkClass(pathname === "/account/projects")}
            >
              <FolderKanban
                className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
              />
              {open && <span className="text-sm font-medium">Projects</span>}
            </Link>
          </motion.div>
        )}

        <motion.div
          className={"dark:text-background"}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/account/profile"
            className={getLinkClass(pathname === "/account/profile")}
          >
            <UserCog
              className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
            />
            {open && <span className="text-sm font-medium">Profile</span>}
          </Link>
        </motion.div>

        <motion.div
          className={"dark:text-background"}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Link
            href="/account/activity"
            className={getLinkClass(pathname.startsWith("/account/activity"))}
          >
            <Activity
              className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
            />
            {open && <span className="text-sm font-medium">Activity</span>}
          </Link>
        </motion.div>

        {currentUser?.accountType != "admin" && (
          <motion.div
            className={"dark:text-background"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/account/offers"
              className={`${getLinkClass(
                pathname.startsWith("/account/offers")
              )}`}
            >
              <Handshake
                className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
              />
              {open && <span className="text-sm font-medium">Offers</span>}
            </Link>
          </motion.div>
        )}

        {currentUser?.accountType === "admin" && (
          <>
            <div className="border-t border-gray-200/50 my-2" />
            <motion.div
              className={"dark:text-background"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/account/admin/users"
                className={getLinkClass(
                  pathname.startsWith("/account/admin/users")
                )}
              >
                <Users
                  className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
                />
                {open && <span className="text-sm font-medium">Users</span>}
              </Link>
            </motion.div>
            <motion.div
              className={"dark:text-background"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Link
                href="/account/admin/projects"
                className={getLinkClass(
                  pathname.startsWith("/account/admin/projects")
                )}
              >
                <FolderKanban
                  className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
                />
                {open && <span className="text-sm font-medium">Projects</span>}
              </Link>
            </motion.div>
            <motion.div
              className={"dark:text-background"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/account/admin/blogs"
                className={getLinkClass(
                  pathname.startsWith("/account/admin/blogs")
                )}
              >
                <FileText
                  className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
                />
                {open && <span className="text-sm font-medium">Blogs</span>}
              </Link>
            </motion.div>
            <motion.div
              className={"dark:text-background"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Link
                href="/account/admin/faqs"
                className={getLinkClass(
                  pathname.startsWith("/account/admin/faqs")
                )}
              >
                <MessageSquare
                  className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
                />
                {open && <span className="text-sm font-medium">FAQs</span>}
              </Link>
            </motion.div>
          </>
        )}

        <div className="border-t border-gray-200/50 my-2" />

        <motion.div
          className={"dark:text-background"}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Link href="/" className={getLinkClass(pathname === "/")}>
            <House
              className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
            />
            {open && <span className="text-sm font-medium">Home</span>}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/projects"
            className={getLinkClass(
              pathname.startsWith("/projects") && pathname !== "/projects"
            )}
          >
            <PanelTop
              className={`h-5 w-5 flex-shrink-0 ${open ? "" : "mx-auto"}`}
            />
            {open && (
              <span className="text-sm font-medium">Browse projects</span>
            )}
          </Link>
        </motion.div>
      </nav>

      {/* Enhanced Footer */}
      <div className="p-3 border-t border-gray-200/50 bg-gradient-to-r from-[#3a5a92]/5 to-[#6fa8dc]/5">
        {open ? (
          <div className="text-xs text-gray-600 font-medium">
            <div className="flex items-center justify-between">
              <span>v1.0</span>
              <span className="text-[#3a5a92] font-bold">SharkStage</span>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600 text-xs font-medium">
            v1.0
          </div>
        )}
      </div>
    </aside>
  );
}
