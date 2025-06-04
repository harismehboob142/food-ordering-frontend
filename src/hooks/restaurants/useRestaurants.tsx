import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Types
type Restaurant = {
  _id: string;
  name: string;
  address: string;
  country: string;
  menu: string[];
};
const useRestaurants = () => {
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

  return {
    user,
    error,
    router,
    loading,
    restaurants,
    canCreateRestaurant,
  };
};

export default useRestaurants;
