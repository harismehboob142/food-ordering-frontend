"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { FiUsers, FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
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

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto bg-background text-foreground">
          <h1 className="mb-6 text-2xl text-foreground font-bold ">
            Dashboard
          </h1>

          {/* Welcome message */}
          <div className="p-6 mb-6 rounded-lg shadow-sm dark:shadow-gray-200 bg-background text-foreground ">
            <h2 className="text-xl  font-semibold text-foreground">
              Welcome, {user?.username}!
            </h2>
            <p className="mt-2 text-gray-600">
              {user?.role === "admin" &&
                "You have full access to the system across all countries."}
              {user?.role === "manager" &&
                `You can manage restaurants, food items, and orders in ${user.country}.`}
              {user?.role === "member" &&
                `You can view restaurants and create food items in ${user.country}.`}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {getStats().map((stat) => (
              <div
                key={stat.name}
                className="p-6 bg-background text-foreground

                shadow-sm dark:shadow-gray-200 rounded"
              >
                <div className="flex items-center">
                  <div className="p-3 mr-4 rounded-full bg-gray-50">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-semibold text-gray-500">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Role-based access information */}
          <div className="p-6 mt-6 rounded-lg shadow-sm dark:shadow-gray-200 bg-background text-foreground">
            <h2 className="mb-4 text-lg font-semibold bg-background text-foreground">
              Your Access Permissions
            </h2>
            <div className="overflow-hiddenshadow sm:rounded-lg bg-background text-foreground">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-base font-semibold leading-6 text-foreground">
                  Role:{" "}
                  {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                </h3>
                {user?.country && (
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Country: {user.country}
                  </p>
                )}
              </div>
              <div className="border-t border-gray-200 bg-background text-foreground">
                <dl>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-background text-foreground">
                    <dt className="text-sm font-medium text-gray-500">
                      View Restaurants & Menu
                    </dt>
                    <dd className="mt-1 text-sm text-green-600 sm:col-span-2 sm:mt-0">
                      ✓ Allowed
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-background text-foreground  sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Create Food Items
                    </dt>
                    <dd className="mt-1 text-sm text-green-600 sm:col-span-2 sm:mt-0">
                      ✓ Allowed
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-background text-foreground grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Place Orders
                    </dt>
                    <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                      {user?.role === "admin" || user?.role === "manager" ? (
                        <span className="text-green-600">✓ Allowed</span>
                      ) : (
                        <span className="text-red-600">✗ Not Allowed</span>
                      )}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-background text-foreground  sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Cancel Orders
                    </dt>
                    <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                      {user?.role === "admin" || user?.role === "manager" ? (
                        <span className="text-green-600">✓ Allowed</span>
                      ) : (
                        <span className="text-red-600">✗ Not Allowed</span>
                      )}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-background text-foreground grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Update Payment Method
                    </dt>
                    <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                      {user?.role === "admin" ? (
                        <span className="text-green-600">✓ Allowed</span>
                      ) : (
                        <span className="text-red-600">✗ Not Allowed</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
