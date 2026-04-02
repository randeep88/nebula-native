import Albums from "@/components/Albums";
import useLastPlayedSong from "@/hooks/useLastPlayedSong";
import useSuggestedSongs from "@/hooks/useSuggestedSongs";
import useUser from "@/hooks/useUser";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
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
  const { currentSong, setCurrentSong, setIsPlaying, setSongsQueue } =
    usePlayerStore();

  const { lastPlayedSong, updateLastPlayedSong } = useLastPlayedSong();

  const songId = currentSong?.id || lastPlayedSong?.id;

  const { suggestedSongs, isPending, refetchSuggestedSongs } =
    useSuggestedSongs(songId);

  useEffect(() => {
    if (songId) {
      refetchSuggestedSongs();
    }
  }, [songId]);

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
      <ScrollView showsVerticalScrollIndicator={false}>
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
        <Text className="text-white font-semibold text-lg mb-2 px-3">
          Recommended for this track
        </Text>
        {isPending ? (
          <View className="flex-1 items-center justify-center h-full">
            <ActivityIndicator size="large" color="white" />
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
              <Albums
                isSong
                handlePlaySong={() => handlePlaySong(item)}
                item={item}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
