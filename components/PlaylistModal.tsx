import useMyPlaylist from "@/hooks/useMyPlaylist";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";

export const PlaylistModal = ({
  visible,
  onClose,
  song,
}: {
  visible: boolean;
  onClose: () => void;
  song: any;
}) => {
  const { myPlaylists, addSong, addingSong } = useMyPlaylist();
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

  const togglePlaylist = (playlistId: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId],
    );
  };
  const isSelected = (playlistId: string) =>
    selectedPlaylists.some((id) => id === playlistId);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#222",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 20,
          }}
        >
          <Text className="text-white text-xl font-semibold">
            Add to Playlists
          </Text>
          <Text className="text-gray-300 text-sm mb-5">
            {song?.name} &bull; {song?.artists?.primary?.[0]?.name}
          </Text>
          <FlatList
            keyExtractor={(item) => item.id}
            data={myPlaylists}
            renderItem={({ item }) => (
              <Pressable className="flex-row items-center justify-between">
                <View className="p-2 flex-row items-center gap-4 mb-2">
                  <Image
                    source={{ uri: item?.coverImage || "" }}
                    style={{ width: 50, height: 50, borderRadius: 4 }}
                  />
                  <View>
                    <Text
                      numberOfLines={1}
                      className="text-white font-medium text-lg"
                    >
                      {item?.name}
                    </Text>
                    <Text className="text-white/70 text-sm">
                      {item?.songs?.length}{" "}
                      {item?.songs.length > 1 ? "songs" : "song"}
                    </Text>
                  </View>
                </View>
                <View>
                  <Pressable
                    onPress={() => togglePlaylist(item._id)}
                    className="p-2"
                  >
                    {isSelected(item._id) ? (
                      <MaterialCommunityIcons
                        name="checkbox-marked"
                        color="#00CDAC"
                        size={24}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="checkbox-blank-outline"
                        color="#00CDAC"
                        size={24}
                      />
                    )}
                  </Pressable>
                </View>
              </Pressable>
            )}
          />

          <View className="flex-row justify-end gap-3 mt-3 mb-5">
            <Pressable onPress={() => onClose()} className="p-3">
              <Text className="text-gray-400">Cancel</Text>
            </Pressable>

            <Button
              mode="contained"
              disabled={addingSong}
              loading={addingSong}
              onPress={() => {
                addSong({
                  playlistIds: selectedPlaylists,
                  songId: song?.id,
                });
                onClose();
              }}
            >
              <Text className="text-black">Done</Text>
            </Button>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
