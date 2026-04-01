import useLastPlayedSong from "@/hooks/useLastPlayedSong";
import { useLibrary } from "@/hooks/useLibrary";
import { usePlayerStore } from "@/store/usePlayerStore";
import { formatDuration } from "@/utils/formatDuration";
import { usePlayerContext } from "@/utils/usePlayer";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PlayerModal = () => {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    nextSong,
    prevSong,
    songsQueue,
    currentIndex,
    setIsQueueOpen,
    toggleShuffle,
    isShuffle,
    isRepeat,
    setRepeat,
    setCurrentSong,
  } = usePlayerStore();

  const { player, status } = usePlayerContext();
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["70%"], []);
  const { top } = useSafeAreaInsets();

  const { dominantColor } = usePlayerStore();

  const inset = useSafeAreaInsets();

  const { libraryItems, addSong, removeSong, isAddingSong, isRemovingSong } =
    useLibrary();

  const { updateLastPlayedSong } = useLastPlayedSong();

  const filteredSongs = songsQueue?.slice(
    songsQueue?.findIndex((s: any) => s.id === currentSong?.id),
  );

  const seekTo = (value: number) => {
    player?.seekTo(value);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  const isSongInLibrary = libraryItems.some(
    (entry) =>
      entry.type === "song" && entry.success && entry.id === currentSong?.id,
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    [],
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={[dominantColor || "#000000", `${dominantColor || "#000000"}1A`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          paddingTop: inset.top,
          paddingBottom: inset.bottom,
          flex: 1,
          height: "100%",
          width: "100%",
        }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="p-4">
            <Text className="text-white text-2xl">
              <Entypo name="chevron-thin-down" color="#fff" size={24} />
            </Text>
          </Pressable>
          <View className="items-center max-w-[60%]">
            <Text className="text-white text-sm uppercase">
              Playing From Album
            </Text>
            <Link
              href={`/(search)/album/${currentSong?.album?.id}` as any}
              asChild
            >
              <Text
                numberOfLines={1}
                className="text-white text-sm font-semibold"
              >
                {currentSong?.album?.name}
              </Text>
            </Link>
          </View>
          <Pressable onPress={() => router.back()} className="p-4">
            <Text className="text-white text-2xl">
              <Entypo name="dots-three-vertical" color="#fff" size={20} />
            </Text>
          </Pressable>
        </View>

        <View className="flex-1 items-center px-6 gap-8 mt-1">
          <Image
            source={{ uri: currentSong?.image?.[2]?.url }}
            style={{ width: 300, height: 300, borderRadius: 8 }}
          />
          <View className="flex-row items-center justify-between mt-5 w-full px-3">
            <View className="w-[80%]">
              <Text
                numberOfLines={1}
                className="text-white font-semibold text-2xl"
              >
                {currentSong?.name}
              </Text>
              <Link
                href={
                  `/(search)/artist/${currentSong?.artists?.primary?.[0]?.id}` as any
                }
                asChild
              >
                <Text numberOfLines={1} className="text-gray-200 text-lg">
                  {currentSong?.artists?.primary?.[0]?.name}
                </Text>
              </Link>
            </View>
            {isAddingSong || isRemovingSong ? (
              <View className="items-center flex-1 justify-center w-full">
                <ActivityIndicator color="#fff" />
              </View>
            ) : isSongInLibrary ? (
              <Pressable onPress={() => removeSong(currentSong?.id)}>
                <MaterialCommunityIcons
                  name="check-circle"
                  color="#00CDAC"
                  size={34}
                />
              </Pressable>
            ) : (
              <Pressable onPress={() => addSong(currentSong?.id)}>
                <MaterialCommunityIcons
                  name="plus-circle-outline"
                  color="#fff"
                  size={34}
                />
              </Pressable>
            )}
          </View>
          <View className="w-full z-0">
            <Slider
              style={{ width: "100%", height: 10 }}
              minimumValue={0}
              maximumValue={status?.duration}
              value={status?.currentTime}
              onSlidingComplete={(value) => seekTo(value)}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="#ffffff80"
              thumbTintColor="#fff"
            />
            <View className="flex-row items-center justify-between mt-2 px-3">
              <Text className="text-white text-sm">
                {formatDuration(status?.currentTime)}
              </Text>
              <Text className="text-white text-sm">
                {formatDuration(status?.duration)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between w-full px-3">
            <Pressable onPress={toggleShuffle}>
              <MaterialCommunityIcons
                name={isShuffle ? "shuffle" : "shuffle-disabled"}
                color={isShuffle ? "#00CDAC" : "white"}
                size={24}
              />
            </Pressable>
            <Pressable onPress={prevSong} disabled={currentIndex === 0}>
              <MaterialCommunityIcons
                name="skip-previous"
                color={currentIndex === 0 ? "gray" : "white"}
                size={45}
              />
            </Pressable>

            {isPlaying ? (
              <Pressable onPress={handleStop}>
                <MaterialCommunityIcons
                  name="pause-circle"
                  color="white"
                  size={70}
                />
              </Pressable>
            ) : (
              <Pressable onPress={handlePlay}>
                <MaterialCommunityIcons
                  name="play-circle"
                  color="white"
                  size={70}
                />
              </Pressable>
            )}

            <Pressable
              onPress={nextSong}
              disabled={currentIndex + 1 === songsQueue?.length}
            >
              <MaterialCommunityIcons
                name="skip-next"
                color={
                  currentIndex + 1 === songsQueue?.length ? "gray" : "white"
                }
                size={45}
              />
            </Pressable>
            <Pressable>
              <Text>
                {isRepeat === "false" && (
                  <MaterialCommunityIcons
                    name="repeat-off"
                    color="white"
                    size={24}
                    onPress={() => setRepeat("true")}
                  />
                )}
                {isRepeat === "true" && (
                  <MaterialCommunityIcons
                    name="repeat"
                    color="#00CDAC"
                    size={24}
                    onPress={() => setRepeat("one")}
                  />
                )}
                {isRepeat === "one" && (
                  <MaterialCommunityIcons
                    name="repeat-once"
                    color="#00CDAC"
                    size={24}
                    onPress={() => setRepeat("false")}
                  />
                )}
              </Text>
            </Pressable>
          </View>

          <View>
            <Text></Text>
          </View>

          <View className="w-full px-3 flex-row items-center justify-between">
            <Pressable
              className="p-2"
              onPress={() => {
                setIsQueueOpen(true);
              }}
            >
              <MaterialCommunityIcons name="download" color="white" size={24} />
            </Pressable>

            <Pressable
              className="p-2"
              onPress={() => {
                if (sheetRef) {
                  sheetRef?.current?.snapToIndex(0);
                }
              }}
            >
              <MaterialCommunityIcons
                name="playlist-music"
                color="white"
                size={24}
              />
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#222" }}
        handleIndicatorStyle={{ backgroundColor: "gray" }}
        topInset={top}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView
          style={{
            paddingHorizontal: 16,
            position: "relative",
            backgroundColor: "#222",
            zIndex: 1000,
            shadowColor: "#222",
          }}
        >
          <Text className="text-white text-2xl font-bold">Queue</Text>
          <View className="p-2 flex-row items-center justify-between w-full">
            <View className="flex-row items-center gap-4">
              <Image
                source={{ uri: currentSong?.image[2]?.url }}
                style={{ width: 46, height: 46, borderRadius: 4 }}
              />
              <View className="w-[65%]">
                <View className="flex-row items-center gap-1">
                  {isPlaying && (
                    <Image
                      source={require("../assets/images/gif3.gif")}
                      style={{ width: 20, height: 20, borderRadius: 4 }}
                    />
                  )}
                  <Text
                    numberOfLines={1}
                    className={`${currentSong?.id === currentSong?.id ? "text-primary" : "text-white"} font-medium text-lg w-full`}
                  >
                    {currentSong?.name}
                  </Text>
                </View>
                <Text className="text-white/70 text-sm">
                  {currentSong?.artists?.primary[0]?.name}
                </Text>
              </View>
            </View>
            <View>
              {isPlaying ? (
                <Pressable>
                  <MaterialCommunityIcons
                    name="pause-circle"
                    color="white"
                    size={40}
                    onPress={handleStop}
                  />
                </Pressable>
              ) : (
                <Pressable>
                  <MaterialCommunityIcons
                    name="play-circle"
                    color="white"
                    size={40}
                    onPress={handlePlay}
                  />
                </Pressable>
              )}
            </View>
          </View>
          <LinearGradient
            colors={["#222", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: "absolute",
              bottom: -18,
              height: 10,
              width: "100%",
              borderRadius: 2,
              alignSelf: "center",
              marginVertical: 8,
            }}
          />
        </BottomSheetView>
        <BottomSheetFlatList
          showsVerticalScrollIndicator={false}
          data={filteredSongs}
          keyExtractor={(item: any) => item.id + Math.random()}
          contentContainerStyle={{ padding: 16, marginTop: 10 }}
          renderItem={({ item }: { item: any }) => (
            <Pressable
              onPress={() => {
                updateLastPlayedSong(item?.id);
                setCurrentSong(item);
                setIsPlaying(true);
              }}
              className="p-2 flex-row items-center gap-4 mb-2 w-full"
            >
              <Image
                source={{ uri: item?.image[2]?.url }}
                style={{ width: 46, height: 46, borderRadius: 4 }}
              />
              <View className="w-[65%]">
                <Text
                  numberOfLines={1}
                  className="text-white font-medium mb-1 text-[15px]"
                >
                  {item?.name}
                </Text>
                <Text numberOfLines={1} className="text-white/70 text-sm">
                  {item?.artists?.primary[0]?.name}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default PlayerModal;
