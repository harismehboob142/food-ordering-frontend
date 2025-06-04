"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { FiPlus, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Types
type Restaurant = {
  _id: string;
  name: string;
  address: string;
  country: string;
  menu: string[];
};

export default function RestaurantsPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/restaurants`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setRestaurants(res.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch restaurants");
        setLoading(false);
      }
    };

    if (token) {
      fetchRestaurants();
    }
  }, [token]);

  // Check if user can create restaurants (admin only)
  const canCreateRestaurant = user?.role === "admin";

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Restaurants</h1>
            {canCreateRestaurant && (
              <button
                onClick={() => {
                  router.push("/restaurants/create");
                }}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FiPlus className="inline mr-2" />
                Add Restaurant
              </button>
            )}
          </div>

          {/* Country filter info */}
          {user?.role !== "admin" && user?.country && (
            <div className="p-4 mb-6 text-sm text-blue-700 bg-blue-100 rounded-md">
              Showing restaurants in {user.country} only
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
              <div className="text-gray-500">Loading restaurants...</div>
            </div>
          ) : (
            <>
              {/* Restaurants grid */}
              {restaurants.length === 0 ? (
                <div className="p-6 text-center bg-white rounded-lg shadow-md">
                  <p className="text-gray-500">No restaurants found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {restaurants.map((restaurant) => (
                    <div
                      key={restaurant._id}
                      className="overflow-hidden text-foreground bg-background dark:shadow-gray-200 rounded-lg shadow-sm"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-semibold text-gray-500">
                            {restaurant.name}
                          </h2>
                          <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">
                            {restaurant.country}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600">
                          {restaurant.address}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          {restaurant.menu.length} menu items
                        </p>

                        {/* Action buttons */}
                        <div className="flex mt-4 space-x-2">
                          <Link
                            href={`/restaurants/${restaurant._id}`}
                            className="flex items-center px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                          >
                            <FiEye className="mr-1" /> View Menu
                          </Link>

                          {user?.role === "admin" && (
                            <>
                              <button className="flex items-center px-3 py-1 text-sm text-yellow-600 border border-yellow-600 rounded-md hover:bg-yellow-50">
                                <FiEdit2 className="mr-1" /> Edit
                              </button>
                              <button className="flex items-center px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50">
                                <FiTrash2 className="mr-1" /> Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
