import { useLogin } from "@/hooks/useLogin";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Login = {
  username: string;
  password: string;
};

const LoginScreen = () => {
  const { loginMutate, isPending } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>();

  const onSubmit = (data: Login) => {
    console.log(data);
    if (!data.username || !data.password) {
      Alert.alert("Email and password are required");
      return;
    }
    loginMutate({ username: data?.username, password: data?.password });
  };

  return (
    <SafeAreaView className="px-5 h-full">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <View className="items-center justify-center mb-5 gap-2">
            <Image
              source={require("../../assets/images/logo2.png")}
              style={{ width: 80, height: 80 }}
            />
            <Text className="text-2xl logoFont text-white font-extrabold">
              Login to start listening
            </Text>
          </View>

          <View className="gap-5">
            {/* Username */}
            <Controller
              control={control}
              name="username"
              rules={{ required: "Username is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Username"
                  mode="outlined"
                  style={{ backgroundColor: "black" }}
                  textColor="white"
                  value={value}
                  placeholderTextColor="#d4d4d4"
                  theme={{ colors: { onSurfaceVariant: "#d4d4d4" } }}
                  onChangeText={onChange}
                />
              )}
            />
            {errors?.username && (
              <Text className="text-red-500">{errors.username.message}</Text>
            )}

            {/* Password */}
            <Controller
              control={control}
              name="password"
              rules={{ required: "Password is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Password"
                  mode="outlined"
                  secureTextEntry
                  style={{ backgroundColor: "black" }}
                  placeholderTextColor="#d4d4d4"
                  theme={{ colors: { onSurfaceVariant: "#d4d4d4" } }}
                  textColor="white"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors?.password && (
              <Text className="text-red-500">{errors.password.message}</Text>
            )}

            <Button
              loading={isPending}
              style={{ borderRadius: 6 }}
              mode="contained"
              textColor="black"
              onPress={handleSubmit(onSubmit)}
            >
              Login
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
