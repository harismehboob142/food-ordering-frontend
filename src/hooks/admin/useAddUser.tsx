import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";

// Types
type CreateUserFormInputs = {
  username: string;
  password: string;
  role: "admin" | "manager" | "member";
  country?: "India" | "America";
};

const useAddUser = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormInputs>();

  // Watch the role field to determine if country is required
  const selectedRole = watch("role");
  const isCountryRequired = selectedRole !== "admin";

  // Handle form submission
  const onSubmit = async (data: CreateUserFormInputs) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // If role is admin, remove country field
      if (data.role === "admin") {
        delete data.country;
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, data, {
        headers: {
          "x-auth-token": token,
        },
      });

      setSuccess("User created successfully!");
      reset(); // Reset form
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create user");
      setLoading(false);
    }
  };

  return {
    error,
    errors,
    success,
    register,
    onSubmit,
    handleSubmit,
    isSubmitting,
    isCountryRequired,
  };
};

export default useAddUser;
