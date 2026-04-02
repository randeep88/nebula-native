import { useRegister } from "@/hooks/useRegister";
import { Link } from "expo-router";
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

type Signup = {
  username: string;
  password: string;
  email: string;
};

const SignupScreen = () => {
  const { registerMutate, isPending } = useRegister();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Signup>();

  const onSubmit = async (data: Signup) => {
    const seed = Date.now() + Math.random();
    const randomUrl = `https://robohash.org/${seed}?set=set1`;

    if (!data.email || !data.password) {
      Alert.alert("Email and password are required");
      return;
    }
    console.log("register data", { ...data, profilePic: randomUrl });
    registerMutate({ ...data, profilePic: randomUrl });
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
              Create a new account
            </Text>
          </View>

          <View className="gap-5">
            {/* Email */}
            <Controller
              control={control}
              name="email"
              rules={{ required: "Email is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Email"
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
            {errors?.email && (
              <Text className="text-red-500">{errors.email.message}</Text>
            )}

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
              Sign up
            </Button>
            <Link href="/auth/login" className="text-white text-center mt-2">
              Already have an account? Login
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
