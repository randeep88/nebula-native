import Albums from "@/components/Albums";
import All from "@/components/All";
import Artists from "@/components/Artists";
import GenreCard from "@/components/GenreCard";
import Playlists from "@/components/Playlists";
import SearchBar from "@/components/SearchBar";
import Songs from "@/components/Songs";
import useLastPlayedSong from "@/hooks/useLastPlayedSong";
import { useSearchResults } from "@/hooks/useSearchResults";
import { usePlayerStore } from "@/store/usePlayerStore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Chip } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const tabs = [
  { label: "All", value: "all" },
  { label: "Songs", value: "songs" },
  { label: "Artists", value: "artists" },
  { label: "Albums", value: "albums" },
  { label: "Playlists", value: "playlists" },
];

const Header = ({
  musicData,
  tabs,
  activeTab,
  setActiveTab,
  setSearchQuery,
  searchQuery,
}: any) => (
  <View className="px-3 mb-3 gap-3 z-50">
    <Text className="text-white font-bold text-2xl">Search</Text>
    <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
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

const genres = [
  {
    label: "Punjabi",
    query: "Punjabi Songs",
    color: "#1C4A1C", // deep green — nature/culture
    image:
      "https://c.saavncdn.com/artists/Sidhu_Moose_Wala_004_20250617183705_500x500.jpg",
  },
  {
    label: "Haryanvi",
    query: "Haryanvi Songs",
    color: "#4A3800", // dark mustard — mitti/haryana vibe
    image:
      "https://c.saavncdn.com/artists/Dhanda_Nyoliwala_000_20240820133551_500x500.jpg",
  },
  {
    label: "Hindi",
    query: "Hindi Songs",
    color: "#4A1500", // dark orange-red — Indian flag
    image:
      "https://c.saavncdn.com/artists/Arijit_Singh_004_20241118063717_500x500.jpg",
  },
  {
    label: "English",
    query: "English Songs",
    color: "#0A1F4A", // dark navy — western/modern
    image:
      "https://c.saavncdn.com/artists/Billie_Eilish_20190211151539_500x500.jpg",
  },
  {
    label: "Bollywood",
    query: "Bollywood Hits",
    color: "#4A2800", // dark gold — filmy/dramatic
    image:
      "https://thumbs.dreamstime.com/b/bollywood-background-indian-cinema-poster-text-spot-light-indian-cinematography-stage-vector-d-bollywood-film-event-144813972.jpg?w=992",
  },
  {
    label: "Sad",
    query: "Sad Songs",
    color: "#151528", // dark blue-grey — melancholy
    image:
      "https://thumbs.dreamstime.com/b/anime-style-portrait-girl-headphones-eps-vector-format-90321795.jpg?w=768",
  },
  {
    label: "Party",
    query: "Party Songs",
    color: "#4A004A", // dark purple — neon party vibes
    image:
      "https://c.saavncdn.com/artists/Yo_Yo_Honey_Singh_002_20221216102650_500x500.jpg",
  },
  {
    label: "Romantic",
    query: "Romantic Songs",
    color: "#4A0A1E", // dark rose/red — love
    image: "https://thumbs.dreamstime.com/b/romantic-couple-7700160.jpg?w=768",
  },
  {
    label: "Workout",
    query: "Workout Songs",
    color: "#4A1A00", // dark burnt orange — energy/fire
    image:
      "https://thumbs.dreamstime.com/b/muscle-athlete-man-gym-making-pull-up-elevations-bodybuilder-training-57930636.jpg?w=992",
  },
  {
    label: "Lofi",
    query: "Lofi Songs",
    color: "#0A2A35", // dark teal — calm/chill
    image:
      "https://c.saavncdn.com/artists/Vishal_Mishra_005_20251120085316_500x500.jpg",
  },
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
  const { data: musicData, isPending } = useSearchResults(searchQuery ?? "");

  const toArray = (val: any) => (Array.isArray(val) ? val : val ? [val] : []);

  const songs = toArray(musicData?.songs);
  const albums = toArray(musicData?.albums);
  const artists = toArray(musicData?.artists);
  const similarArtists = toArray(musicData?.artists?.similarArtists);
  const playlists = toArray(musicData?.playlists);

  const activeData =
    activeTab === "songs"
      ? songs
      : activeTab === "albums"
        ? albums
        : activeTab === "artists"
          ? [...artists, ...similarArtists]
          : activeTab === "playlists"
            ? playlists
            : [];

  const handlePlaySong = (song: any) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setSongsQueue(songs);
    updateLastPlayedSong(song?.id);
  };

  if (searchQuery && isPending) {
    return (
      <SafeAreaView className="flex-1">
        <Header
          searchQuery={searchQuery}
          musicData={musicData}
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSearchQuery={setSearchQuery}
        />

        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </SafeAreaView>
    );
  }

  if (!musicData) {
    return (
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            musicData={musicData}
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
          />
          <Text className="text-white text-xl font-semibold px-3 mt-2">
            Browse by mood
          </Text>
          <FlatList
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
            }}
            showsVerticalScrollIndicator={false}
            className="px-1"
            data={genres}
            renderItem={({ item }) => (
              <GenreCard setSearchQuery={setSearchQuery} item={item} />
            )}
            keyExtractor={(item) => item.label}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (activeTab === "all") {
    return (
      <SafeAreaView className="flex-1">
        <Header
          searchQuery={searchQuery}
          musicData={musicData}
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSearchQuery={setSearchQuery}
        />
        {isPending ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
          <All data={musicData} handlePlaySong={handlePlaySong} />
        )}
      </SafeAreaView>
    );
  }

  if (activeTab === "songs") {
    return (
      <SafeAreaView className="flex-1">
        <Header
          searchQuery={searchQuery}
          musicData={musicData}
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSearchQuery={setSearchQuery}
        />
        <FlatList
          data={songs}
          className="px-3"
          renderItem={({ item }) => {
            return <Songs item={item} handlePlaySong={handlePlaySong} />;
          }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <Header
        searchQuery={searchQuery}
        musicData={musicData}
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSearchQuery={setSearchQuery}
      />
      <FlatList
        key={activeTab}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        showsVerticalScrollIndicator={false}
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
