"use client";
import { useState, useEffect } from "react";
import { CreditCard, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { getPaymentMethods, deletePaymentMethod, savePaymentMethod } from "@/lib/api/payment.api";
import toast from "react-hot-toast";

export default function PaymentSettingsPage() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
  });

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await getPaymentMethods();
      setPaymentMethods(response.paymentMethods || []);
    } catch (error) {
      console.error("Error loading payment methods:", error);
      toast.error("Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (methodId) => {
    if (!confirm("Are you sure you want to delete this payment method?")) {
      return;
    }

    try {
      await deletePaymentMethod(methodId);
      toast.success("Payment method deleted successfully");
      loadPaymentMethods();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete payment method");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await savePaymentMethod({
        type: "card",
        ...formData,
        expiryMonth: parseInt(formData.expiryMonth),
        expiryYear: 2000 + parseInt(formData.expiryYear),
      });
      toast.success("Payment method saved successfully");
      setAddingNew(false);
      setFormData({
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        cardholderName: "",
      });
      loadPaymentMethods();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save payment method");
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s+/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.slice(0, 19);
  };

  const getCardBrandIcon = (brand) => {
    switch (brand) {
      case "Visa":
        return "💳";
      case "Mastercard":
        return "💳";
      case "American Express":
        return "💳";
      default:
        return "💳";
    }
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading dark:text-background mb-2">
            Payment Methods
          </h1>
          <p className="text-paragraph dark:text-paragraph">
            Manage your saved payment methods for faster checkout
          </p>
        </div>

        {/* Add New Form */}
        {addingNew && (
          <div className="bg-white dark:bg-background/10 rounded-xl p-6 mb-6 border border-gray-200 dark:border-0">
            <h2 className="text-xl font-bold text-heading dark:text-background mb-4">
              Add New Payment Method
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-background mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cardNumber: formatCardNumber(e.target.value),
                    })
                  }
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-background mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={formData.cardholderName}
                  onChange={(e) =>
                    setFormData({ ...formData, cardholderName: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-background mb-2">
                    Month
                  </label>
                  <input
                    type="number"
                    value={formData.expiryMonth}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryMonth: e.target.value })
                    }
                    placeholder="MM"
                    min="1"
                    max="12"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-background mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    value={formData.expiryYear}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryYear: e.target.value })
                    }
                    placeholder="YY"
                    min={new Date().getFullYear() % 100}
                    max="99"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-background mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) =>
                      setFormData({ ...formData, cvv: e.target.value })
                    }
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary dark:to-heading text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  Save Payment Method
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingNew(false);
                    setFormData({
                      cardNumber: "",
                      expiryMonth: "",
                      expiryYear: "",
                      cvv: "",
                      cardholderName: "",
                    });
                  }}
                  className="px-4 py-3 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background rounded-lg hover:bg-gray-50 dark:hover:bg-background/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Methods List */}
        {!addingNew && (
          <button
            onClick={() => setAddingNew(true)}
            className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 dark:border-background/30 rounded-xl hover:border-primary dark:hover:border-primary-dark hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 text-gray-600 dark:text-paragraph hover:text-primary dark:hover:text-primary-dark"
          >
            <Plus className="w-5 h-5" />
            Add New Payment Method
          </button>
        )}

        {paymentMethods.length === 0 ? (
          <div className="bg-white dark:bg-background/10 rounded-xl p-12 text-center border border-gray-200 dark:border-0">
            <CreditCard className="w-16 h-16 text-gray-400 dark:text-paragraph mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-background mb-2">
              No Payment Methods
            </h3>
            <p className="text-gray-500 dark:text-paragraph mb-4">
              You haven't saved any payment methods yet.
            </p>
            <button
              onClick={() => setAddingNew(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary dark:to-heading text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Add Payment Method
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method._id}
                className="bg-white dark:bg-background/10 rounded-xl p-6 border border-gray-200 dark:border-0 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary dark:to-heading rounded-lg flex items-center justify-center text-white text-xl">
                      {getCardBrandIcon(method.brand)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-background">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-paragraph">
                        Expires {String(method.expiryMonth).padStart(2, "0")}/
                        {String(method.expiryYear).slice(-2)}
                      </p>
                      {method.isDefault && (
                        <span className="inline-block mt-1 text-xs text-primary dark:text-primary-dark font-medium">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(method._id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-semibold mb-1">Secure Payment Storage</p>
            <p>
              Your payment information is encrypted and stored securely. We
              never store your full card details or CVV.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

