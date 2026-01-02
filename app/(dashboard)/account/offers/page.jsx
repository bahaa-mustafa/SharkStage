"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import OffersCards from "./OffersCards";
import { Handshake, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function OffersPage() {
  const { currentUser } = useSelector((state) => state.auth);
  const [userOffers, setUserOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserOffers = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      if (currentUser.accountType == "investor") {
        const res = await api.get(`/offers/sent`);
        setUserOffers(res.data.offers || []);
      }
      if (currentUser.accountType == "owner") {
        const res = await api.get(`/offers/received`);
        setUserOffers(res.data.offers || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load offers");
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOffers();
  }, [currentUser]);

  return (
    <div className="p-4 sm:p-6 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-background-dark dark:via-background-dark dark:to-background-dark">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3a5a92] via-[#6fa8dc] to-[#8b5cf6] p-6 sm:p-8 mb-8 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Handshake className="text-yellow-300" size={40} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-yellow-300" size={24} />
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  My Offers
                </h1>
              </div>
              <p className="text-white/90 text-lg">
                {currentUser?.accountType === "investor"
                  ? "Manage your investment offers"
                  : "Review and respond to project offers"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/80 dark:bg-background/10 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-none p-6 animate-shimmer border border-white/20 dark:border-0">
                <div className="h-6 bg-gray-200 dark:bg-background/20 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-background/20 rounded mb-4"></div>
                <div className="h-2 bg-gray-200 dark:bg-background/20 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 dark:bg-background/20 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/30 rounded-2xl p-8 text-center shadow-xl">
            <p className="text-red-600 dark:text-red-400 font-semibold text-lg mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchUserOffers}
              className="px-6 py-3 bg-red-600 dark:bg-red-700 text-white rounded-xl hover:bg-red-700 dark:hover:bg-red-800 transition-all shadow-lg font-semibold"
            >
              Retry
            </motion.button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && userOffers.length === 0 && (
          <div className="bg-white/80 dark:bg-background/10 backdrop-blur-lg border border-gray-200 dark:border-0 rounded-2xl p-12 text-center shadow-xl">
            <Handshake className="mx-auto text-gray-400 dark:text-paragraph mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-800 dark:text-background mb-2">
              No offers found
            </h3>
            <p className="text-gray-600 dark:text-paragraph">
              {currentUser?.accountType === "investor"
                ? "You haven't sent any offers yet"
                : "You haven't received any offers yet"}
            </p>
          </div>
        )}

        {/* Offers Cards */}
        {!loading && !error && userOffers.length > 0 && (
          <OffersCards
            userOffers={userOffers}
            currentUser={currentUser}
            fetchUserOffers={fetchUserOffers}
          />
        )}
      </div>
    </div>
  );
}
