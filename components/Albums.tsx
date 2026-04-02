import { isValidImageUrl } from "@/utils/validImage";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const Albums = ({
  item,
  isSong = false,
  handlePlaySong,
}: {
  item: any;
  isSong?: boolean;
  handlePlaySong?: () => void;
}) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        if (isSong) {
          handlePlaySong?.();
        } else {
          router.push({
            pathname: "/(tabs)/(search)/album/[albumId]",
            params: { albumId: item.id },
          });
        }
      }}
      className="mb-1 w-1/2 p-2"
    >
      <View style={{ width: "100%", aspectRatio: 1 }}>
        {isValidImageUrl(item?.image[2]?.url) ? (
          <Image
            source={{ uri: item?.image[2]?.url }}
            style={{ width: "100%", height: "100%", borderRadius: 4 }}
          />
        ) : (
          <Image
            source={require("../assets/images/logo2.png")}
            style={{ width: "90%", height: "90%", borderRadius: 4 }}
            resizeMode="contain"
          />
        )}
      </View>
      <View className="items-start w-full mt-2">
        <Text numberOfLines={1} className="text-white font-medium">
          {item?.name}
        </Text>
        <Text numberOfLines={1} className="text-white/70 text-sm">
          {item?.artists?.primary[0]?.name}
        </Text>
      </View>
    </Pressable>
  );
};

export default Albums;
