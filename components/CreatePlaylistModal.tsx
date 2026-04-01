import useMyPlaylist from "@/hooks/useMyPlaylist";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

const public_key = process.env.EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY;

const CreatePlaylistModal = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [name, setName] = useState("");
  const { createPlaylist, creatingPlaylist } = useMyPlaylist();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      const url = await uploadImage(result.assets[0].uri);
      setImage(url);
    }
  };

  const handleCreatePlaylist = () => {
    createPlaylist(
      { name, coverImage: image! },
      {
        onSuccess: () => {
          onClose();
          setName("");
          setImage(null);
        },
      },
    );
  };

  const uploadImage = async (uri: string) => {
    setUploadingImage(true);
    const formData = new FormData();

    formData.append("file", {
      uri,
      name: "playlistcover.jpg",
      type: "image/jpeg",
    } as any);

    formData.append("fileName", "playlistcover.jpg");
    formData.append("publicKey", public_key!);

    const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization:
          "Basic " + btoa(process.env.EXPO_PUBLIC_IMAGEKIT_PRIVATE_KEY + ":"),
      },
    });

    const data = await res.json();
    setUploadingImage(false);
    return data.url;
  };

  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <View className="flex-1 bg-black/60 items-center justify-center">
        <View className="bg-zinc-800 p-6 rounded-xl w-[90%] gap-5">
          <Text className="text-gray-200 text-lg font-semibold">
            Create Playlist
          </Text>

          <View>
            <View className="items-center">
              <View className="relative mb-5">
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "gray",
                    }}
                  />
                ) : (
                  <Pressable
                    onPress={pickImage}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: 150,
                      height: 150,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "gray",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={24}
                      color="#e5e7eb"
                    />
                    <Text className="text-gray-200 text-lg mt-2 text-center">
                      Add cover
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
            <TextInput
              label="Playlist Name"
              mode="outlined"
              style={{ backgroundColor: "#27272a" }}
              textColor="white"
              value={name}
              placeholderTextColor="#d4d4d4"
              theme={{ colors: { onSurfaceVariant: "#d4d4d4" } }}
              onChangeText={setName}
            />

            <View className="flex-row justify-end gap-3 mt-3">
              <Pressable onPress={onClose} className="p-3">
                <Text className="text-gray-400">Cancel</Text>
              </Pressable>

              <Button
                loading={creatingPlaylist || uploadingImage}
                mode="contained"
                disabled={creatingPlaylist || uploadingImage}
                onPress={() => {
                  handleCreatePlaylist();
                }}
              >
                <Text className="text-black">Save</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreatePlaylistModal;
