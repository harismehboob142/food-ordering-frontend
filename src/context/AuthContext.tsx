"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// Define types
type User = {
  id: string;
  username: string;
  role: "admin" | "manager" | "member";
  country?: "India" | "America";
};

type DecodedToken = {
  userId: string;
  role: "admin" | "manager" | "member";
  country?: "India" | "America";
  exp: number;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if token exists in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          return;
        }

        setToken(storedToken);

        // Set axios default header
        axios.defaults.headers.common["x-auth-token"] = storedToken;

        // Fetch user data
        fetchUserData(storedToken);
      } catch (err) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Fetch user data from API
  const fetchUserData = async (authToken: string) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );

      setUser(res.data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch user data");
      setIsLoading(false);
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          username,
          password,
        }
      );

      const { token: authToken, user: userData } = res.data;

      // Save token to localStorage
      localStorage.setItem("token", authToken);

      // Set axios default header
      axios.defaults.headers.common["x-auth-token"] = authToken;

      setToken(authToken);
      setUser(userData);
      setIsLoading(false);
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setIsLoading(false);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["x-auth-token"];
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
