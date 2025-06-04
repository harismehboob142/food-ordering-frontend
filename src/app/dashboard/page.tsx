"use client";
import useDashboard from "@/hooks/dashboard/useDashboard";
import MainLayout from "@/components/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  const { getStats, user } = useDashboard();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto bg-background text-foreground">
          <h1 className="mb-6 text-2xl text-foreground font-bold ">
            Dashboard
          </h1>

          {/* Welcome message */}
          <div className="p-6 mb-6 rounded-lg shadow-sm dark:shadow-gray-200 bg-background text-foreground ">
            <h2 className="text-xl  font-semibold text-foreground">
              Welcome, {user?.username}!
            </h2>
            <p className="mt-2 text-gray-600">
              {user?.role === "admin" &&
                "You have full access to the system across all countries."}
              {user?.role === "manager" &&
                `You can manage restaurants, food items, and orders in ${user.country}.`}
              {user?.role === "member" &&
                `You can view restaurants and create food items in ${user.country}.`}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {getStats().map((stat) => (
              <div
                key={stat.name}
                className="p-6 bg-background text-foreground

                shadow-sm dark:shadow-gray-200 rounded"
              >
                <div className="flex items-center">
                  <div className="p-3 mr-4 rounded-full bg-gray-50">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-semibold text-gray-500">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Role-based access information */}
          <div className="p-6 mt-6 rounded-lg shadow-sm dark:shadow-gray-200 bg-background text-foreground">
            <h2 className="mb-4 text-lg font-semibold bg-background text-foreground">
              Your Access Permissions
            </h2>
            <div className="overflow-hiddenshadow sm:rounded-lg bg-background text-foreground">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-base font-semibold leading-6 text-foreground">
                  Role:{" "}
                  {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                </h3>
                {user?.country && (
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Country: {user.country}
                  </p>
                )}
              </div>
              <div className="border-t border-gray-200 bg-background text-foreground">
                <dl>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-background text-foreground">
                    <dt className="text-sm font-medium text-gray-500">
                      View Restaurants & Menu
                    </dt>
                    <dd className="mt-1 text-sm text-green-600 sm:col-span-2 sm:mt-0">
                      ✓ Allowed
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-background text-foreground  sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Create Food Items
                    </dt>
                    <dd className="mt-1 text-sm text-green-600 sm:col-span-2 sm:mt-0">
                      ✓ Allowed
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-background text-foreground grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Place Orders
                    </dt>
                    <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                      {user?.role === "admin" || user?.role === "manager" ? (
                        <span className="text-green-600">✓ Allowed</span>
                      ) : (
                        <span className="text-red-600">✗ Not Allowed</span>
                      )}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-background text-foreground  sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Cancel Orders
                    </dt>
                    <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                      {user?.role === "admin" || user?.role === "manager" ? (
                        <span className="text-green-600">✓ Allowed</span>
                      ) : (
                        <span className="text-red-600">✗ Not Allowed</span>
                      )}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-background text-foreground grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Update Payment Method
                    </dt>
                    <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                      {user?.role === "admin" ? (
                        <span className="text-green-600">✓ Allowed</span>
                      ) : (
                        <span className="text-red-600">✗ Not Allowed</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
