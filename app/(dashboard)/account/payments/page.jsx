"use client";
import { useState, useEffect } from "react";
import { CreditCard, Filter, Download, Loader2 } from "lucide-react";
import TransactionCard from "@/app/components/payment/TransactionCard";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
  });

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      // Note: You'll need to create a backend endpoint to get user transactions
      // For now, we'll use a placeholder
      const response = await api.get("/payment/transactions");
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = () => {
    loadTransactions();
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filters.status !== "all" && transaction.status !== filters.status) {
      return false;
    }
    // Add date range filtering if needed
    return true;
  });

  const exportCSV = () => {
    const headers = [
      "Transaction ID",
      "Date",
      "Project",
      "Amount",
      "Status",
      "Payment Method",
    ];
    const rows = filteredTransactions.map((t) => [
      t.transactionId,
      new Date(t.createdAt).toLocaleDateString(),
      t.project?.title || "N/A",
      t.amount,
      t.status,
      t.paymentMethod,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-heading dark:text-background mb-2">
                Payment History
              </h1>
              <p className="text-paragraph dark:text-paragraph">
                View and manage all your payment transactions
              </p>
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-background/10 border border-gray-300 dark:border-0 rounded-lg hover:bg-gray-50 dark:hover:bg-background/20 dark:text-background transition-colors"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 bg-white dark:bg-background/10 p-4 rounded-lg border border-gray-200 dark:border-0">
            <Filter className="w-5 h-5 text-gray-500 dark:text-paragraph" />
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white dark:bg-background/10 rounded-xl p-12 text-center border border-gray-200 dark:border-0">
            <CreditCard className="w-16 h-16 text-gray-400 dark:text-paragraph mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-background mb-2">
              No Transactions Found
            </h3>
            <p className="text-gray-500 dark:text-paragraph">
              You haven't made any payments yet. Start investing in projects to
              see your transaction history here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.transactionId}
                transaction={transaction}
                onRefund={handleRefund}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

