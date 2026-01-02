"use client";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  uploadProfilePicture,
  removeProfilePicture,
} from "@/lib/features/auth/auththunks";
import { updateUser } from "@/lib/features/auth/authSlice";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Edit2, Save, X, User, Mail, Shield, Key, Camera, Trash2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser, loading } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
      });
    }
  }, [currentUser]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      await dispatch(uploadProfilePicture(file));
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error("Failed to upload profile picture");
    }
  };

  const handleRemove = async () => {
    if (!currentUser?.profilePicUrl) return;

    if (!confirm("Are you sure you want to remove your profile picture?")) {
      return;
    }

    try {
      await dispatch(removeProfilePicture());
      toast.success("Profile picture removed successfully!");
    } catch (error) {
      toast.error("Failed to remove profile picture");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
    });
  };

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    if (formData.firstName.length < 2 || formData.lastName.length < 2) {
      toast.error("First and last name must be at least 2 characters");
      return;
    }

    try {
      setEditLoading(true);
      const response = await api.patch("/auth/profile", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      });

      if (response.data.success) {
        dispatch(updateUser(response.data.user));
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

  const handleResetPassword = () => {
    router.push("/account/changepassword");
  };

  return (
    <div className="p-4 sm:p-6 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-background-dark dark:via-background-dark dark:to-background-dark">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3a5a92] via-[#6fa8dc] to-[#8b5cf6] p-8 mb-8 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                {currentUser?.profilePicUrl ? (
                  <img
                    src={currentUser.profilePicUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-white text-4xl font-bold">
                    {currentUser?.firstName?.charAt(0) || "U"}
                    {currentUser?.lastName?.charAt(0) || ""}
                  </div>
                )}
              </div>
              {loading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <Sparkles className="text-yellow-300" size={24} />
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  {currentUser?.firstName} {currentUser?.lastName}
                </h1>
              </div>
              <p className="text-white/90 text-lg mb-1">{currentUser?.email}</p>
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold capitalize mt-2">
                {currentUser?.accountType}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 dark:bg-background/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-0">
              <h2 className="text-xl font-bold text-gray-800 dark:text-background mb-4 flex items-center gap-2">
                <Camera className="text-[#3a5a92] dark:text-primary-dark" size={20} />
                Profile Picture
              </h2>
              
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-gradient-to-br from-[#3a5a92] to-[#6fa8dc] shadow-xl relative">
                    {currentUser?.profilePicUrl ? (
                      <img
                        src={currentUser.profilePicUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#3a5a92] to-[#6fa8dc] flex items-center justify-center text-white text-3xl font-bold">
                        {currentUser?.firstName?.charAt(0) || "U"}
                        {currentUser?.lastName?.charAt(0) || ""}
                      </div>
                    )}
                    {loading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUploadClick}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[#3a5a92] to-[#6fa8dc] text-white rounded-xl hover:shadow-xl transition-all font-semibold mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Camera size={18} />
                  {loading ? "Uploading..." : "Upload Photo"}
                </motion.button>

                {currentUser?.profilePicUrl && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRemove}
                    disabled={loading}
                    className="w-full py-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Remove
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Profile Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 dark:bg-background/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-0">
              <h2 className="text-xl font-bold text-gray-800 dark:text-background mb-6 flex items-center gap-2">
                <User className="text-[#3a5a92] dark:text-primary-dark" size={20} />
                Profile Information
              </h2>

              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-background mb-3 flex items-center gap-2">
                    <User className="text-[#3a5a92] dark:text-primary-dark" size={16} />
                    Full Name
                  </label>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          className="flex-1 px-4 py-3 bg-white/80 dark:bg-background/10 dark:text-background border-2 border-gray-200 dark:border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3a5a92] dark:focus:ring-primary-dark focus:border-transparent transition-all"
                          placeholder="First Name"
                          disabled={editLoading}
                        />
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          className="flex-1 px-4 py-3 bg-white/80 dark:bg-background/10 dark:text-background border-2 border-gray-200 dark:border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3a5a92] dark:focus:ring-primary-dark focus:border-transparent transition-all"
                          placeholder="Last Name"
                          disabled={editLoading}
                        />
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={handleSave}
                          disabled={editLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#3a5a92] to-[#6fa8dc] text-white rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save size={18} />
                          {editLoading ? "Saving..." : "Save Changes"}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={handleCancel}
                          disabled={editLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-background/20 dark:text-background text-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-background/30 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X size={18} />
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#3a5a92]/5 to-[#6fa8dc]/5 dark:from-primary/20 dark:to-secondary/20 rounded-xl border border-[#3a5a92]/10 dark:border-primary/30">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-background">
                        {`${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`}
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={handleEdit}
                        className="p-2 text-[#3a5a92] hover:bg-[#3a5a92]/10 rounded-lg transition"
                        title="Edit name"
                      >
                        <Edit2 size={20} />
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-background mb-3 flex items-center gap-2">
                    <Mail className="text-[#3a5a92] dark:text-primary-dark" size={16} />
                    Email Address
                  </label>
                  <div className="p-4 bg-gradient-to-r from-[#3a5a92]/5 to-[#6fa8dc]/5 dark:from-primary/20 dark:to-secondary/20 rounded-xl border border-[#3a5a92]/10 dark:border-primary/30">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-background mb-1">{currentUser?.email}</h3>
                    <p className="text-xs text-gray-500 dark:text-paragraph">Email cannot be changed</p>
                  </div>
                </div>

                {/* Account Type Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-background mb-3 flex items-center gap-2">
                    <Shield className="text-[#3a5a92] dark:text-primary-dark" size={16} />
                    Account Type
                  </label>
                  <div className="p-4 bg-gradient-to-r from-[#3a5a92]/5 to-[#6fa8dc]/5 dark:from-primary/20 dark:to-secondary/20 rounded-xl border border-[#3a5a92]/10 dark:border-primary/30">
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#3a5a92] to-[#6fa8dc] text-white rounded-full text-sm font-bold capitalize shadow-lg">
                      {currentUser?.accountType}
                    </span>
                  </div>
                </div>

                {/* Reset Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-background mb-3 flex items-center gap-2">
                    <Key className="text-[#3a5a92] dark:text-primary-dark" size={16} />
                    Password
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleResetPassword}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#3a5a92]/10 to-[#6fa8dc]/10 text-[#3a5a92] rounded-xl hover:from-[#3a5a92]/20 hover:to-[#6fa8dc]/20 transition-all font-semibold border-2 border-[#3a5a92]/20 flex items-center justify-center gap-2"
                  >
                    <Key size={18} />
                    Reset Password
                  </motion.button>
                </div>

                {/* Deactivate Account */}
                <div className="pt-6 border-t border-gray-200 dark:border-background/30">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-semibold border-2 border-red-200 dark:border-red-800/30"
                    onClick={() => toast.error("This feature is not available yet")}
                  >
                    Deactivate Account
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
