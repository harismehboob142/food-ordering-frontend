"use client";
import { FiDollarSign } from "react-icons/fi";
import MainLayout from "@/components/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import useUpdatePaymentMethod from "@/hooks/admin/useUpdatePaymentMethod";

export default function UpdatePaymentPage() {
  const {
    error,
    errors,
    orders,
    success,
    orderId,
    register,
    onSubmit,
    setOrderId,
    handleSubmit,
    isSubmitting,
  } = useUpdatePaymentMethod();
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <MainLayout>
        <div className="container mx-auto">
          <h1 className="mb-6 text-2xl font-bold">Update Payment Method</h1>

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

          {/* Update payment form */}
          <div className="p-6 bg-background text-foreground rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="order"
                  className="block text-sm font-medium text-gray-400"
                >
                  Select Order
                </label>
                <select
                  id="order"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="block w-full mt-1 h-10 border text-foreground bg-background border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select an order</option>
                  {orders.map((order) => (
                    <option key={order._id} value={order._id}>
                      Order #{order._id.substring(0, 8)} - $
                      {order.totalAmount.toFixed(2)} - {order.user.username}
                    </option>
                  ))}
                </select>
                {!orderId && (
                  <p className="mt-1 text-sm text-red-600">
                    Please select an order
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-400"
                >
                  Payment Method
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <select
                    id="paymentMethod"
                    {...register("paymentMethod", {
                      required: "Payment method is required",
                    })}
                    className="block w-full pl-10 h-10 border text-foreground bg-background border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select payment method</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !orderId}
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Updating..." : "Update Payment Method"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
