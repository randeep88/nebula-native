import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { backendAPI } from "../utils/backendAPI";

export const useRegister = () => {
  const router = useRouter();
  const toast = useToast();

  const { mutate: registerMutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const response = await backendAPI.post("/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },

    onSuccess: async () => {
      toast.show("Registration successful! Please login.");
      router.push("/auth/login");
    },

    onError: (err) => {
      console.error("Registration error:", err);
      toast.show("Registration failed. Please try again.");
    },
  });

  return { registerMutate, isPending };
};
