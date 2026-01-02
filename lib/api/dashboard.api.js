import api from "../axios";

/**
 * Get investor dashboard data
 * @returns {Promise} Dashboard data for investor
 */
export const getInvestorDashboard = async () => {
  try {
    const response = await api.get("/dashboard/investor");
    return response.data;
  } catch (error) {
    console.error("Error fetching investor dashboard:", error);
    throw error;
  }
};

/**
 * Get owner dashboard data
 * @returns {Promise} Dashboard data for project owner
 */
export const getOwnerDashboard = async () => {
  try {
    const response = await api.get("/dashboard/owner");
    return response.data;
  } catch (error) {
    console.error("Error fetching owner dashboard:", error);
    throw error;
  }
};

