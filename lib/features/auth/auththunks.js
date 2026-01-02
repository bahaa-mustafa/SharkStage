import api from "@/lib/axios";
import {
  setUser,
  updateUser,
  clearUser,
  setLoading,
  setError,
} from "./authSlice";

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.post("/auth/signup", userData);
    dispatch(setUser(data.user));
  } catch (err) {
    const message = err.response?.data?.message || "Network error";
    dispatch(setError(message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(setError(null));
    dispatch(setLoading(true));
    const { data } = await api.post("/auth/signin", credentials);
    dispatch(setUser(data.user));
  } catch (err) {
    const message = err.response?.data?.message || "Network error";
    dispatch(setError(message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const authenticateWithGoogle =
  ({ code, accountType, intent }) =>
  async (dispatch) => {
    try {
      dispatch(setError(null));
      dispatch(setLoading(true));

      const payload = {
        code,
        intent,
        ...(accountType ? { accountType } : {}),
      };

      const { data } = await api.post("/auth/google", payload);

      dispatch(setUser(data.user));
      return { ok: true, data };
    } catch (err) {
      const message =
        err.response?.data?.message || "Google authentication failed";
      dispatch(setError(message));
      return { ok: false, data: { message } };
    } finally {
      dispatch(setLoading(false));
    }
  };

export const logoutUser = () => async (dispatch) => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error("Logout failed:", err);
  }
  dispatch(clearUser());
};

export const checkAuth = () => async (dispatch) => {
  try {
    const { data } = await api.get("/auth/me");
    dispatch(setUser(data.user));
  } catch (err) {
    dispatch(clearUser());
  }
};

export const uploadProfilePicture = (file) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const formData = new FormData();
    formData.append("profilePicUrl", file);

    const { data } = await api.post("/auth/upload-profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Update Redux state with new profile picture
    dispatch(updateUser({ profilePicUrl: data.imageUrl }));

    return data;
  } catch (err) {
    const message = err.response?.data?.error || "Failed to upload image";
    dispatch(setError(message));
    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};

export const removeProfilePicture = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const { data } = await api.delete("/auth/remove-profile-picture");

    dispatch(updateUser({ profilePicUrl: null }));

    return data;
  } catch (err) {
    const message = err.response?.data?.error || "Failed to remove image";
    dispatch(setError(message));
    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};
