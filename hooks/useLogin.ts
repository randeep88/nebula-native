import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { backendAPI } from "../utils/backendAPI";

export const useLogin = () => {
  const router = useRouter();
  const toast = useToast();

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const response = await backendAPI.post("/auth/login", {
        username,
        password,
      });
      const { token } = response.data;
      await AsyncStorage.setItem("token", token);
      return response.data.user;
    },
    onSuccess: () => {
      router.replace("/(tabs)/profile");
      toast.show("You're in! Let's go 🎧");
    },
    onError: (err: any) => {
      console.log("failed to login: ", err);
      toast.show("Login failed");
    },
  });

  return { loginMutate, isPending };
};
