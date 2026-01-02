"use client";
import { useState } from "react";
import { CreditCard, Plus, Check } from "lucide-react";

export default function PaymentMethodSelector({
  paymentMethods = [],
  selectedMethod,
  onSelectMethod,
  onAddNew,
}) {
  const [isAddingNew, setIsAddingNew] = useState(!selectedMethod && paymentMethods.length === 0);

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

  const formatExpiry = (month, year) => {
    return `${String(month).padStart(2, "0")}/${String(year).slice(-2)}`;
  };

  if (isAddingNew) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-background">Payment Method</h3>
          {paymentMethods.length > 0 && (
            <button
              onClick={() => setIsAddingNew(false)}
              className="text-sm text-primary dark:text-primary-dark hover:underline"
            >
              Use saved method
            </button>
          )}
        </div>
        <div className="p-4 border-2 border-dashed border-primary dark:border-primary-dark rounded-lg bg-primary/5 dark:bg-primary/10">
          <p className="text-sm text-gray-600 dark:text-paragraph mb-2">Add a new payment method</p>
          <button
            onClick={onAddNew}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-primary dark:border-primary-dark text-primary dark:text-primary-dark rounded-lg hover:bg-primary hover:text-white dark:hover:bg-primary-dark dark:hover:text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Card
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-background">Payment Method</h3>
        <button
          onClick={() => setIsAddingNew(true)}
          className="text-sm text-primary dark:text-primary-dark hover:underline flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {/* Saved Payment Methods */}
      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <button
            key={method._id}
            onClick={() => onSelectMethod(method)}
            className={`w-full p-4 border-2 rounded-lg transition-all text-left dark:bg-background/10 ${
              selectedMethod?._id === method._id
                ? "border-primary dark:border-primary-dark bg-primary/5 dark:bg-primary/10"
                : "border-gray-200 dark:border-0 hover:border-gray-300 dark:hover:bg-background/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary dark:to-heading rounded-lg flex items-center justify-center text-white text-lg">
                  {getCardBrandIcon(method.brand)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-background">
                    {method.brand} •••• {method.last4}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-paragraph">
                    Expires {formatExpiry(method.expiryMonth, method.expiryYear)}
                  </p>
                </div>
              </div>
              {selectedMethod?._id === method._id && (
                <div className="w-6 h-6 bg-primary dark:bg-primary-dark rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            {method.isDefault && (
              <span className="inline-block mt-2 text-xs text-primary dark:text-primary-dark font-medium">
                Default
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Add New Button */}
      <button
        onClick={() => {
          setIsAddingNew(true);
          onAddNew();
        }}
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-background/30 rounded-lg hover:border-primary dark:hover:border-primary-dark hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 text-gray-600 dark:text-paragraph hover:text-primary dark:hover:text-primary-dark"
      >
        <Plus className="w-5 h-5" />
        Add New Payment Method
      </button>
    </div>
  );
}

