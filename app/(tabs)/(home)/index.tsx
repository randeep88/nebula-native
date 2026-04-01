import useLastPlayedSong from "@/hooks/useLastPlayedSong";
import useSuggestedSongs from "@/hooks/useSuggestedSongs";
import useUser from "@/hooks/useUser";
import { usePlayerStore } from "@/store/usePlayerStore";
import { isValidImageUrl } from "@/utils/validImage";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
};

const Home = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    currentSong,
    setCurrentSong,
    setIsPlaying,
    setSongsQueue,
    isPlaying,
  } = usePlayerStore();

  const { lastPlayedSong, updateLastPlayedSong } = useLastPlayedSong();

  const songId = currentSong?.id || lastPlayedSong?.id;

  const { suggestedSongs, isPending } = useSuggestedSongs(songId);

  const handlePlaySong = (song: any) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setSongsQueue(suggestedSongs);
    updateLastPlayedSong(song?.id);
  };

  const recent = [
    {
      name: "Liked Songs",
      image: require("../../../assets/images/lb.png"),
      onpress: () => router.push("/(tabs)/(home)/LikedSongs"),
    },
    {
      name: "Your Playlists",
      image: require("../../../assets/images/pb.png"),
      onpress: () => router.push("/(tabs)/profile"),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Text className="text-white/80 font-medium text-base px-3">
          {getGreeting()},
        </Text>
        <Text className="text-white font-semibold text-3xl px-3">
          {user?.username} 👋
        </Text>

        <FlatList
          scrollEnabled={false}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          className="px-2 my-5"
          data={recent}
          renderItem={({ item }) => (
            <Pressable className="p-2 flex-1 w-1/2" onPress={item.onpress}>
              <View className="flex-row items-center justify-between gap-4 bg-white/10 rounded-lg overflow-hidden">
                <Image source={item?.image} style={{ width: 46, height: 46 }} />

                <View className="flex-1 w-full">
                  <Text className="text-white font-semibold text-base">
                    {item?.name}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(_, index) => index.toString()}
        />
        <Text className="text-zinc-200 font-medium text-lg mb-2 px-3">
          Recommended for this track
        </Text>
        {isPending ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-white">Loading suggestions...</Text>
          </View>
        ) : (
          <FlatList
            key="suggested"
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
            }}
            contentContainerStyle={{ paddingBottom: 120 }}
            className="px-2"
            data={suggestedSongs}
            renderItem={({ item }) => (
              <Pressable
                className="mb-1 w-1/2 p-2 flex-1"
                onPress={() => handlePlaySong(item)}
              >
                <View style={{ width: "100%", aspectRatio: 1 }}>
                  {isValidImageUrl(item?.image[2]?.url) ? (
                    <Image
                      source={{ uri: item?.image[2]?.url }}
                      style={{ width: "100%", height: "100%", borderRadius: 4 }}
                    />
                  ) : (
                    <Image
                      source={require("../../../assets/images/logo2.png")}
                      style={{ width: "90%", height: "90%", borderRadius: 4 }}
                      resizeMode="contain"
                    />
                  )}
                </View>
                <View className="items-start w-full h-full mt-2 flex-1">
                  <View className="flex-row items-center gap-1 flex-1 overflow-hidden">
                    {currentSong?.id === item?.id && isPlaying && (
                      <Image
                        source={require("../../../assets/images/gif3.gif")}
                        style={{ width: 20, height: 20, borderRadius: 4 }}
                      />
                    )}
                    <Text
                      numberOfLines={1}
                      className={`${currentSong?.id === item?.id ? "text-primary" : "text-white"} font-medium text-base`}
                    >
                      {item?.name}
                    </Text>
                  </View>
                  <Text numberOfLines={1} className="text-white/70 text-sm">
                    {item?.artists?.primary[0]?.name}
                  </Text>
                </View>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
