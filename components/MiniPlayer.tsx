import useLastPlayedSong from "@/hooks/useLastPlayedSong";
import { useLibrary } from "@/hooks/useLibrary";
import { useSongData } from "@/hooks/useSongData";
import { usePlayerStore } from "@/store/usePlayerStore";
import { getDominantColor } from "@/utils/useImageColors";
import { usePlayerContext } from "@/utils/usePlayer";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { setAudioModeAsync } from "expo-audio";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { ProgressBar } from "react-native-paper";

const MiniPlayer = () => {
  const {
    setCurrentSong,
    currentSong,
    isPlaying,
    setIsPlaying,
    nextSong,
    setPlayer,
  } = usePlayerStore();

  const { libraryItems, addSong, removeSong, isAddingSong, isRemovingSong } =
    useLibrary();

  const { lastPlayedSong } = useLastPlayedSong();

  const { data: songDetails } = useSongData(lastPlayedSong?.songId);

  const { player, status, audioSource } = usePlayerContext();

  const { setDominantColor } = usePlayerStore();

  const [dominant, setDominant] = useState("#000000");

  useEffect(() => {
    const getColor = async () => {
      const color = await getDominantColor(currentSong?.image?.[2]?.url || "");
      setDominant(color);
      setDominantColor(color);
    };
    getColor();
  }, [currentSong]);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    });
  }, []);

  useEffect(() => {
    if (!audioSource) return;
    setPlayer(player);
    player.pause();
    setIsPlaying(false);
  }, [audioSource]);

  // Play/pause toggle
  useEffect(() => {
    if (!audioSource) return;
    if (isPlaying) {
      player?.play();
    } else {
      player?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (status?.didJustFinish) {
      nextSong();
    }
  }, [status?.didJustFinish]);

  useEffect(() => {
    if (!currentSong && songDetails?.[0]) {
      setCurrentSong(songDetails[0]);
    }
  }, [currentSong, songDetails]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  const progress =
    status?.duration > 0 ? status.currentTime / status.duration : 0;

  const isSongInLibrary = libraryItems.some(
    (entry) =>
      entry.type === "song" && entry.success && entry.id === currentSong?.id,
  );

  const song = currentSong ? currentSong : songDetails?.[0];

  return (
    <Link href="/player-modal" className="absolute bottom-[65px] mx-2">
      <View
        className={`flex-row items-center justify-between relative p-2 rounded-lg w-full`}
        style={{ backgroundColor: dominant }}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <Image
            source={{ uri: song?.image?.[2]?.url }}
            style={{ width: 40, height: 40, borderRadius: 4 }}
          />
          <View className="flex-1">
            <Text numberOfLines={1} className="text-white font-semibold">
              {song?.name}
            </Text>
            <View className="flex-row items-center gap-1">
              {song?.explicit && (
                <MaterialIcons name="explicit" color="gray" size={16} />
              )}
              <Text
                numberOfLines={1}
                className="text-white/80 text-sm font-medium"
              >
                {song?.artists?.primary[0]?.name}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-2 h-full mx">
          {isAddingSong || isRemovingSong ? (
            <View className="items-center flex-1 justify-center w-full">
              <ActivityIndicator color="#fff" />
            </View>
          ) : isSongInLibrary ? (
            <Pressable
              onPress={() => removeSong(currentSong?.id)}
              className="items-center justify-center p-1"
            >
              <MaterialCommunityIcons
                name="check-circle"
                color="#00CDAC"
                size={28}
              />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => addSong(currentSong?.id)}
              className="items-center justify-center p-1"
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"
                color="#fff"
                size={28}
              />
            </Pressable>
          )}

          {isPlaying ? (
            <Pressable
              onPress={handleStop}
              className="items-center justify-center p-1 pe-3"
            >
              <MaterialCommunityIcons name="pause" color="white" size={32} />
            </Pressable>
          ) : (
            <Pressable
              onPress={handlePlay}
              className="items-center justify-center p-1 pe-3"
            >
              <MaterialCommunityIcons name="play" color="white" size={32} />
            </Pressable>
          )}
        </View>

        <View className="mx-2 absolute bottom-0 w-full">
          <ProgressBar
            progress={progress}
            color="white"
            style={{ backgroundColor: "#FFFFFF1A", height: 1.5 }}
          />
        </View>
      </View>
    </Link>
  );
};

export default MiniPlayer;
