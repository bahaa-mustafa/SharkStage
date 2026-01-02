"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="flex flex-col items-center justify-between text-background dark:text-background max-lg:gap-4"
        style={{ position: "relative" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
