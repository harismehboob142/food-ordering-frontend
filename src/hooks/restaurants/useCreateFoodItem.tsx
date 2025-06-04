import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";

// Types
type CreateFoodItemFormInputs = {
  name: string;
  description: string;
  price: number;
  restaurant: string;
};

type Restaurant = {
  _id: string;
  name: string;
  country: string;
};
const useCreateFoodItem = () => {
  const { user, token } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFoodItemFormInputs>();

  // Fetch restaurants on component mount
  useState(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/restaurants`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        // Filter restaurants by user's country if not admin
        const filteredRestaurants =
          user?.role === "admin"
            ? res.data
            : res.data.filter(
                (restaurant: Restaurant) => restaurant.country === user?.country
              );

        setRestaurants(filteredRestaurants);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch restaurants");
      }
    };

    if (token) {
      fetchRestaurants();
    }
  }, [token, user]);

  // Handle form submission
  const onSubmit = async (data: CreateFoodItemFormInputs) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/fooditems`, data, {
        headers: {
          "x-auth-token": token,
        },
      });

      setSuccess("Food item created successfully!");
      reset(); // Reset form
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create food item");
      setLoading(false);
    }
  };

  return {
    error,
    errors,
    success,
    onSubmit,
    register,
    restaurants,
    isSubmitting,
    handleSubmit,
  };
};

export default useCreateFoodItem;
