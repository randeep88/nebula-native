import ParallaxScrollView from "@/components/parallax-scroll-view";
import Songs from "@/components/Songs";
import useLastPlayedSong from "@/hooks/useLastPlayedSong";
import { useLibrary } from "@/hooks/useLibrary";
import { usePlaylistData } from "@/hooks/usePlaylistData";
import { usePlayerStore } from "@/store/usePlayerStore";
import { formatNumbers } from "@/utils/formatNumbers";
import { getDominantColor } from "@/utils/useImageColors";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const PlaylistDetails = () => {
  const {
    setIsPlaying,
    setSongsQueue,
    setCurrentSong,
    isPlaying,
    currentSong,
  } = usePlayerStore();

  const { updateLastPlayedSong } = useLastPlayedSong();

  const {
    addPlaylist,
    removePlaylist,
    libraryItems,
    isAddingSong,
    isRemovingSong,
  } = useLibrary();
  const { playlistId } = useLocalSearchParams();
  console.log(playlistId);

  const router = useRouter();

  const scrollY = useRef(new Animated.Value(0)).current;
  const [dominantColor, setDominantColor] = useState("#000000");

  const { data: PlaylistDetails, isPending } = usePlaylistData(
    playlistId as string | number,
  );

  const isPlaylistInLibrary = libraryItems?.some(
    (entry) =>
      entry.type === "playlist" && entry.success && entry.id === playlistId,
  );

  useEffect(() => {
    const getColor = async () => {
      const color = await getDominantColor(PlaylistDetails?.image?.[2]?.url);
      setDominantColor(color);
    };
    getColor();
  }, [PlaylistDetails]);

  if (isPending || !PlaylistDetails) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="white" size={30} />
      </SafeAreaView>
    );
  }

  const isSongInAlbum = PlaylistDetails?.songs?.some(
    (song: any) => song?.id === currentSong?.id,
  );

  const handlePlaySong = (song: any) => {
    setCurrentSong(song);
    updateLastPlayedSong(song?.id);
    setSongsQueue(PlaylistDetails?.songs);
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
          backgroundColor: dominantColor,
          padding: 10,
          paddingHorizontal: 15,
          opacity: headerOpacity,
        }}
      >
        <View className="">
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
          {PlaylistDetails?.name || "Artist"}
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
              source={{
                uri:
                  PlaylistDetails?.image?.[2]?.url ??
                  "https://picsum.photos/400",
              }}
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
                {PlaylistDetails?.name}
              </Text>
              {PlaylistDetails?.isVerified && (
                <MaterialIcons name="verified" color="#3b82f6" size={24} />
              )}
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
              {formatNumbers(Number(PlaylistDetails?.songs?.length))}{" "}
              {PlaylistDetails?.songs?.length > 1 ? "songs" : "song"}
            </Text>

            <View className="items-center justify-between flex-row gap-4">
              {isAddingSong || isRemovingSong ? (
                <View className="items-center flex-1 justify-center w-full">
                  <ActivityIndicator color="#fff" />
                </View>
              ) : isPlaylistInLibrary ? (
                <Pressable onPress={() => removePlaylist(playlistId as string)}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    color="#00CDAC"
                    size={34}
                  />
                </Pressable>
              ) : (
                <Pressable onPress={() => addPlaylist(playlistId as string)}>
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    color="#fff"
                    size={34}
                  />
                </Pressable>
              )}
              {isSongInAlbum && isPlaying ? (
                <Pressable onPress={() => setIsPlaying(false)}>
                  <MaterialCommunityIcons
                    name="pause-circle"
                    color="#00CDAC"
                    size={60}
                  />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => handlePlaySong(PlaylistDetails?.songs?.[0])}
                >
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
        <View className="px-3 flex-1" style={{ marginBottom: 30 }}>
          <FlatList
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            data={PlaylistDetails?.songs}
            renderItem={({ item }) => {
              return (
                <Songs
                  item={item}
                  handlePlaySong={handlePlaySong}
                  showAddButton={false}
                />
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={{ marginBottom: 150 }} />
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default PlaylistDetails;
