"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

// Types
type Order = {
  _id: string;
  user: {
    _id: string;
    username: string;
    role: string;
    country?: string;
  };
  items: {
    foodItem: {
      _id: string;
      name: string;
      price: number;
      restaurant: {
        _id: string;
        name: string;
        country: string;
      };
    };
    quantity: number;
  }[];
  totalAmount: number;
  status: "pending_payment" | "paid" | "cancelled" | "delivered";
  paymentMethod: string;
  country: string;
  createdAt: string;
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setOrders(res.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch orders");
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Check if user can create orders (admin and manager)
  const canCreateOrder = user?.role === "admin" || user?.role === "manager";

  // Check if user can cancel orders (admin and manager)
  const canCancelOrder = user?.role === "admin" || user?.role === "manager";

  // Check if user can update payment method (admin only)
  const canUpdatePayment = user?.role === "admin";

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      // Update orders list
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel order");
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "bg-yellow-500";
      case "paid":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "delivered":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "member"]}>
      <MainLayout>
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Orders</h1>
            {canCreateOrder && (
              <button
                onClick={() => router.push("/orders/create")}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FiPlus className="inline mr-2" />
                Create Order
              </button>
            )}
          </div>

          {/* Country filter info */}
          {user?.role !== "admin" && user?.country && (
            <div className="p-4 mb-6 text-sm text-blue-700 bg-blue-100 rounded-md">
              Showing orders in {user.country} only
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading orders...</div>
            </div>
          ) : (
            <>
              {/* Orders list */}
              {orders.length === 0 ? (
                <div className="p-6 text-center bg-white rounded-lg shadow-md">
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <div className="overflow-hidden bg-background text-foreground sm:rounded-lg  shadow-sm dark:shadow-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 bg-background text-foreground">
                    <thead className=" bg-background text-foreground">
                      <tr>
                        <th
                          scope="col"
                          className="bg-background text-foreground px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        >
                          Order ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium bg-background text-foreground uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium bg-background text-foreground uppercase tracking-wider"
                        >
                          Items
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium bg-background text-foreground uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium bg-background text-foreground uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium bg-background text-foreground uppercase tracking-wider"
                        >
                          Country
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium bg-background text-foreground uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className=" divide-y divide-gray-200 bg-background text-foreground">
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap bg-background text-foreground">
                            <div className="text-sm bg-background text-foreground">
                              {order._id.substring(0, 8)}...
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium bg-background text-foreground">
                              {order.user.username}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.user.role}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm bg-background text-foreground">
                              {order.items.length} items
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.items.map((item) => (
                                <div key={item.foodItem._id}>
                                  {item.quantity}x {item.foodItem.name}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium bg-background text-foreground">
                              ${order.totalAmount.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.paymentMethod}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm bg-background text-foreground">
                              {order.country}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              {canCancelOrder &&
                                order.status !== "cancelled" &&
                                order.status !== "delivered" && (
                                  <button
                                    onClick={() => handleCancelOrder(order._id)}
                                    className="flex items-center px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                                  >
                                    <FiX className="mr-1" /> Cancel
                                  </button>
                                )}
                              {canUpdatePayment && (
                                <button className="flex items-center px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                                  <FiEdit2 className="mr-1" /> Payment
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
      </MainLayout>
    </ProtectedRoute>
  );
}
