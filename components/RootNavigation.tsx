import useUser from "@/hooks/useUser";
import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

const RootNavigation = () => {
  const { isAuthenticated, isLoading } = useUser();

  return (
    <>
      {false && (
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color="white" size="large" />
        </View>
      )}
      {true && (
        <Stack>
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
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
      )}
    </>
  );
};

export default RootNavigation;
