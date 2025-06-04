"use client";
import MainLayout from "@/components/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FiPlus, FiEdit2, FiTrash2, FiShoppingCart } from "react-icons/fi";
import useGetRestaurantDetail from "@/hooks/restaurants/useGetRestaurantDetail";

export default function RestaurantDetailPage() {
  const {
    error,
    router,
    loading,
    restaurant,
    foodItems,
    canPlaceOrder,
    canCreateFoodItem,
  } = useGetRestaurantDetail();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto">
          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading restaurant details...</div>
            </div>
          ) : error ? (
            <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          ) : restaurant ? (
            <>
              {/* Restaurant header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {restaurant.name}
                  </h1>
                  <p className="text-gray-600">{restaurant.address}</p>
                  <span className="inline-block px-2 py-1 mt-2 text-xs font-medium text-white bg-green-500 rounded-full">
                    {restaurant.country}
                  </span>
                </div>

                {canCreateFoodItem && (
                  <button
                    onClick={() => router.push("/fooditems/create")}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <FiPlus className="inline mr-2" />
                    Add Food Item
                  </button>
                )}
              </div>

              {/* Food items */}
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Menu Items
              </h2>

              {foodItems.length === 0 ? (
                <div className="p-6 text-center bg-white rounded-lg shadow-md">
                  <p className="text-foreground">
                    No food items found for this restaurant
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden text-foreground bg-background shadow sm:rounded-lg  shadow-sm dark:shadow-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 text-foreground bg-background">
                    <thead className=" text-foreground bg-background">
                      <tr className="text-foreground bg-background">
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-foreground bg-background uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-foreground bg-background uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-foreground bg-background uppercase tracking-wider"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-foreground bg-background uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className=" divide-y divide-gray-200 text-foreground bg-background">
                      {foodItems.map((item) => (
                        <tr
                          key={item._id}
                          className="text-foreground bg-background"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-foreground bg-background">
                            <div className="text-sm font-medium  text-foreground bg-background">
                              {item.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-foreground bg-background">
                              {item.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-foreground bg-background">
                              ${item.price.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              {canPlaceOrder && (
                                <button className="flex items-center px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                                  <FiShoppingCart className="mr-1" /> Order
                                </button>
                              )}
                              <button className="flex items-center px-3 py-1 text-sm text-yellow-600 border border-yellow-600 rounded-md hover:bg-yellow-50">
                                <FiEdit2 className="mr-1" /> Edit
                              </button>
                              <button className="flex items-center px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50">
                                <FiTrash2 className="mr-1" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <p className="text-gray-500">Restaurant not found</p>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
