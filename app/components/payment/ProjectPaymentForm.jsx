"use client";
import { useState } from "react";
import { CreditCard, Lock, AlertCircle, ArrowLeft } from "lucide-react";

export default function ProjectPaymentForm({
  onSubmit,
  onBack,
  loading,
  errors,
  projectData,
}) {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
  });

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s+/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.slice(0, 19); // Max 19 chars (16 digits + 3 spaces)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      setFormData((prev) => ({
        ...prev,
        [name]: formatCardNumber(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getCardBrand = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s+/g, "");
    if (/^4/.test(cleaned)) return "Visa";
    if (/^5[1-5]/.test(cleaned)) return "Mastercard";
    if (/^3[47]/.test(cleaned)) return "American Express";
    if (/^6(?:011|5)/.test(cleaned)) return "Discover";
    return "Card";
  };

  // Calculate payment amount (mock fee for project listing)
  const listingFee = 50; // Fixed fee for demonstration

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-paragraph hover:text-primary dark:hover:text-primary-dark transition mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Project Form</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-heading dark:text-background mb-2">
            Complete Payment
          </h1>
          <p className="text-paragraph dark:text-paragraph">
            Enter your payment details to publish your project
          </p>
        </div>

        {/* Payment Summary */}
        {projectData && (
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-lg p-6 mb-6 border border-primary/20 dark:border-primary/30">
            <h3 className="font-semibold text-heading dark:text-background mb-4">Project Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-paragraph dark:text-paragraph">Project Title:</span>
                <span className="font-medium text-heading dark:text-background">
                  {projectData.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-paragraph dark:text-paragraph">Listing Fee:</span>
                <span className="font-bold text-primary dark:text-primary-dark text-lg">
                  ${listingFee.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Form */}
        <div className="bg-white dark:bg-background/10 rounded-lg shadow-md dark:shadow-none p-6 border border-gray-200 dark:border-0">
          {/* Mock Payment Notice */}
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-300">
                <p className="font-semibold mb-1">Mock Payment (Demo Only)</p>
                <p>
                  This is a demonstration payment form. You can enter any dummy
                  data. No actual payment will be processed.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-background mb-2">
                Card Number <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 dark:text-background dark:bg-background/10 dark:border-0 dark:placeholder-background/30 placeholder:text-gray-400 ${
                    errors?.cardNumber ? "border-red-500 dark:border-red-500" : "border-gray-300"
                  }`}
                  required
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CreditCard className="w-5 h-5 text-gray-400 dark:text-background/50" />
                </div>
              </div>
              {formData.cardNumber && (
                <p className="text-xs text-gray-500 dark:text-paragraph mt-1">
                  {getCardBrand(formData.cardNumber)}
                </p>
              )}
              {errors?.cardNumber && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cardNumber}
                </p>
              )}
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-background mb-2">
                Cardholder Name <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 dark:text-background dark:bg-background/10 dark:border-0 dark:placeholder-background/30 placeholder:text-gray-400 ${
                  errors?.cardholderName ? "border-red-500 dark:border-red-500" : "border-gray-300"
                }`}
                required
                disabled={loading}
              />
              {errors?.cardholderName && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cardholderName}
                </p>
              )}
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-background mb-2">
                  Expiry Date <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={handleChange}
                    placeholder="MM"
                    min="1"
                    max="12"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 dark:text-background dark:bg-background/10 dark:border-0 dark:placeholder-background/30 placeholder:text-gray-400 ${
                      errors?.expiryMonth ? "border-red-500 dark:border-red-500" : "border-gray-300"
                    }`}
                    required
                    disabled={loading}
                  />
                  <input
                    type="number"
                    name="expiryYear"
                    value={formData.expiryYear}
                    onChange={handleChange}
                    placeholder="YY"
                    min={new Date().getFullYear() % 100}
                    max={99}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 dark:text-background dark:bg-background/10 dark:border-0 dark:placeholder-background/30 placeholder:text-gray-400 ${
                      errors?.expiryYear ? "border-red-500 dark:border-red-500" : "border-gray-300"
                    }`}
                    required
                    disabled={loading}
                  />
                </div>
                {(errors?.expiryMonth || errors?.expiryYear) && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.expiryMonth || errors.expiryYear}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-background mb-2">
                  CVV <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 dark:text-background dark:bg-background/10 dark:border-0 dark:placeholder-background/30 placeholder:text-gray-400 ${
                    errors?.cvv ? "border-red-500 dark:border-red-500" : "border-gray-300"
                  }`}
                  required
                  disabled={loading}
                />
                {errors?.cvv && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.cvv}
                  </p>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
              <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                This is a mock payment form for demonstration purposes only. No
                actual payment will be processed.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Payment & Creating Project...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Pay & Create Project
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

