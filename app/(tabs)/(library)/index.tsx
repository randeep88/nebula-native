import { useLibrary } from "@/hooks/useLibrary";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { Chip } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const tabs = [
  { label: "Songs", value: "songs" },
  { label: "Artists", value: "artists" },
  { label: "Albums", value: "albums" },
  { label: "Playlists", value: "playlists" },
];

const LibraryScreen = () => {
  const { libraryItems, refetch } = useLibrary();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const songs = libraryItems?.filter((item: any) => item.type === "song");
  const albums = libraryItems
    ?.filter((item) => item.type === "album")
    .reverse();
  const artists = libraryItems
    ?.filter((item) => item.type === "artist")
    .reverse();
  const playlists = libraryItems
    ?.filter((item) => item.type === "playlist")
    .reverse();

  return (
    <SafeAreaView className="flex-1 px-3">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
          />
        }
      >
        <Text className="text-white font-bold text-2xl">Your Library</Text>
        <View className="flex-row gap-2 mb-5 mt-3">
          {activeTab ? (
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setActiveTab("")}
                className="p-2.5 bg-white/20 rounded-full"
              >
                <Feather name="x" size={16} color="white" />
              </Pressable>

              <Chip
                compact
                style={{
                  backgroundColor: "#00CDAC",
                  borderRadius: 100,
                }}
                textStyle={{
                  color: "black",
                  fontSize: 13,
                }}
                selectedColor="white"
              >
                {activeTab}
              </Chip>
            </View>
          ) : null}

          {!activeTab &&
            tabs?.map((tab: any) => (
              <Chip
                compact
                style={{
                  backgroundColor:
                    tab.value === activeTab ? "#00CDAC" : "#FFFFFF2D",
                  borderRadius: 100,
                }}
                textStyle={{
                  color: tab.value === activeTab ? "black" : "white",
                  fontSize: 13,
                }}
                selectedColor="white"
                key={tab?.value}
                onPress={() => setActiveTab(tab?.label)}
              >
                {tab?.label}
              </Chip>
            ))}
        </View>

        <View>
          {(activeTab.toLowerCase() === "songs" ||
            activeTab.toLowerCase() === "") && (
            <Pressable
              onPress={() => router.push("/(tabs)/(library)/LikedSongs")}
            >
              <View className="p-2 flex-row items-center gap-4 mb-2">
                <Image
                  source={require("@/assets/images/lb.png")}
                  style={{ width: 55, height: 55, borderRadius: 4 }}
                />
                <View>
                  <Text
                    numberOfLines={1}
                    className="text-white font-medium text-lg"
                  >
                    Liked Songs
                  </Text>

                  <Text className="text-white/70 text-sm">
                    Playlist &bull; {songs?.length}{" "}
                    {songs?.length !== 1 ? "songs" : "song"}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}

          {(activeTab.toLowerCase() === "artists" ||
            activeTab.toLowerCase() === "") && (
            <FlatList
              scrollEnabled={false}
              data={artists}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/(library)/artist/[artistId]",
                      params: { artistId: item?.data?.id },
                    })
                  }
                >
                  <View className="p-2 flex-row items-center gap-4 mb-2">
                    <Image
                      source={{
                        uri:
                          item?.data?.image[2]?.url ||
                          "https://via.placeholder.com/150/000000/FFFFFF/?text=Artist",
                      }}
                      style={{ width: 55, height: 55, borderRadius: 4 }}
                    />
                    <View className="flex-1">
                      <Text
                        numberOfLines={1}
                        className="text-white font-medium text-lg"
                      >
                        {item?.data?.name || "Unknown Artist"}
                      </Text>

                      <Text className="text-white/70 text-sm">Artist</Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          )}

          {(activeTab.toLowerCase() === "albums" ||
            activeTab.toLowerCase() === "") && (
            <FlatList
              scrollEnabled={false}
              data={albums}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/(library)/album/[albumId]",
                      params: { albumId: item?.data?.id },
                    })
                  }
                >
                  <View className="p-2 flex-row items-center gap-4 mb-2">
                    <Image
                      source={{
                        uri:
                          item?.data?.image[2]?.url ||
                          "https://via.placeholder.com/150/000000/FFFFFF/?text=Artist",
                      }}
                      style={{ width: 55, height: 55, borderRadius: 4 }}
                    />
                    <View className="flex-1">
                      <Text
                        numberOfLines={1}
                        className="text-white font-medium text-lg"
                      >
                        {item?.data?.name || "Unknown Artist"}
                      </Text>

                      <Text className="text-white/70 text-sm">
                        Album &bull; {item?.data?.songs?.length}{" "}
                        {item?.data?.songs?.length !== 1 ? "songs" : "song"}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          )}

          {(activeTab.toLowerCase() === "playlists" ||
            activeTab.toLowerCase() === "") && (
            <FlatList
              scrollEnabled={false}
              data={playlists}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/(library)/playlist/[playlistId]",
                      params: { playlistId: item?.data?.id },
                    })
                  }
                >
                  <View className="p-2 flex-row items-center gap-4 mb-2">
                    <Image
                      source={{
                        uri:
                          item?.data?.image[2]?.url ||
                          "https://via.placeholder.com/150/000000/FFFFFF/?text=Artist",
                      }}
                      style={{ width: 55, height: 55, borderRadius: 4 }}
                    />
                    <View className="flex-1">
                      <Text
                        numberOfLines={1}
                        className="text-white font-medium text-lg"
                      >
                        {item?.data?.name || "Unknown Playlist"}
                      </Text>

                      <Text className="text-white/70 text-sm">
                        Playlist &bull; {item?.data?.songs?.length}{" "}
                        {item?.data?.songs?.length !== 1 ? "songs" : "song"}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      </ScrollView>
      <View style={{ marginBottom: 150 }} />
    </SafeAreaView>
  );
};

export default LibraryScreen;
