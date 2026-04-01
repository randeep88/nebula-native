import ParallaxScrollView from "@/components/parallax-scroll-view";
import Songs from "@/components/Songs";
import useLastPlayedSong from "@/hooks/useLastPlayedSong";
import { useLibrary } from "@/hooks/useLibrary";
import { usePlayerStore } from "@/store/usePlayerStore";
import { formatNumbers } from "@/utils/formatNumbers";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Animated, FlatList, Image, Pressable, Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const LikedSongs = () => {
  const {
    setIsPlaying,
    setSongsQueue,
    setCurrentSong,
    isPlaying,
    currentSong,
  } = usePlayerStore();

  const { updateLastPlayedSong } = useLastPlayedSong();

  const { libraryItems, isLoading } = useLibrary();

  const router = useRouter();

  const scrollY = useRef(new Animated.Value(0)).current;

  const songs = libraryItems
    ?.filter((item: any) => item.type === "song")
    .map((item: any) => item.data[0])
    .reverse();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 px-3">
        <Text className="text-white font-bold text-2xl">Liked Songs</Text>
        <Text className="text-white">Loading...</Text>
      </SafeAreaView>
    );
  }
  const isSongExist = songs?.some((song: any) => song?.id === currentSong?.id);

  const handlePlaySong = (song: any) => {
    setCurrentSong(song);
    updateLastPlayedSong(song?.id);
    setSongsQueue(songs || []);
    setIsPlaying(true);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [150, 250],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView className="flex-1 bg-black relative">
      <Animated.View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "absolute",
          top: 35,
          gap: 15,
          left: 0,
          right: 0,
          zIndex: 20,
          backgroundColor: "#002c8b",
          padding: 10,
          paddingHorizontal: 15,
          opacity: headerOpacity,
        }}
      >
        <View>
          <TouchableRipple
            onPress={() => router.back()}
            rippleColor="rgba(255,255,255,0.2)"
            borderless={true}
            style={{
              padding: 6,
              borderRadius: 100,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableRipple>
        </View>
        <Text
          numberOfLines={1}
          className="text-white w-[60%] font-medium text-xl"
        >
          Liked Songs
        </Text>
      </Animated.View>

      <ParallaxScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        headerImage={
          <View className="relative">
            <Image
              source={require("@/assets/images/lb.png")}
              style={{
                width: "100%",
                height: 300,
                resizeMode: "cover",
              }}
            />

            <TouchableRipple
              onPress={() => router.back()}
              rippleColor="rgba(255,255,255,0.2)"
              borderless={true}
              style={{
                backgroundColor: "rgba(0,0,0,0.2)",
                position: "absolute",
                top: 10,
                left: 10,
                padding: 8,
                borderRadius: 100,
              }}
            >
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableRipple>

            <View className="z-50 absolute flex-row gap-2 bottom-0 left-0 right-0 p-5 flex-1">
              <Text
                numberOfLines={2}
                className="text-white font-bold text-5xl text-left"
              >
                Liked Songs
              </Text>
            </View>

            <LinearGradient
              colors={[
                "transparent",
                "transparent",
                "rgba(0,0,0,0.2)",
                "rgba(0,0,0,0.4)",
                "rgba(0,0,0,0.8)",
              ]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "100%",
              }}
            />
          </View>
        }
        headerBackgroundColor={{ dark: "#000", light: "#000" }}
      >
        <View className="p-3 flex-1">
          <View className="items-center justify-between flex-row">
            <Text className="text-white/80 font-semibold text-base">
              {formatNumbers(Number(songs?.length))}{" "}
              {songs?.length > 1 ? "songs" : "song"}
            </Text>

            <View className="items-center justify-between flex-row gap-4">
              {isSongExist && isPlaying ? (
                <Pressable onPress={() => setIsPlaying(false)}>
                  <MaterialCommunityIcons
                    name="pause-circle"
                    color="#00CDAC"
                    size={60}
                  />
                </Pressable>
              ) : (
                <Pressable onPress={() => handlePlaySong(songs?.[0])}>
                  <MaterialCommunityIcons
                    name="play-circle"
                    color="#00CDAC"
                    size={60}
                  />
                </Pressable>
              )}
            </View>
          </View>
        </View>
        <View className="px-3 flex-1">
          <FlatList
            scrollEnabled={false}
            data={songs}
            contentContainerStyle={{ paddingBottom: 120 }}
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => (
              <Songs
                item={item}
                handlePlaySong={handlePlaySong}
                showAddButton={false}
                showAddedToLiked={false}
              />
            )}
          />
        </View>
        <View style={{ marginBottom: 40 }} />
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default LikedSongs;
