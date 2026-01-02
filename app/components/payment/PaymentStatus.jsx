"use client";
import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";

export default function PaymentStatus({ status, transactionId, message }) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      darkColor: "dark:text-yellow-400",
      bgColor: "bg-yellow-50",
      darkBgColor: "dark:bg-yellow-900/20",
      title: "Payment Pending",
      description: "Your payment is being processed...",
    },
    processing: {
      icon: Loader2,
      color: "text-blue-600",
      darkColor: "dark:text-blue-400",
      bgColor: "bg-blue-50",
      darkBgColor: "dark:bg-blue-900/20",
      title: "Processing Payment",
      description: "Please wait while we process your payment...",
      animate: true,
    },
    completed: {
      icon: CheckCircle2,
      color: "text-green-600",
      darkColor: "dark:text-green-400",
      bgColor: "bg-green-50",
      darkBgColor: "dark:bg-green-900/20",
      title: "Payment Successful",
      description: "Your payment has been confirmed successfully!",
    },
    failed: {
      icon: XCircle,
      color: "text-red-600",
      darkColor: "dark:text-red-400",
      bgColor: "bg-red-50",
      darkBgColor: "dark:bg-red-900/20",
      title: "Payment Failed",
      description: message || "Your payment could not be processed.",
    },
    refunded: {
      icon: CheckCircle2,
      color: "text-gray-600",
      darkColor: "dark:text-gray-400",
      bgColor: "bg-gray-50",
      darkBgColor: "dark:bg-gray-800/20",
      title: "Payment Refunded",
      description: "This payment has been refunded.",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const borderColor = 
    status === "completed" ? "border-green-200 dark:border-green-800/30" : 
    status === "failed" ? "border-red-200 dark:border-red-800/30" : 
    "border-gray-200 dark:border-gray-700";

  return (
    <div className={`p-6 rounded-xl ${config.bgColor} ${config.darkBgColor} border-2 ${borderColor}`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 ${config.color} ${config.darkColor}`}>
          {config.animate ? (
            <Icon className="w-8 h-8 animate-spin" />
          ) : (
            <Icon className="w-8 h-8" />
          )}
        </div>
        <div className="flex-grow">
          <h3 className={`text-lg font-bold ${config.color} ${config.darkColor} mb-1`}>
            {config.title}
          </h3>
          <p className="text-gray-700 dark:text-paragraph mb-2">{config.description}</p>
          {transactionId && (
            <p className="text-sm text-gray-500 dark:text-paragraph">
              Transaction ID: <span className="font-mono">{transactionId}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

