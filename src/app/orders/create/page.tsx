"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { FiShoppingCart, FiDollarSign } from "react-icons/fi";

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

export default function CreateOrderPage() {
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

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <MainLayout>
        <div className="container mx-auto">
          <h1 className="mb-6 text-2xl font-bold bg-background text-foreground">
            Create Order
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Food items list */}
            <div className="md:col-span-2 bg-background text-foreground dark:shadow-gray-500">
              <div className="p-6  rounded-lg shadow-md bg-background text-foreground">
                <h2 className="mb-4 text-lg font-semibold bg-background text-foreground">
                  Available Food Items
                </h2>

                {foodItems.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No food items available
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {foodItems.map((item) => (
                      <div
                        key={item._id}
                        className="p-4 dark:shadow-gray-500 shadow-sm rounded-md"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-gray-500">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.restaurant.name}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-500">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => addItemToOrder(item)}
                            className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order summary */}
            <div className="md:col-span-1 ">
              <div className="p-6 rounded-lg text-foreground bg-background dark:shadow-gray-500">
                <h2 className="mb-4 text-lg font-semibold text-foreground bg-background">
                  Order Summary
                </h2>

                {selectedItems.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No items added to order
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 space-y-3 text-foreground bg-background">
                      {selectedItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 border-b "
                        >
                          <div>
                            <p className="font-medium text-foreground bg-background">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                updateItemQuantity(item.id, item.quantity - 1)
                              }
                              className="w-6 h-6 text-white bg-gray-500 rounded-full hover:bg-gray-600"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateItemQuantity(item.id, item.quantity + 1)
                              }
                              className="w-6 h-6 text-white bg-blue-500 rounded-full hover:bg-blue-600"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeItemFromOrder(item.id)}
                              className="ml-2 text-red-500 hover:text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 mb-4 font-semibold bg-gray-100 rounded-md text-gray-500">
                      Total: ${calculateTotal().toFixed(2)}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-foreground bg-background ">
                        Payment Method
                      </label>
                      <select
                        className=" text-foreground bg-background h-10 block w-full mt-1 border border-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        defaultValue="credit_card"
                      >
                        <option value="credit_card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cash">Cash</option>
                      </select>
                    </div>

                    <button
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting || selectedItems.length === 0}
                      className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
