import React from "react";
import { useAuth } from "@/context/AuthContext";
import { FiUsers, FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const useDashboard = () => {
  const router = useRouter();
  const { user, token } = useAuth();
  const [orders, setOrders] = useState(0);
  useState(() => {
    if (user?.role == "member") {
      router.push("/restaurants");
    }
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        // Filter restaurants by user's country if not admin
        const allOrders = res.data?.length || 0;
        setOrders(allOrders);
      } catch (err: any) {}
    };

    if (token) {
      fetchOrders();
    }
  }, [token, user]);

  // Stats based on user role and country
  const getStats = () => {
    if (!user) return [];

    // Base stats for all roles
    const stats = [
      {
        name: "Restaurants",
        icon: <FiShoppingBag className="w-6 h-6 text-blue-500" />,
        value: user.role === "admin" ? "4" : "2",
        description:
          user.role === "admin"
            ? "All restaurants"
            : `Restaurants in ${user.country}`,
      },
      {
        name: "Food Items",
        icon: <FiShoppingCart className="w-6 h-6 text-green-500" />,
        value: user.role === "admin" ? "8" : "4",
        description:
          user.role === "admin"
            ? "All food items"
            : `Food items in ${user.country}`,
      },
    ];

    // Add users stat for admin
    if (user.role === "admin") {
      stats.unshift({
        name: "Users",
        icon: <FiUsers className="w-6 h-6 text-purple-500" />,
        value: "6",
        description: "Total system users",
      });
    }

    // Add orders stats for admin and manager
    if (user.role === "admin" || user.role === "manager") {
      stats.push({
        name: "Orders",
        icon: <FiShoppingCart className="w-6 h-6 text-orange-500" />,
        value: user.role === "admin" ? orders : "1",
        description:
          user.role === "admin" ? "All orders" : `Orders in ${user.country}`,
      });
    }

    return stats;
  };
  return { user, getStats };
};

export default useDashboard;
