import Feather from "@expo/vector-icons/Feather";
import { usePathname } from "expo-router";
import React from "react";
import { TextInput, View } from "react-native";

const SearchBar = ({
  onPress,
  value,
  onChangeText,
}: {
  onPress?: any;
  value?: string;
  onChangeText?: (text: string) => void;
}) => {
  return (
    <View className="relative">
      <Feather
        name="search"
        size={24}
        color="black"
        className="absolute z-10 top-3 left-6 transform -translate-x-1/2"
      />
      <TextInput
        onPress={onPress}
        value={value}
        onChangeText={onChangeText}
        placeholder="What do you want to listen to?"
        className="font-semibold text-lg p-3 px-3 bg-white text-black rounded-md ps-12"
      />
    </View>
  );
};

export default SearchBar;
