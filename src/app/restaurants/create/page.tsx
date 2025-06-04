"use client";

import axios from "axios";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { FiShoppingBag, FiMapPin } from "react-icons/fi";

// Types
type CreateRestaurantFormInputs = {
  name: string;
  address: string;
  country: "India" | "America";
};

export default function CreateRestaurantPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRestaurantFormInputs>();

  // Handle form submission
  const onSubmit = async (data: CreateRestaurantFormInputs) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/restaurants`, data, {
        headers: {
          "x-auth-token": token,
        },
      });

      setSuccess("Restaurant created successfully!");
      reset(); // Reset form
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create restaurant");
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <MainLayout>
        <div className="container mx-auto">
          <h1 className="mb-6 text-2xl font-bold text-gray-500">
            Create Restaurant
          </h1>

          {/* Error message */}
          {error && (
            <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="p-4 mb-6 text-sm text-green-700 bg-green-100 rounded-md">
              {success}
            </div>
          )}

          {/* Create restaurant form */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Restaurant Name
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiShoppingBag className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-500 h-10"
                    placeholder="Enter restaurant name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    id="address"
                    type="text"
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className="text-gray-500 h-10 block w-full border-gray-300 pl-10 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter restaurant address"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                  <select
                    id="country"
                    {...register("country", {
                      required: "Country is required",
                    })}
                    className="text-gray-500 h-10 block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select a country</option>
                    <option value="India">India</option>
                    <option value="America">America</option>
                  </select>
                </div>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Restaurant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
