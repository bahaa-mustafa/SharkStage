import api from "../axios";

export const getAdminDashboard = async () => {
  try {
    const response = await api.get("/dashboard/admin");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get("/admin/users", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllProjects = async (params = {}) => {
  try {
    const response = await api.get("/admin/projects", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBlogs = async (params = {}) => {
  try {
    const response = await api.get("/admin/blogs", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllFAQs = async (params = {}) => {
  try {
    const response = await api.get("/admin/faqs", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId, data) => {
  try {
    const response = await api.patch(`/admin/users/${userId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const banUser = async (userId) => {
  try {
    const response = await api.get(`/admin/ban/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unbanUser = async (userId) => {
  try {
    const response = await api.get(`/admin/unban/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/admin/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

