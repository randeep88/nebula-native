import ParallaxScrollView from "@/components/parallax-scroll-view";
import Songs from "@/components/Songs";
import { useArtistData } from "@/hooks/useArtistData";
import useLastPlayedSong from "@/hooks/useLastPlayedSong";
import { useLibrary } from "@/hooks/useLibrary";
import { usePlayerStore } from "@/store/usePlayerStore";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { formatNumbers } from "@/utils/formatNumbers";
import { getDominantColor } from "@/utils/useImageColors";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
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

const ArtistDetails = () => {
  const {
    setIsPlaying,
    setSongsQueue,
    setCurrentSong,
    isPlaying,
    currentSong,
  } = usePlayerStore();
  const { updateLastPlayedSong } = useLastPlayedSong();

  const {
    addArtist,
    removeArtist,
    libraryItems,
    isAddingSong,
    isRemovingSong,
  } = useLibrary();
  const { artistId } = useLocalSearchParams();
  const router = useRouter();

  const scrollY = useRef(new Animated.Value(0)).current;

  const { data: artistDetails, isPending } = useArtistData(
    artistId as string | number,
  );

  const [dominantColor, setDominantColor] = useState("#000000");

  useEffect(() => {
    const getColor = async () => {
      const color = await getDominantColor(
        artistDetails?.image?.[2]?.url || "",
      );
      console.log("color", color);
      setDominantColor(color);
    };
    getColor();
  }, [artistDetails]);

  const isArtistInLibrary = libraryItems?.some(
    (entry) =>
      entry.type === "artist" && entry.success && entry.id === artistId,
  );

  const isSongInArtist = artistDetails?.topSongs?.some(
    (song: any) => song?.id === currentSong?.id,
  );

  if (isPending || !artistDetails) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="white" size={30} />
      </SafeAreaView>
    );
  }

  const handlePlaySong = (song: any) => {
    setCurrentSong(song);
    updateLastPlayedSong(song?.id);
    setSongsQueue(artistDetails?.topSongs);
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
          {artistDetails?.name || "Artist"}
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
                  artistDetails?.image?.[2]?.url ?? "https://picsum.photos/400",
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

            <View className="z-50 absolute bottom-0 left-0 right-0 p-5 flex-1">
              <Text
                numberOfLines={2}
                className="text-white font-bold text-5xl text-left"
              >
                {artistDetails?.name}
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
            <View>
              {artistDetails?.isVerified && (
                <View className=" flex-row items-center gap-1">
                  <MaterialIcons name="verified" color="#3b82f6" size={15} />
                  <Text className="text-white/80 font-semibold text-base">
                    Verified
                  </Text>
                </View>
              )}
              <Text className="text-white/80 font-semibold text-base">
                {formatNumbers(Number(artistDetails?.followerCount))} followers
              </Text>
            </View>
            <View className="items-center justify-between flex-row gap-4">
              {isAddingSong || isRemovingSong ? (
                <View className="items-center flex-1 justify-center w-full">
                  <ActivityIndicator color="#fff" />
                </View>
              ) : isArtistInLibrary ? (
                <Pressable onPress={() => removeArtist(artistId as string)}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    color="#00CDAC"
                    size={34}
                  />
                </Pressable>
              ) : (
                <Pressable onPress={() => addArtist(artistId as string)}>
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    color="#fff"
                    size={34}
                  />
                </Pressable>
              )}
              {isSongInArtist && isPlaying ? (
                <Pressable onPress={() => setIsPlaying(false)}>
                  <MaterialCommunityIcons
                    name="pause-circle"
                    color="#00CDAC"
                    size={60}
                  />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => handlePlaySong(artistDetails?.topSongs?.[0])}
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
          <Text className="text-white font-bold text-xl mb-2">Popular</Text>
          <FlatList
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            data={artistDetails?.topSongs}
            renderItem={({ item }) => {
              return (
                <Songs
                  item={item}
                  handlePlaySong={handlePlaySong}
                  isArtist={true}
                  showAddButton={false}
                />
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </View>

        {artistDetails?.singles?.length > 0 && (
          <View className="px-3 flex-1" style={{ marginBottom: 30 }}>
            <Text className="text-white font-bold text-xl mb-2">Singles</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: "row" }}
              data={artistDetails?.singles}
              renderItem={({ item }) => {
                return (
                  <Link
                    href={{
                      pathname: `../album/[albumId]`,
                      params: { albumId: item?.id },
                    }}
                    key={item?.id}
                    className="p-2 items-start justify-between gap-4 mb-2"
                  >
                    <View className="items-start gap-4 flex-1">
                      <Image
                        source={{ uri: item?.image[2]?.url }}
                        style={{ width: 130, height: 130, borderRadius: 4 }}
                      />
                      <View className="w-[130px]">
                        <Text
                          numberOfLines={1}
                          className={`${currentSong?.id === item?.id ? "text-primary" : "text-white"} font-medium text-[15px] w-full`}
                        >
                          {item?.name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          className="text-white/70 text-sm"
                        >
                          {item?.year} &bull;{" "}
                          {capitalizeFirstLetter(item?.type)}
                        </Text>
                      </View>
                    </View>
                  </Link>
                );
              }}
              keyExtractor={(item) => item?.id}
            />
          </View>
        )}

        {artistDetails?.topAlbums?.length > 0 && (
          <View className="px-3 flex-1" style={{ marginBottom: 30 }}>
            <Text className="text-white font-bold text-xl mb-2">
              Top Albums
            </Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: "row" }}
              data={artistDetails?.topAlbums}
              renderItem={({ item }) => {
                return (
                  <Link
                    href={{
                      pathname: `../album/[albumId]`,
                      params: { albumId: item?.id },
                    }}
                    key={item.id}
                    className="p-2 items-start justify-between gap-4 mb-2"
                  >
                    <View className="items-start gap-4 flex-1">
                      <Image
                        source={{ uri: item?.image[2]?.url }}
                        style={{ width: 130, height: 130, borderRadius: 4 }}
                      />
                      <View className="w-[130px]">
                        <Text
                          numberOfLines={1}
                          className={`${currentSong?.id === item?.id ? "text-primary" : "text-white"} font-medium text-[15px] w-full`}
                        >
                          {item?.name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          className="text-white/70 text-sm"
                        >
                          {item?.year} &bull;{" "}
                          {capitalizeFirstLetter(item?.type)}
                        </Text>
                      </View>
                    </View>
                  </Link>
                );
              }}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}

        {artistDetails?.similarArtists?.length > 0 && (
          <View className="px-3 flex-1" style={{ marginBottom: 30 }}>
            <Text className="text-white font-bold text-xl mb-2">
              Similar Artists
            </Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: "row" }}
              data={artistDetails?.similarArtists}
              renderItem={({ item }) => {
                return (
                  <Link
                    href={{
                      pathname: `../artist/[artistId]`,
                      params: { artistId: item?.id },
                    }}
                    key={item.id}
                    className="p-2 items-center justify-between gap-4 mb-2"
                  >
                    <View className="items-center gap-4 flex-1">
                      <Image
                        source={{ uri: item?.image[2]?.url }}
                        style={{ width: 130, height: 130, borderRadius: 100 }}
                      />
                      <View className="w-[130px] items-center">
                        <Text
                          numberOfLines={1}
                          className="text-white font-medium text-[15px] w-full text-center"
                        >
                          {item?.name}
                        </Text>
                      </View>
                    </View>
                  </Link>
                );
              }}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
        <View style={{ marginBottom: 150 }} />
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default ArtistDetails;
