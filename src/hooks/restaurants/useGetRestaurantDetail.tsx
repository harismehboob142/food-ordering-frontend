import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Types
type Restaurant = {
  _id: string;
  name: string;
  address: string;
  country: string;
  menu: string[];
};

type FoodItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  restaurant: any;
  country: string;
};

const useGetRestaurantDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const { user, token } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch restaurant and food items
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);

        // Fetch restaurant details
        const restaurantRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/restaurants/${id}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        setRestaurant(restaurantRes.data);

        // Fetch food items for this restaurant
        const foodItemsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/fooditems`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        // Filter food items for this restaurant
        const restaurantFoodItems = foodItemsRes.data.filter(
          (item: FoodItem) => item.restaurant._id === id
        );

        setFoodItems(restaurantFoodItems);
        setLoading(false);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to fetch restaurant data"
        );
        setLoading(false);
      }
    };

    if (token && id) {
      fetchRestaurantData();
    }
  }, [token, id]);

  // Check if user can create food items (all roles)
  const canCreateFoodItem = true;

  // Check if user can place orders (admin and manager)
  const canPlaceOrder = user?.role === "admin" || user?.role === "manager";

  console.log("api id is ", process.env.NEXT_PUBLIC_API_URL);
  return {
    error,
    router,
    loading,
    restaurant,
    foodItems,
    canPlaceOrder,
    canCreateFoodItem,
  };
};

export default useGetRestaurantDetail;
