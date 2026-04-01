import CreatePlaylistModal from "@/components/CreatePlaylistModal";
import useMyPlaylist from "@/hooks/useMyPlaylist";
import useUser from "@/hooks/useUser";
import { backendAPI } from "@/utils/backendAPI";
import { getDominantColor } from "@/utils/useImageColors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";

const public_key = process.env.EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY;

const Profile = () => {
  const { user, token, refetchUser } = useUser();
  const [username, setUsername] = useState<string | undefined>(undefined);
  // const [email, setEmail] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [playlistModalVisible, setPlaylistModalVisible] =
    useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dominantColor, setDominantColor] = useState("#000000");

  const router = useRouter();

  const { myPlaylists, loadingPlaylists, refetchPlaylists } = useMyPlaylist();
  // console.log("myPlaylists", myPlaylists);

  useEffect(() => {
    const getColor = async () => {
      const color = await getDominantColor(user?.profilePic || "");
      setDominantColor(color);
    };
    getColor();
  }, [user, router]);

  const toast = useToast();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      // setEmail(user.email);
    }
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchUser();
    await refetchPlaylists();
    setRefreshing(false);
  }, []);

  const logoutUser = async () => {
    AsyncStorage.removeItem("token");
    router.replace("./");
  };

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

  const updateUser = async () => {
    if (!token) {
      console.log("No token found");
      return;
    }

    try {
      const res = await backendAPI.patch(
        "/auth/user-update",
        {
          profilePic: image,
          username: username || user?.username,
          // email: email || user?.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.show("Profile updated successfully");
      refetchUser();
    } catch (err) {
      console.log("Update failed:", err);
      toast.show("Failed to update profile");
    }
  };

  const uploadImage = async (uri: string) => {
    setUploadingImage(true);
    const formData = new FormData();

    formData.append("file", {
      uri,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any);

    formData.append("fileName", "profile.jpg");
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
    <SafeAreaView className="flex-1 h-full">
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
        <LinearGradient
          colors={[dominantColor, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
          className="px-3"
        >
          <View className="items-end mt-5">
            <MaterialCommunityIcons
              name="logout"
              size={24}
              color="#ffffff8A"
              onPress={logoutUser}
            />
          </View>

          <View className="items-center flex-row gap-5">
            <Image
              source={
                user?.profilePic
                  ? { uri: user.profilePic }
                  : require("../../../assets/images/dummy.jpg")
              }
              style={{
                width: 100,
                height: 100,
                borderRadius: 1000,
                borderWidth: 1,
                borderColor: "#FFFFFF1A",
              }}
            />
            <View className="items-start mt-5">
              <Text className="text-gray-200 text-2xl font-semibold">
                {user?.username}
              </Text>
              <Text className="text-gray-400 mt-1">{user?.email}</Text>
            </View>
          </View>

          <Button
            mode="text"
            style={{
              width: "100%",
              marginTop: 20,
              backgroundColor: `${dominantColor}8A`,
            }}
            textColor="#FFFFFFBA"
            onPress={() => setVisible(true)}
          >
            Edit Profile
          </Button>
        </LinearGradient>

        <View className="mt-10 px-3">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-200 text-xl font-bold">
              Your Playlists
            </Text>
            <Button
              icon="plus"
              mode="text"
              onPress={() => setPlaylistModalVisible(true)}
            >
              Create Playlist
            </Button>
          </View>

          {loadingPlaylists ? (
            <View className="items-center justify-center w-full h-full">
              <ActivityIndicator size="large" color="#FFFFFF" animating />
            </View>
          ) : (
            <FlatList
              key={"myplaylist"}
              keyExtractor={(item) => item.id}
              data={myPlaylists}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/profile/playlist/[playlistId]",
                      params: { playlistId: item._id },
                    })
                  }
                >
                  <View className="p-2 flex-row items-center gap-4 mb-2">
                    <Image
                      source={{ uri: item?.coverImage || "" }}
                      style={{ width: 60, height: 60, borderRadius: 4 }}
                    />
                    <View className="flex-1">
                      <Text
                        numberOfLines={1}
                        className="text-white font-medium text-xl"
                      >
                        {item?.name}
                      </Text>
                      <Text className="text-white/70 text-base">
                        {item?.songs?.length}{" "}
                        {item?.songs.length > 1 ? "songs" : "song"}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>

        <Modal transparent visible={visible} animationType="slide">
          <View className="flex-1 bg-black/60 items-center justify-center">
            <View className="bg-zinc-800 p-6 rounded-xl w-[90%] gap-5">
              <Text className="text-gray-200 text-lg font-semibold">
                Edit Profile
              </Text>

              <View>
                <View className="items-center">
                  <View className="relative">
                    {image && !uploadingImage ? (
                      <Image
                        source={image}
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: 1000,
                          borderWidth: 1,
                          borderColor: "black",
                        }}
                      />
                    ) : uploadingImage ? (
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 5,
                          alignItems: "center",
                          justifyContent: "center",
                          width: 150,
                          height: 150,
                          borderRadius: 1000,
                          borderWidth: 1,
                          borderColor: "gray",
                        }}
                      >
                        <ActivityIndicator color="#d1d5db" size={15} />
                        <Text className="text-gray-300 text-xs">
                          Uploading Image
                        </Text>
                      </View>
                    ) : (
                      <Image
                        source={
                          user?.profilePic
                            ? { uri: user?.profilePic }
                            : require("../../../assets/images/dummy.jpg")
                        }
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: 1000,
                          borderWidth: 1,
                          borderColor: "gray",
                        }}
                      />
                    )}
                    {!uploadingImage && (
                      <Pressable
                        onPress={pickImage}
                        className="self-start absolute bottom-3 right-3 border-black border-2 bg-gray-200 z-10 rounded-full w-8 h-8 items-center justify-center"
                      >
                        <MaterialCommunityIcons
                          name="pencil"
                          size={17}
                          color="black"
                        />
                      </Pressable>
                    )}
                  </View>
                </View>
                <View className="gap-5 my-5">
                  <TextInput
                    label="Username"
                    mode="outlined"
                    style={{ backgroundColor: "#27272a" }}
                    textColor="white"
                    value={username}
                    placeholderTextColor="#d4d4d4"
                    theme={{ colors: { onSurfaceVariant: "#d4d4d4" } }}
                    onChangeText={setUsername}
                  />

                  {/* <TextInput
                    label="Email"
                    mode="outlined"
                    style={{ backgroundColor: "#27272a" }}
                    placeholderTextColor="#d4d4d4"
                    theme={{ colors: { onSurfaceVariant: "#d4d4d4" } }}
                    textColor="white"
                    value={email}
                    onChangeText={setEmail}
                  /> */}
                </View>

                <View className="flex-row justify-end gap-3 mt-3">
                  <Pressable onPress={() => setVisible(false)} className="p-3">
                    <Text className="text-gray-400">Cancel</Text>
                  </Pressable>

                  <Button
                    mode="contained"
                    disabled={uploadingImage}
                    onPress={() => {
                      updateUser();
                      setVisible(false);
                    }}
                  >
                    <Text className="text-black">Save</Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <CreatePlaylistModal
          isVisible={playlistModalVisible}
          onClose={() => setPlaylistModalVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
