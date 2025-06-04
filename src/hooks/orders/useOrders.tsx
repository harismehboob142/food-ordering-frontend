import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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

const useOrders = () => {
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

  return {
    user,
    error,
    orders,
    router,
    loading,
    canCancelOrder,
    getStatusColor,
    canCreateOrder,
    canUpdatePayment,
    handleCancelOrder,
  };
};

export default useOrders;
