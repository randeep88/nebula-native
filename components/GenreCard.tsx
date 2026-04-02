import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const GenreCard = ({
  setSearchQuery,
  item,
}: {
  setSearchQuery: (query: string) => void;
  item: any;
}) => {
  return (
    <Pressable
      onPress={() => {
        setSearchQuery(item.query);
      }}
      className="w-1/2 p-2"
    >
      <View
        style={{
          backgroundColor: item.color,
        }}
        className="rounded-md p-2"
      >
        <View className="flex-1 w-full h-full items-end">
          <Image source={{ uri: item.image }} className="size-14 rounded-md" />
        </View>
        <View className="flex-1 w-full h-full items-start justify-end">
          <Text className="text-white text-lg font-medium">{item.label}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default GenreCard;
