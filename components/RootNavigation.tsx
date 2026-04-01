import useUser from "@/hooks/useUser";
import { Stack } from "expo-router";
import React from "react";

const RootNavigation = () => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Protected guard={true}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="player-modal"
          options={{
            presentation: "modal",
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
      </Stack.Protected>
    </Stack>
  );
};

export default RootNavigation;
