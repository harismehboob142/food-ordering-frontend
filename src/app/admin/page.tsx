"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { FiPlus, FiEdit2, FiTrash2, FiUser } from "react-icons/fi";

// Types
type User = {
  _id: string;
  username: string;
  role: "admin" | "manager" | "member";
  country?: "India" | "America";
  createdAt: string;
};

export default function AdminPage() {
  const { user: currentUser, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setUsers(res.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch users");
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <MainLayout>
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <FiPlus className="inline mr-2" />
              Add User
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          {/* Users management section */}
          <div className="mb-8 ">
            <h2 className="mb-4 text-xl font-semibold">User Management</h2>

            {/* Loading state */}
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-500">Loading users...</div>
              </div>
            ) : (
              <>
                {/* Users table */}
                {users.length === 0 ? (
                  <div className="p-6 text-center bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">No users found</p>
                  </div>
                ) : (
                  <div className="overflow-hidden bg-background text-foreground shadow sm:rounded-lg shadow dark:shadow-gray-500">
                    <table className="min-w-full divide-y divide-gray-200 bg-background text-foreground">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium bg-background text-foreground uppercase tracking-wider"
                          >
                            Username
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium bg-background text-foreground uppercase tracking-wider"
                          >
                            Role
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium bg-background text-foreground uppercase tracking-wider"
                          >
                            Country
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium bg-background text-foreground uppercase tracking-wider"
                          >
                            Created At
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium bg-background text-foreground uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-background text-foreground divide-y divide-gray-200 ">
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <FiUser className="h-5 w-5 text-gray-500" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium bg-background text-foreground">
                                    {user.username}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {user._id.substring(0, 8)}...
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium text-white rounded-full ${
                                  user.role === "admin"
                                    ? "bg-purple-500"
                                    : user.role === "manager"
                                    ? "bg-blue-500"
                                    : "bg-green-500"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm bg-background text-foreground">
                                {user.country || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm bg-background text-foreground">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button className="flex items-center px-3 py-1 text-sm text-yellow-600 border border-yellow-600 rounded-md hover:bg-yellow-50">
                                  <FiEdit2 className="mr-1" /> Edit
                                </button>
                                {user._id !== currentUser?.id && (
                                  <button className="flex items-center px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50">
                                    <FiTrash2 className="mr-1" /> Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Payment Settings Section */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Payment Settings</h2>
            <div className="p-6 bg-background text-foreground rounded-lg shadow-md">
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground">
                  Default Payment Method
                </label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border  border-gray-500 focus:outline-none text-foreground focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option
                    value="credit_card "
                    className="text-foreground bg-background"
                  >
                    Credit Card
                  </option>
                  <option
                    value="paypal"
                    className="text-foreground bg-background"
                  >
                    PayPal
                  </option>
                  <option
                    value="bank_transfer"
                    className="text-foreground bg-background"
                  >
                    Bank Transfer
                  </option>
                  <option
                    value="cash"
                    className="text-foreground bg-background"
                  >
                    Cash
                  </option>
                </select>
              </div>

              <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
