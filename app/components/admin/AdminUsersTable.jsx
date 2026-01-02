"use client";
import { useState, useEffect } from "react";
import { Search, Ban, CheckCircle, UserCog, RefreshCw } from "lucide-react";
import { getAllUsers, banUser, unbanUser, updateUser } from "@/lib/api/admin.api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminUsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("");
  const [bannedFilter, setBannedFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers({
        page,
        limit: 20,
        search: searchQuery,
        accountType: accountTypeFilter || undefined,
        banned: bannedFilter || undefined,
        sortBy: "newest",
      });

      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery, accountTypeFilter, bannedFilter]);

  const handleBan = async (userId) => {
    if (!confirm("Are you sure you want to ban this user?")) return;
    try {
      await banUser(userId);
      toast.success("User banned successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to ban user");
    }
  };

  const handleUnban = async (userId) => {
    if (!confirm("Are you sure you want to unban this user?")) return;
    try {
      await unbanUser(userId);
      toast.success("User unbanned successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to unban user");
    }
  };

  const handleChangeAccountType = async (userId, newType) => {
    if (!confirm(`Are you sure you want to change this user's account type to ${newType}?`)) return;
    try {
      await updateUser(userId, { accountType: newType });
      toast.success("Account type updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update account type");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#0f3460]/30">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">Users Management</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a]/50 border border-[#0f3460]/30 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent"
            />
          </div>
          <select
            value={accountTypeFilter}
            onChange={(e) => {
              setAccountTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 bg-[#0f172a]/50 border border-[#0f3460]/30 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent"
          >
            <option value="">All Account Types</option>
            <option value="investor">Investor</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={bannedFilter}
            onChange={(e) => {
              setBannedFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 bg-[#0f172a]/50 border border-[#0f3460]/30 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="false">Active</option>
            <option value="true">Banned</option>
          </select>
          <button
            onClick={fetchUsers}
            className="px-4 py-2.5 bg-gradient-to-r from-[#0f3460] to-[#16213e] text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 border border-[#0f3460]/50"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f3460] mx-auto"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#0f3460]/30">
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-[#0f3460]/20 hover:bg-[#0f172a]/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {user.profilePicUrl ? (
                          <img
                            src={user.profilePicUrl}
                            alt={user.firstName}
                            className="w-10 h-10 rounded-full border-2 border-[#0f3460]/30"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0f3460] to-[#16213e] flex items-center justify-center border-2 border-[#0f3460]/30">
                            <span className="text-gray-300 font-bold text-sm">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-200 font-semibold">{user.firstName} {user.lastName}</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-300">{user.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={user.accountType}
                        onChange={(e) => handleChangeAccountType(user._id, e.target.value)}
                        className="px-3 py-1.5 bg-[#0f172a]/50 border border-[#0f3460]/30 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                      >
                        <option value="investor">Investor</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      {user.banned ? (
                        <span className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-sm font-bold border border-red-600/30">
                          Banned
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-lg text-sm font-bold border border-green-600/30">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {user.banned ? (
                          <button
                            onClick={() => handleUnban(user._id)}
                            className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all border border-green-600/30"
                            title="Unban"
                          >
                            <CheckCircle size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBan(user._id)}
                            className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all border border-red-600/30"
                            title="Ban"
                          >
                            <Ban size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-gray-400 text-sm">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-[#0f172a]/50 border border-[#0f3460]/30 rounded-lg text-gray-300 hover:bg-[#0f3460]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 bg-[#0f172a]/50 border border-[#0f3460]/30 rounded-lg text-gray-300 hover:bg-[#0f3460]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

