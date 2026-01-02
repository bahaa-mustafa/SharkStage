import MessageForm from "@/app/(main)/projects/[id]/MessageForm";
import api from "@/lib/axios";
import { getProjects } from "@/lib/features/projects/projectsThunks";
import { Loader2, Eye, CheckCircle2, XCircle, Clock, DollarSign, Percent, User, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

const lang = "en";

const statusConfig = (status) => {
  switch (status) {
    case "accepted":
      return {
        color: "from-green-500 to-green-600",
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: CheckCircle2,
      };
    case "rejected":
      return {
        color: "from-red-500 to-red-600",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: XCircle,
      };
    case "pending":
      return {
        color: "from-yellow-500 to-yellow-600",
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
        icon: Clock,
      };
    default:
      return {
        color: "from-gray-500 to-gray-600",
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: Clock,
      };
  }
};

const statusText = (status) => {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    case "pending":
      return "Pending";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

export default function OffersCards({
  userOffers,
  onView,
  currentUser,
  fetchUserOffers,
}) {
  const [offerAcceptLoading, setOfferAcceptLoading] = useState(false);
  const [offerRejectLoading, setOfferRejectLoading] = useState(false);
  const [offerCancelLoading, setOfferCancelLoading] = useState(false);
  const dispatch = useDispatch();

  const acceptOffer = async (id) => {
    setOfferAcceptLoading(true);
    try {
      await api.patch(`/offers/accept/${id}`);
      toast.success("Offer accepted");
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      }
    } finally {
      fetchUserOffers();
      setOfferAcceptLoading(false);
      dispatch(getProjects());
    }
  };

  const rejectOffer = async (id) => {
    setOfferRejectLoading(true);
    try {
      await api.patch(`/offers/reject/${id}`);
      toast.success("Offer rejected");
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      }
    } finally {
      fetchUserOffers();
      setOfferRejectLoading(false);
    }
  };

  const cancelOffer = async (id) => {
    setOfferCancelLoading(true);
    try {
      await api.patch(`/offers/cancel/${id}`);
      toast.success("Offer cancelled");
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      }
    } finally {
      fetchUserOffers();
      setOfferCancelLoading(false);
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {userOffers.map((offer, index) => {
        const statusInfo = statusConfig(offer.status);
        const StatusIcon = statusInfo.icon;

        return (
          <motion.div
            key={offer._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/80 dark:bg-background/10 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-none border border-white/20 dark:border-0 p-6 flex flex-col justify-between hover:shadow-2xl transition-all"
          >
            {/* Header Section */}
            <div>
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 ${statusInfo.border} ${statusInfo.text} flex items-center gap-2`}
                >
                  <StatusIcon size={14} />
                  {statusText(offer.status)}
                </span>
                <span className="text-xs text-gray-500 dark:text-paragraph font-medium">
                  {new Date(offer.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Project Title */}
              <h3 className="text-xl font-bold text-gray-800 dark:text-background mb-3 line-clamp-2">
                {offer.project?.title}
              </h3>

              {/* Category */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-[#3a5a92]/10 to-[#6fa8dc]/10 text-[#3a5a92] text-xs font-semibold rounded-full">
                  {offer.project?.category?.[lang] || "N/A"}
                </span>
              </div>

              {/* Offered To/By */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-background/30">
                <p className="text-xs text-gray-500 dark:text-paragraph mb-2 flex items-center gap-1">
                  <User size={12} />
                  {currentUser?.accountType == "investor"
                    ? "Offered To"
                    : "Offered By"}
                </p>
                <p className="text-sm font-bold text-gray-800 dark:text-background">
                  {currentUser?.accountType == "investor"
                    ? `${offer.offeredTo?.firstName || ""} ${offer.offeredTo?.lastName || ""}`
                    : `${offer.offeredBy?.firstName || ""} ${offer.offeredBy?.lastName || ""}`}
                </p>
              </div>

              {/* Offer Details */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#3a5a92]/5 to-[#6fa8dc]/5 dark:from-primary/20 dark:to-secondary/20 rounded-xl">
                  <span className="text-sm text-gray-600 dark:text-paragraph flex items-center gap-2">
                    <Percent size={16} className="text-[#3a5a92] dark:text-primary-dark" />
                    Percentage:
                  </span>
                  <span className="text-lg font-bold text-[#3a5a92] dark:text-primary-dark">
                    {offer.percentage}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#3a5a92]/5 to-[#6fa8dc]/5 dark:from-primary/20 dark:to-secondary/20 rounded-xl">
                  <span className="text-sm text-gray-600 dark:text-paragraph flex items-center gap-2">
                    <DollarSign size={16} className="text-[#3a5a92] dark:text-primary-dark" />
                    Amount:
                  </span>
                  <span className="text-lg font-bold text-gray-800 dark:text-background">
                    ${offer.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Proposal Letter Preview */}
              {offer.proposalLetter && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-background/10 rounded-xl border border-gray-200 dark:border-0">
                  <p className="text-xs text-gray-700 dark:text-background font-bold mb-2 flex items-center gap-1">
                    <FileText size={12} />
                    Proposal
                  </p>
                  <p className="text-xs text-gray-600 dark:text-paragraph line-clamp-2">
                    {offer.proposalLetter.slice(0, 100)}
                    {offer.proposalLetter.length > 100 ? "..." : null}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-background/30">
              <Link
                href={`/account/offers/${offer._id}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#3a5a92] to-[#6fa8dc] dark:to-heading text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
              >
                <Eye size={18} />
                View Details
              </Link>

              {offer.status === "pending" &&
                (currentUser?.accountType == "investor" ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={offerCancelLoading}
                    onClick={() => cancelOffer(offer._id)}
                    className="w-full px-4 py-3 border-2 border-red-300 dark:border-red-800/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {offerCancelLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <XCircle size={18} />
                        Cancel
                      </>
                    )}
                  </motion.button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={offerAcceptLoading || offerRejectLoading}
                      onClick={() => rejectOffer(offer._id)}
                      className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {offerRejectLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          <XCircle size={18} />
                          Reject
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={offerAcceptLoading || offerRejectLoading}
                      onClick={() => acceptOffer(offer._id)}
                      className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {offerAcceptLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          Accept
                        </>
                      )}
                    </motion.button>
                  </div>
                ))}

              {offer.status !== "cancelled" &&
                (currentUser?.accountType == "owner" ? (
                  <div className="mt-3">
                    <MessageForm owner={offer.offeredBy} />
                  </div>
                ) : null)}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
