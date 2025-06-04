import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Types
type User = {
  _id: string;
  username: string;
  role: "admin" | "manager" | "member";
  country?: "India" | "America";
  createdAt: string;
};
const useAdmin = () => {
  const router = useRouter();
  const { user: currentUser, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setUsers(res.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch users");
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  return { error, router, loading, users, currentUser };
};

export default useAdmin;
