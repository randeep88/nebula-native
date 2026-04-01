import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

const qualities = [
  { label: "Low (12 kbps)", index: 0 },
  { label: "Medium (48 kbps)", index: 1 },
  { label: "Good (96 kbps)", index: 2 },
  { label: "High (160 kbps)", index: 3 },
  { label: "Best (320 kbps)", index: 4 },
];

export const DownloadModal = ({
  visible,
  onClose,
  song,
}: {
  visible: boolean;
  onClose: () => void;
  song: any;
}) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async (qualityIndex: number) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync(false, [
        "audio",
      ]);
      console.log("status", status);

      if (status !== "granted") {
        alert("Storage permission required");
        return;
      }

      const url = song?.downloadUrl?.[qualityIndex]?.url;
      if (!url) {
        alert("URL not available");
        return;
      }

      console.log("url", url);

      setDownloading(true);
      setProgress(0);

      const cleanName = song?.name?.replace(/[^a-zA-Z0-9 ]/g, "").trim();
      const fileUri = FileSystem.documentDirectory + `${cleanName}.mp3`;
      console.log("fileuri", fileUri);

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri,
        {},
        (p) => {
          const percent = Math.round(
            (p.totalBytesWritten / p.totalBytesExpectedToWrite) * 100,
          );
          setProgress(percent);
        },
      );
      console.log("downloadresumable", downloadResumable);

      const result = await downloadResumable.downloadAsync();
      console.log("result", result);

      if (result?.uri) {
        const asset = await MediaLibrary.createAssetAsync(result.uri);
        await MediaLibrary.createAlbumAsync("Music", asset, false);
        setDownloading(false);
        onClose();
        alert("Downloaded successfully!");
      }
    } catch (error) {
      console.log(error);
      setDownloading(false);
      alert("Download failed");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
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
            backgroundColor: "#061436",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            Download Quality
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {song?.name} &bull; {song?.artists?.primary?.[0]?.name}
          </Text>

          {/* Progress bar */}
          {downloading && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: "white", marginBottom: 6 }}>
                Downloading... {progress}%
              </Text>
              <View
                style={{
                  height: 4,
                  backgroundColor: "#ffffff20",
                  borderRadius: 2,
                }}
              >
                <View
                  style={{
                    height: 4,
                    width: `${progress}%`,
                    backgroundColor: "#00CDAC",
                    borderRadius: 2,
                  }}
                />
              </View>
            </View>
          )}

          {/* Quality options */}
          {!downloading &&
            qualities.map((q) => (
              <Pressable
                key={q.index}
                onPress={() => handleDownload(q.index)}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  marginBottom: 8,
                  backgroundColor: "#333",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "white", fontSize: 15 }}>{q.label}</Text>
                {q.index === 4 && (
                  <Text
                    style={{
                      color: "#00CDAC",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    (Recommended)
                  </Text>
                )}
              </Pressable>
            ))}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
