"use client";
import { CheckCircle2, XCircle, Clock, RefreshCw, Eye } from "lucide-react";
import { useState } from "react";
import { refundPayment } from "@/lib/api/payment.api";
import toast from "react-hot-toast";

export default function TransactionCard({ transaction, onRefund }) {
  const [refunding, setRefunding] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle2,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800/30",
        };
      case "failed":
        return {
          icon: XCircle,
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800/30",
        };
      case "pending":
      case "processing":
        return {
          icon: Clock,
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800/30",
        };
      case "refunded":
        return {
          icon: RefreshCw,
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-800/20",
          borderColor: "border-gray-200 dark:border-gray-700",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-800/20",
          borderColor: "border-gray-200 dark:border-gray-700",
        };
    }
  };

  const statusConfig = getStatusConfig(transaction.status);
  const Icon = statusConfig.icon;

  const handleRefund = async () => {
    if (!confirm("Are you sure you want to refund this transaction?")) {
      return;
    }

    setRefunding(true);
    try {
      await refundPayment(transaction.transactionId);
      toast.success("Refund request submitted successfully");
      if (onRefund) onRefund();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process refund");
    } finally {
      setRefunding(false);
    }
  };

  const canRefund =
    transaction.status === "completed" &&
    !transaction.refundedAmount &&
    new Date(transaction.createdAt) >
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days

  return (
    <div
      className={`p-6 rounded-xl border-2 ${statusConfig.borderColor} ${statusConfig.bgColor} dark:bg-background/10 transition-all hover:shadow-lg`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-grow">
          <div className={`${statusConfig.color}`}>
            <Icon className="w-8 h-8" />
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-background">
                {transaction.project?.title || "Project"}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}
              >
                {transaction.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-paragraph">
              Transaction ID: {transaction.transactionId}
            </p>
            <p className="text-sm text-gray-500 dark:text-paragraph">
              {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-background">
            ${transaction.amount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-paragraph">{transaction.currency}</p>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-background/30 space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-paragraph">Payment Method</p>
              <p className="font-semibold text-gray-900 dark:text-background capitalize">
                {transaction.paymentMethod || "Card"}
              </p>
            </div>
            {transaction.metadata?.percentage && (
              <div>
                <p className="text-gray-500 dark:text-paragraph">Investment Percentage</p>
                <p className="font-semibold text-gray-900 dark:text-background">
                  {transaction.metadata.percentage}%
                </p>
              </div>
            )}
            {transaction.refundedAmount > 0 && (
              <div>
                <p className="text-gray-500 dark:text-paragraph">Refunded Amount</p>
                <p className="font-semibold text-red-600 dark:text-red-400">
                  ${transaction.refundedAmount.toLocaleString()}
                </p>
              </div>
            )}
            {transaction.failureReason && (
              <div className="col-span-2">
                <p className="text-gray-500 dark:text-paragraph">Failure Reason</p>
                <p className="font-semibold text-red-600 dark:text-red-400">
                  {transaction.failureReason}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-background hover:bg-gray-100 dark:hover:bg-background/20 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          {showDetails ? "Hide" : "Show"} Details
        </button>
        {canRefund && (
          <button
            onClick={handleRefund}
            disabled={refunding}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-4 h-4 ${refunding ? "animate-spin" : ""}`}
            />
            {refunding ? "Processing..." : "Request Refund"}
          </button>
        )}
      </div>
    </div>
  );
}

