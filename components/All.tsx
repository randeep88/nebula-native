import { usePlayerStore } from "@/store/usePlayerStore";
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
import Albums from "./Albums";
import Artists from "./Artists";
import Playlists from "./Playlists";
import Songs from "./Songs";

const All = ({
  data,
  handlePlaySong,
}: {
  data: any;
  handlePlaySong: (song: any) => void;
}) => {
  const { currentSong, isPlaying } = usePlayerStore();
  const router = useRouter();

  const topResult = data?.songs?.reduce((latest: any, song: any) => {
    return Number(song.year) > Number(latest.year) ? song : latest;
  }, data?.songs?.[0]);

  console.log(data);

  const toArray = (val: any) => (Array.isArray(val) ? val : val ? [val] : []);

  const songs = toArray(data?.songs);
  const albums = toArray(data?.albums);
  const artists = toArray(data?.artists);
  const playlists = toArray(data?.playlists);

  const filteredSongs = songs?.filter((song) => song?.id !== topResult?.id);

  return (
    <ScrollView
      className="px-3"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Top Result */}
      {topResult && (
        <View className="mb-5">
          <Text className="text-white font-bold text-2xl mb-3">Top Result</Text>
          <Pressable
            onPress={() => handlePlaySong(topResult)}
            className="p-3 flex-row items-center gap-4 bg-white/5 rounded-lg"
          >
            <Image
              source={{
                uri:
                  topResult?.image[2]?.url ||
                  require("../assets/images/logo2.png"),
              }}
              // source={require("../assets/images/logo2.png")}
              style={{ width: 55, height: 55, borderRadius: 4 }}
            />
            <View className="w-[75%]">
              <View className="flex-row items-center gap-1">
                {currentSong?.id === topResult?.id && isPlaying && (
                  <Image
                    source={require("../assets/images/gif3.gif")}
                    style={{ width: 20, height: 20 }}
                  />
                )}
                <Text
                  numberOfLines={1}
                  className={`${currentSong?.id === topResult?.id ? "text-primary" : "text-white"} text-lg font-medium w-full`}
                >
                  {topResult?.name}
                </Text>
              </View>
              <Text numberOfLines={1} className="text-white/70">
                {topResult?.artists?.primary[0]?.name}
              </Text>
            </View>
          </Pressable>
        </View>
      )}

      {/* Songs */}
      {songs?.length > 0 && (
        <View className="mb-5">
          <Text className="text-white font-bold text-2xl mb-3">Songs</Text>
          {filteredSongs?.slice(0, 6)?.map((song: any) => (
            <Songs key={song.id} item={song} handlePlaySong={handlePlaySong} />
          ))}
        </View>
      )}

      {/* Albums */}
      {albums?.length > 0 && (
        <View className="mb-5">
          <Text className="text-white font-bold text-2xl mb-3">Albums</Text>
          <FlatList
            data={albums?.slice(0, 6)}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "flex-start",
            }}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Albums item={item} />}
          />
        </View>
      )}

      {/* Artists */}
      {artists?.length > 0 && (
        <View className="mb-5">
          <Text className="text-white font-bold text-2xl mb-3">Artists</Text>
          <FlatList
            data={artists?.slice(0, 6)}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "flex-start",
            }}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item: artist }) => <Artists item={artist} />}
          />
        </View>
      )}

      {playlists?.length > 0 && (
        <View className="mb-5">
          <Text className="text-white font-bold text-2xl mb-3">Playlists</Text>
          <FlatList
            data={playlists?.slice(0, 6)}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "flex-start",
            }}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item: playlist }) => <Playlists item={playlist} />}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default All;
