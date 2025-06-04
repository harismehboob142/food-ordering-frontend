import { ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiMenu,
  FiShoppingCart,
  FiSettings,
  FiLogOut,
  FiUser,
} from "react-icons/fi";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Navigation items based on user role
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <FiHome className="mr-2" />,
      roles: ["admin", "manager"],
    },
    {
      name: "Restaurants",
      href: "/restaurants",
      icon: <FiMenu className="mr-2" />,
      roles: ["admin", "manager", "member"],
    },
    {
      name: "Orders",
      href: "/orders",
      icon: <FiShoppingCart className="mr-2" />,
      roles: ["admin", "manager", "member"],
    },
    {
      name: "Admin",
      href: "/admin",
      icon: <FiSettings className="mr-2" />,
      roles: ["admin"],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen  bg-background text-foreground">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-4 border-b bg-background text-foreground">
            <h1 className="text-xl font-bold  text-foreground">
              Food Ordering
            </h1>
            {user && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">{user.username}</span>
                <div className="flex items-center mt-1">
                  <span className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                  {user.country && (
                    <span className="px-2 py-1 ml-2 text-xs font-medium text-white bg-green-500 rounded-full">
                      {user.country}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto bg-background text-foreground">
            <ul className="space-y-2">
              {filteredNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md text-foreground ${
                      pathname === item.href
                        ? "text-foreground bg-blue-600"
                        : "text-foreground hover:bg-blue-500"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User section */}
          <div className="px-6 py-4 border-t bg-background text-foreground">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">{children}</div>
    </div>
  );
};

export default MainLayout;
