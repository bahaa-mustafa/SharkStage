"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import {
  Loader2,
  ArrowLeft,
  User,
  Calendar,
  DollarSign,
  Percent,
  FileText,
  Package,
} from "lucide-react";
import { getProjects } from "@/lib/features/projects/projectsThunks";

const statusConfig = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
    label: "Pending",
  },
  accepted: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
    label: "Accepted",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
    label: "Rejected",
  },
  cancelled: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
    label: "Cancelled",
  },
};

export default function SingleOfferPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOffer = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/offers/${params.id}`);
      setOffer(data.offer);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load offer");
      router.push("/account/offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchOffer();
    }
  }, [params.id]);

  const handleAccept = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/offers/accept/${offer._id}`);
      toast.success("Offer accepted successfully!");
      fetchOffer();
      dispatch(getProjects());
      router.push("/account/offers");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept offer");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/offers/reject/${offer._id}`);
      toast.success("Offer rejected");
      fetchOffer();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject offer");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/offers/cancel/${offer._id}`);
      toast.success("Offer cancelled");
      fetchOffer();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel offer");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!offer) {
    return null;
  }

  const status = statusConfig[offer.status] || statusConfig.pending;
  const isInvestor = currentUser?.accountType === "investor";
  const isPending = offer.status === "pending";

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-paragraph hover:text-heading mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Offers</span>
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-heading mb-2">
                Offer Details
              </h1>
              <p className="text-paragraph text-sm">
                Review the complete offer information
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${status.bg} ${status.text} ${status.border} self-start sm:self-center`}
            >
              {status.label}
            </span>
          </div>

          {/* Project Info */}
          <div className="bg-soft rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Package className="text-primary flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-xs text-paragraph mb-1">Project</p>
                <h2 className="text-xl font-semibold text-heading">
                  {offer.project.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Parties Involved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Offered By */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="text-primary" size={18} />
                <p className="text-xs text-paragraph font-semibold">
                  Offered By
                </p>
              </div>
              <p className="text-heading font-medium">
                {offer.offeredBy.firstName} {offer.offeredBy.lastName}
              </p>
              <p className="text-paragraph text-sm">{offer.offeredBy.email}</p>
            </div>

            {/* Offered To */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="text-primary" size={18} />
                <p className="text-xs text-paragraph font-semibold">
                  Offered To
                </p>
              </div>
              <p className="text-heading font-medium">
                {offer.offeredTo.firstName} {offer.offeredTo.lastName}
              </p>
              <p className="text-paragraph text-sm">{offer.offeredTo.email}</p>
            </div>
          </div>

          {/* Offer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Percentage */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="text-primary" size={18} />
                <p className="text-xs text-paragraph font-semibold">
                  Percentage
                </p>
              </div>
              <p className="text-2xl font-bold text-primary">
                {offer.percentage}%
              </p>
            </div>

            {/* Amount */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-green-700" size={18} />
                <p className="text-xs text-paragraph font-semibold">Amount</p>
              </div>
              <p className="text-2xl font-bold text-green-700">
                ${offer.amount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-paragraph mb-6">
            <Calendar size={16} />
            <span>
              Created on{" "}
              {new Date(offer.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Proposal Letter */}
          {offer.proposalLetter && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="text-primary" size={20} />
                <h3 className="font-semibold text-heading">Proposal Letter</h3>
              </div>
              <p className="text-paragraph  text-sm leading-relaxed whitespace-pre-line">
                {offer.proposalLetter}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {isPending && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              {isInvestor ? (
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                >
                  {actionLoading && (
                    <Loader2 size={18} className="animate-spin" />
                  )}
                  {actionLoading ? "Cancelling..." : "Cancel Offer"}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="flex-1 px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                  >
                    {actionLoading && (
                      <Loader2 size={18} className="animate-spin" />
                    )}
                    {actionLoading ? "Processing..." : "Reject"}
                  </button>
                  <button
                    onClick={handleAccept}
                    disabled={actionLoading}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                  >
                    {actionLoading && (
                      <Loader2 size={18} className="animate-spin" />
                    )}
                    {actionLoading ? "Processing..." : "Accept Offer"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
