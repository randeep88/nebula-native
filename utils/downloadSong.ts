import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { useToast } from "react-native-toast-notifications";

export const downloadSong = async (url: string, songName: string) => {
  const toast = useToast();
  try {
    // Permission maango
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      toast.show("Storage permission required");
      return;
    }

    // Clean filename — special chars hata do
    const cleanName = songName.replace(/[^a-zA-Z0-9 ]/g, "").trim();
    const fileUri = FileSystem?.documentDirectory + `${cleanName}.mp3`;

    // Pehle check karo ki already downloaded hai
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      toast.show("Song already downloaded");
      return;
    }

    toast.show("Downloading...");

    // Download karo with progress
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      (progress) => {
        const percent = Math.round(
          (progress.totalBytesWritten / progress.totalBytesExpectedToWrite) *
            100,
        );
        console.log(`Progress: ${percent}%`);
      },
    );

    const result = await downloadResumable.downloadAsync();

    if (result?.uri) {
      // Device ki Music library mein save karo
      const asset = await MediaLibrary.createAssetAsync(result.uri);
      await MediaLibrary.createAlbumAsync("Music", asset, false);
      toast.show("Song downloaded successfully!");
    }
  } catch (error) {
    console.error("Download error:", error);
    toast.show("Download failed");
  }
};
