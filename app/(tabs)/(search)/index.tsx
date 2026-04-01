import Albums from "@/components/Albums";
import All from "@/components/All";
import Artists from "@/components/Artists";
import Playlists from "@/components/Playlists";
import SearchBar from "@/components/SearchBar";
import Songs from "@/components/Songs";
import useLastPlayedSong from "@/hooks/useLastPlayedSong";
import { useSearchResults } from "@/hooks/useSearchResults";
import { usePlayerStore } from "@/store/usePlayerStore";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Chip } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const tabs = [
  { label: "All", value: "all" },
  { label: "Songs", value: "songs" },
  { label: "Artists", value: "artists" },
  { label: "Albums", value: "albums" },
  { label: "Playlists", value: "playlists" },
];

const components: any = {
  albums: Albums,
  artists: Artists,
  playlists: Playlists,
};

const SearchScreen = () => {
  const { updateLastPlayedSong } = useLastPlayedSong();

  const {
    searchQuery,
    setSearchQuery,
    setCurrentSong,
    setIsPlaying,
    setSongsQueue,
  } = usePlayerStore();

  const [activeTab, setActiveTab] = useState("all");
  const { data: musicData } = useSearchResults(searchQuery ?? "");

  const toArray = (val: any) => (Array.isArray(val) ? val : val ? [val] : []);

  const songs = toArray(musicData?.songs);
  const albums = toArray(musicData?.albums);
  const artists = toArray(musicData?.artists);
  const playlists = toArray(musicData?.playlists);

  const activeData =
    activeTab === "songs"
      ? songs
      : activeTab === "albums"
        ? albums
        : activeTab === "artists"
          ? artists
          : activeTab === "playlists"
            ? playlists
            : [];

  const handlePlaySong = (song: any) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setSongsQueue(songs);
    updateLastPlayedSong(song?.id);
  };

  const Header = () => (
    <View className="px-3 mb-3 gap-3 z-50">
      <Text className="text-white font-bold text-2xl">Search</Text>
      <SearchBar onChangeText={setSearchQuery} />
      {musicData && (
        <View className="flex-row justify-between">
          {tabs?.map((tab: any) => (
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
              onPress={() => setActiveTab(tab?.value)}
            >
              {tab?.label}
            </Chip>
          ))}
        </View>
      )}
    </View>
  );

  if (activeTab === "all") {
    return (
      <SafeAreaView className="flex-1">
        <Header />
        <All data={musicData} handlePlaySong={handlePlaySong} />
      </SafeAreaView>
    );
  }

  if (activeTab === "songs") {
    return (
      <SafeAreaView className="flex-1">
        <Header />
        <FlatList
          data={songs}
          className="px-3"
          renderItem={({ item }) => {
            return <Songs item={item} handlePlaySong={handlePlaySong} />;
          }}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <Header />
      <FlatList
        key={activeTab}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="px-2"
        data={activeData}
        renderItem={({ item }) => {
          const Component = components[activeTab];
          return <Component item={item} />;
        }}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;
