import { useState, useEffect } from "react";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { FiDollarSign } from "react-icons/fi";

// Types
type UpdatePaymentFormInputs = {
  paymentMethod: string;
};
const useUpdatePaymentMethod = () => {
  const { token } = useAuth();
  const [orderId, setOrderId] = useState<string>("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePaymentFormInputs>();

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setOrders(res.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch orders");
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Handle form submission
  const onSubmit = async (data: UpdatePaymentFormInputs) => {
    if (!orderId) {
      setError("Please select an order");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/payment`,
        data,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setSuccess("Payment method updated successfully!");
      setLoading(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update payment method"
      );
      setLoading(false);
    }
  };

  return {
    error,
    errors,
    orders,
    orderId,
    success,
    register,
    onSubmit,
    setOrderId,
    handleSubmit,
    isSubmitting,
  };
};

export default useUpdatePaymentMethod;
