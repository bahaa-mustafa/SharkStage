import api from "../axios";

/**
 * Create a payment intent for an investment
 * @param {string} projectId - Project ID
 * @param {number} amount - Investment amount
 * @param {number} percentage - Investment percentage
 * @returns {Promise} Payment intent data
 */
export const createPaymentIntent = async (projectId, amount, percentage) => {
  try {
    const response = await api.post("/payment/intent", {
      projectId,
      amount,
      percentage,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

/**
 * Confirm a payment
 * @param {string} paymentIntentId - Payment intent ID
 * @param {object} paymentMethod - Payment method data
 * @param {boolean} savePaymentMethod - Whether to save payment method
 * @returns {Promise} Payment confirmation result
 */
export const confirmPayment = async (paymentIntentId, paymentMethod, savePaymentMethod = false) => {
  try {
    const response = await api.post("/payment/confirm", {
      paymentIntentId,
      paymentMethod,
      savePaymentMethod,
    });
    return response.data;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};

/**
 * Get payment status
 * @param {string} transactionId - Transaction ID
 * @returns {Promise} Payment status data
 */
export const getPaymentStatus = async (transactionId) => {
  try {
    const response = await api.get(`/payment/status/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting payment status:", error);
    throw error;
  }
};

/**
 * Refund a payment
 * @param {string} transactionId - Transaction ID
 * @param {number} amount - Refund amount (optional, full refund if not provided)
 * @returns {Promise} Refund result
 */
export const refundPayment = async (transactionId, amount = null) => {
  try {
    const response = await api.post("/payment/refund", {
      transactionId,
      amount,
    });
    return response.data;
  } catch (error) {
    console.error("Error refunding payment:", error);
    throw error;
  }
};

/**
 * Save a payment method for future use
 * @param {object} methodData - Payment method data
 * @returns {Promise} Saved payment method data
 */
export const savePaymentMethod = async (methodData) => {
  try {
    const response = await api.post("/payment/methods", methodData);
    return response.data;
  } catch (error) {
    console.error("Error saving payment method:", error);
    throw error;
  }
};

/**
 * Get all saved payment methods
 * @returns {Promise} List of payment methods
 */
export const getPaymentMethods = async () => {
  try {
    const response = await api.get("/payment/methods");
    return response.data;
  } catch (error) {
    console.error("Error getting payment methods:", error);
    throw error;
  }
};

/**
 * Delete a payment method
 * @param {string} methodId - Payment method ID
 * @returns {Promise} Deletion result
 */
export const deletePaymentMethod = async (methodId) => {
  try {
    const response = await api.delete(`/payment/methods/${methodId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting payment method:", error);
    throw error;
  }
};

