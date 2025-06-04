"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiUser, FiLock } from "react-icons/fi";

type LoginFormInputs = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    await login(data.username, data.password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-background  rounded-lg shadow-sm dark:shadow-gray-500">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground">
            Food Ordering System
          </h1>
          <p className="mt-2 text-sm text-gray-400">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-400"
              >
                Username
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  className="h-10 text-gray-900 block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400"
              >
                Password
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="h-10 text-gray-900 block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-background">
                Demo Accounts
              </span>
            </div>
          </div>

          <div className="text-gray-500 mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="p-2 text-xs border rounded-md">
              <div className="font-bold">Admin</div>
              <div className="c-red-100">Username: nickfury</div>
              <div>Password: password123</div>
            </div>
            <div className="p-2 text-xs border rounded-md">
              <div className="font-bold">Manager (India)</div>
              <div>Username: captainmarvel</div>
              <div>Password: password123</div>
            </div>
            <div className="p-2 text-xs border rounded-md">
              <div className="font-bold">Team Member (America)</div>
              <div>Username: travis</div>
              <div>Password: password123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
