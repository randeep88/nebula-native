import { useMutation } from "@tanstack/react-query";
import { backendAPI } from "../utils/backendAPI";
import useUserData from "../store/useUserData";
import { useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";

export const useRegister = () => {
  const router = useRouter();
  const { setRegisterData } = useUserData();
  const toast = useToast();

  const { mutate: registerMutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await backendAPI.post("/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },

    onSuccess: async (responseData, formData: any) => {
      const email = formData.get("email");
      const username = formData.get("username");
      const profilePic = formData.get("profilePic");

      setRegisterData({ email, username, profilePic });

      try {
        await backendAPI.post("/auth/send-otp", { email, purpose: "register" });

        toast.show("Registration successful! Please verify your email.");
      } catch (otpError) {
        toast.show(
          "Registration successful but failed to send OTP. Please login to resend.",
        );
        router.replace("/auth/login");
      }
    },

    onError: (err: any) => {
      console.error("Registration error:", err);
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Registration failed. Please try again.";

      toast.show(errorMessage);
    },
  });

  return { registerMutate, isPending };
};
