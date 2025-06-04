import React from "react";
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

const useAddRestaurant = () => {
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

  return {
    error,
    errors,
    success,
    onSubmit,
    register,
    handleSubmit,
    isSubmitting,
  };
};

export default useAddRestaurant;
