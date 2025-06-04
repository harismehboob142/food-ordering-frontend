import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";

// Types
type FoodItem = {
  _id: string;
  name: string;
  price: number;
  restaurant: {
    _id: string;
    name: string;
    country: string;
  };
  country: string;
};

type CreateOrderFormInputs = {
  items: {
    foodItem: string;
    quantity: number;
  }[];
  paymentMethod: string;
};

const useCreateOrder = () => {
  const { user, token } = useAuth();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<
    { id: string; name: string; price: number; quantity: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrderFormInputs>();

  // Fetch food items on component mount
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/fooditems`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        // Filter food items by user's country if not admin
        const filteredFoodItems =
          user?.role === "admin"
            ? res.data
            : res.data.filter(
                (item: FoodItem) => item.country === user?.country
              );

        setFoodItems(filteredFoodItems);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch food items");
      }
    };

    if (token) {
      fetchFoodItems();
    }
  }, [token, user]);

  // Add item to order
  const addItemToOrder = (item: FoodItem) => {
    const existingItem = selectedItems.find((i) => i.id === item._id);

    if (existingItem) {
      // Update quantity if item already exists
      setSelectedItems(
        selectedItems.map((i) =>
          i.id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      // Add new item
      setSelectedItems([
        ...selectedItems,
        {
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ]);
    }
  };

  // Remove item from order
  const removeItemFromOrder = (itemId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
  };

  // Update item quantity
  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setSelectedItems(
      selectedItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Calculate total price
  const calculateTotal = () => {
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Handle form submission
  const onSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Format items for API
      const formattedItems = selectedItems.map((item) => ({
        foodItem: item.id,
        quantity: item.quantity,
      }));

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          items: formattedItems,
          paymentMethod: "credit_card",
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setSuccess("Order created successfully!");
      setSelectedItems([]);
      reset();
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create order");
      setLoading(false);
    }
  };
  return {
    error,
    success,
    onSubmit,
    foodItems,
    handleSubmit,
    isSubmitting,
    selectedItems,
    addItemToOrder,
    calculateTotal,
    updateItemQuantity,
    removeItemFromOrder,
  };
};

export default useCreateOrder;
