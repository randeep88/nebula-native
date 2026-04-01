import { HapticTab } from "@/components/haptic-tab";
import MiniPlayer from "@/components/MiniPlayer";
import useUser from "@/hooks/useUser";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { Image, View } from "react-native";

export default function TabLayout() {
  const { user } = useUser();

  return (
    <View className="flex-1 h-full relative">
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "white",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 65,
            zIndex: 10,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Feather name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(search)"
          options={{
            title: "Search",
            tabBarIcon: ({ color }) => (
              <Feather name="search" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(library)"
          options={{
            title: "Library",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="library-music" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  user?.profilePic
                    ? { uri: user.profilePic }
                    : require("../../assets/images/dummy.jpg")
                }
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: focused ? "#ffffff9a" : "transparent",
                }}
              />
            ),
          }}
          key={user?.profilePic ?? "default"}
        />

        <Tabs.Screen name="(search,library)" options={{ href: null }} />
      </Tabs>

      <MiniPlayer />

      <LinearGradient
        colors={[
          "transparent",
          "rgba(0, 0, 0, 0.2)",
          "rgba(0, 0, 0, 0.3)",
          "rgba(0, 0, 0, 0.5)",
          "rgba(0, 0, 0, 0.7)",
          "black",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: "absolute",
          bottom: 15,
          left: 0,
          right: 0,
          height: 50,
        }}
      />
    </View>
  );
}
