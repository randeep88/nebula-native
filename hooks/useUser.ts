import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { backendAPI } from "../utils/backendAPI";

const useUser = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isTokenLoading, setIsTokenLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("token").then((t) => {
      setToken(t);
      setIsTokenLoading(false);
    });
  }, []);

  const {
    data: user,
    isPending: isLoadingUser,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user", token],
    queryFn: async () => {
      const res = await backendAPI.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
    retry: 2,
    staleTime: Infinity,
  });

  const isAuthenticated = !!user?._id && !!token;

  const isLoading = isTokenLoading || (!!token && isLoadingUser);

  return { user, isLoading, isAuthenticated, refetchUser, token };
};

export default useUser;
