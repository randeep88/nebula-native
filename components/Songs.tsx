import { useLibrary } from "@/hooks/useLibrary";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useOptionsSheet } from "@/utils/OptionsSheetContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useToast } from "react-native-toast-notifications";
import { DownloadModal } from "./DownloadModal";
import { PlaylistModal } from "./PlaylistModal";

const Songs = ({
  showRemoveFromPlaylist = false,
  showAddButton = true,
  isAlbum = false,
  isArtist = false,
  item,
  handlePlaySong,
  showAddedToLiked = !showAddButton,
}: {
  showRemoveFromPlaylist?: boolean;
  showAddedToLiked?: boolean;
  showAddButton?: boolean;
  isArtist?: boolean;
  isAlbum?: boolean;
  item: any;
  handlePlaySong: (item: any) => void;
}) => {
  const [downloadModal, setDownloadModal] = useState(false);
  const [playlistModal, setPlaylistModal] = useState(false);
  const toast = useToast();

  const { currentSong, addSongToQueue, isPlaying } = usePlayerStore();
  const { addSong, removeSong, libraryItems } = useLibrary();
  const { openSheet } = useOptionsSheet();
  const router = useRouter();
  const artistId = item?.artists?.primary?.[0]?.id;

  const isSongInLibrary = libraryItems?.some(
    (entry) => entry.type === "song" && entry.success && entry.id === item?.id,
  );

  const handleAddToQueue = (song: any) => {
    addSongToQueue(song);
  };

  const songOptions = [
    ...(showAddButton
      ? []
      : [
          {
            icon: isSongInLibrary ? "check-circle" : "plus-circle-outline",
            iconColor: isSongInLibrary ? "#00CDAC" : "white",
            label: isSongInLibrary
              ? "Remove from Liked Songs"
              : "Add to Liked Songs",
            onPress: () => {
              if (isSongInLibrary) {
                removeSong(item.id);
              } else {
                addSong(item.id);
              }
            },
          },
        ]),
    {
      icon: "playlist-play",
      label: "Add to Queue",
      onPress: () => {
        handleAddToQueue(item);
        toast.show(`${item?.name} added to queue`);
      },
    },
    {
      icon: showRemoveFromPlaylist ? "playlist-remove" : "playlist-plus",
      label: showRemoveFromPlaylist
        ? "Remove from Playlist"
        : "Add to Playlist",
      onPress: () => {
        setPlaylistModal(true);
      },
    },
    {
      icon: "account-music",
      label: "View Artist",
      onPress: () => {
        if (artistId) {
          router.push({
            pathname: "/(tabs)/search/artist/[artistId]",
            params: { artistId: artistId },
          });
        }
      },
    },
    {
      icon: "download",
      label: "Download",
      onPress: () => setDownloadModal(true),
    },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pressable
        onPress={() => handlePlaySong(item)}
        key={item.id}
        className="p-2 pe-0 flex-row items-center justify-between gap-4 mb-2"
      >
        <View className="flex-row items-center gap-4 flex-1">
          {!isAlbum && (
            <Image
              source={{ uri: item?.image[2]?.url }}
              style={{ width: 46, height: 46, borderRadius: 4 }}
            />
          )}
          <View className="flex-1">
            <View className="flex-row items-center gap-1 flex-1 overflow-hidden">
              {currentSong?.id === item?.id && isPlaying && (
                <Image
                  source={require("../assets/images/gif3.gif")}
                  style={{ width: 20, height: 20, borderRadius: 4 }}
                />
              )}
              <Text
                numberOfLines={1}
                className={`${currentSong?.id === item?.id ? "text-primary" : "text-white"} font-medium text-[15px]`}
              >
                {item?.name}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              {item?.explicit && (
                <MaterialIcons name="explicit" color="gray" size={16} />
              )}
              {isAlbum ? (
                <Text numberOfLines={1} className="text-white/70 text-sm">
                  {[
                    item?.artists?.primary[0]?.name,
                    ...(item?.artists?.featured
                      ?.slice(0, 2)
                      ?.map((a: any) => a.name) || []),
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              ) : (
                <Text numberOfLines={1} className="text-white/70 text-sm">
                  {isArtist
                    ? item?.album?.name
                    : item?.artists?.primary[0]?.name}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-end ml-2 h-full">
          {showAddButton && (
            <Pressable
              className="p-2"
              onPress={() => {
                if (isSongInLibrary) {
                  removeSong(item.id);
                } else {
                  addSong(item.id);
                }
              }}
            >
              <MaterialCommunityIcons
                name={isSongInLibrary ? "check-circle" : "plus-circle-outline"}
                color={isSongInLibrary ? "#00CDAC" : "gray"}
                size={22}
              />
            </Pressable>
          )}
          {showAddedToLiked && isSongInLibrary && (
            <Pressable
              className="p-2"
              onPress={() => {
                removeSong(item.id);
              }}
            >
              <MaterialCommunityIcons
                name="check-circle"
                color="#00CDAC"
                size={22}
              />
            </Pressable>
          )}

          <Pressable
            className="p-2"
            onPress={() => openSheet(item, songOptions)}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              color="gray"
              size={22}
            />
          </Pressable>
        </View>
      </Pressable>

      <DownloadModal
        visible={downloadModal}
        onClose={() => setDownloadModal(false)}
        song={item}
      />
      <PlaylistModal
        visible={playlistModal}
        onClose={() => setPlaylistModal(false)}
        song={item}
      />
    </GestureHandlerRootView>
  );
};

export default Songs;
