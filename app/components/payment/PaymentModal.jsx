"use client";
import { useState, useEffect } from "react";
import { X, CreditCard, Info, AlertCircle } from "lucide-react";
import PaymentForm from "./PaymentForm";
import PaymentMethodSelector from "./PaymentMethodSelector";
import PaymentStatus from "./PaymentStatus";
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentMethods,
} from "@/lib/api/payment.api";
import toast from "react-hot-toast";

export default function PaymentModal({
  isOpen,
  onClose,
  project,
  amount,
  percentage,
  onSuccess,
}) {
  const [step, setStep] = useState("method"); // method, form, processing, success, error
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [transactionId, setTransactionId] = useState(null);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadPaymentMethods();
      createIntent();
    } else {
      // Reset state when modal closes
      setStep("method");
      setSelectedMethod(null);
      setPaymentIntent(null);
      setPaymentStatus("pending");
      setTransactionId(null);
      setError(null);
      setErrors({});
    }
  }, [isOpen]);

  const loadPaymentMethods = async () => {
    try {
      const response = await getPaymentMethods();
      setPaymentMethods(response.paymentMethods || []);
    } catch (error) {
      console.error("Error loading payment methods:", error);
    }
  };

  const createIntent = async () => {
    try {
      setLoading(true);
      const response = await createPaymentIntent(
        project._id,
        amount,
        percentage
      );
      setPaymentIntent(response);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      toast.error(error.response?.data?.message || "Failed to initialize payment");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setStep("form");
  };

  const handleAddNew = () => {
    setSelectedMethod(null);
    setStep("form");
  };

  const handlePaymentSubmit = async (paymentData) => {
    if (!paymentIntent) {
      toast.error("Payment intent not initialized");
      return;
    }

    setLoading(true);
    setError(null);
    setErrors({});
    setStep("processing");
    setPaymentStatus("processing");

    try {
      const paymentMethodData = selectedMethod
        ? {
            id: selectedMethod.providerPaymentMethodId,
            type: selectedMethod.type,
          }
        : {
            cardNumber: paymentData.cardNumber.replace(/\s+/g, ""),
            expiryMonth: parseInt(paymentData.expiryMonth),
            expiryYear: 2000 + parseInt(paymentData.expiryYear),
            cvv: paymentData.cvv,
            cardholderName: paymentData.cardholderName,
          };

      const response = await confirmPayment(
        paymentIntent.paymentIntentId,
        paymentMethodData,
        paymentData.savePaymentMethod && !selectedMethod
      );

      if (response.success) {
        setPaymentStatus("completed");
        setTransactionId(response.transactionId);
        setStep("success");
        toast.success("Payment confirmed successfully!");
        
        // Call success callback after a delay
        setTimeout(() => {
          if (onSuccess) onSuccess(response);
          onClose();
        }, 2000);
      } else {
        throw new Error(response.message || "Payment failed");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      setPaymentStatus("failed");
      setError(error.response?.data?.message || error.message || "Payment failed");
      setStep("error");
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-background-dark rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-0 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-background">Complete Payment</h2>
            <p className="text-sm text-gray-500 dark:text-paragraph mt-1">
              {project.title} - ${amount.toLocaleString()} ({percentage}%)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-background/60 hover:text-gray-600 dark:hover:text-background transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Investment Summary */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-900 dark:text-background">Investment Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-paragraph">Amount</p>
                <p className="font-bold text-gray-900 dark:text-background">${amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-paragraph">Percentage</p>
                <p className="font-bold text-gray-900 dark:text-background">{percentage}%</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-paragraph">Expected ROI</p>
                <p className="font-bold text-gray-900 dark:text-background">{project.expectedROI}%</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-paragraph">Project Value</p>
                <p className="font-bold text-gray-900 dark:text-background">
                  ${project.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Steps */}
          {step === "method" && paymentMethods.length > 0 && (
            <PaymentMethodSelector
              paymentMethods={paymentMethods}
              selectedMethod={selectedMethod}
              onSelectMethod={handleSelectMethod}
              onAddNew={handleAddNew}
            />
          )}

          {(step === "form" || (step === "method" && paymentMethods.length === 0)) && (
            <div>
              {paymentMethods.length > 0 && (
                <button
                  onClick={() => setStep("method")}
                  className="text-sm text-primary hover:underline mb-4 dark:text-primary-dark"
                >
                  ← Back to payment methods
                </button>
              )}
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                loading={loading}
                errors={errors}
              />
            </div>
          )}

          {step === "processing" && (
            <PaymentStatus
              status={paymentStatus}
              transactionId={transactionId}
              message={error}
            />
          )}

          {step === "success" && (
            <div className="space-y-4">
              <PaymentStatus
                status="completed"
                transactionId={transactionId}
              />
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-300">
                  Your investment has been confirmed! You will receive a confirmation email shortly.
                </p>
              </div>
            </div>
          )}

          {step === "error" && (
            <div className="space-y-4">
              <PaymentStatus status="failed" message={error} />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep("method");
                    setError(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-background/30 rounded-lg hover:bg-gray-50 dark:hover:bg-background/10 dark:text-background transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-900 dark:bg-primary text-white rounded-lg hover:bg-gray-800 dark:hover:bg-primary/80 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Test Cards Info */}
          {step === "form" && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-semibold mb-1">Test Cards (Mock Payment):</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Success: 4242 4242 4242 4242</li>
                    <li>Decline: 4000 0000 0000 0002</li>
                    <li>3D Secure: 4000 0025 0000 3155</li>
                    <li>Insufficient Funds: 4000 0000 0000 9995</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

