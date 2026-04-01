import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const OptionsSheet = forwardRef(
  (
    {
      song,
      options,
    }: {
      song: any;
      options: {
        icon: string;
        iconColor?: string;
        label: string;
        onPress?: () => void;
      }[];
    },
    ref: any,
  ) => {
    const snapPoints = useMemo(() => ["50%"], []);
    const { top } = useSafeAreaInsets();

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
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#222" }}
        handleIndicatorStyle={{ backgroundColor: "gray" }}
        topInset={top}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetFlatList
          ListHeaderComponent={
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#ffffff10",
              }}
              className="px-4 pb-4 mb-3"
            >
              <View className="flex-row items-center justify-between w-full">
                <View className="flex-row items-center gap-4">
                  <Image
                    source={{ uri: song?.image[2]?.url }}
                    style={{ width: 46, height: 46, borderRadius: 4 }}
                  />
                  <View className="w-[65%]">
                    <View className="flex-row items-center gap-1">
                      <Text
                        numberOfLines={1}
                        className="text-white font-medium text-lg w-full"
                      >
                        {song?.name}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-white/70 text-sm">
                        {song?.artists?.primary[0]?.name}
                      </Text>
                      <Text className="text-white/70 text-sm">&bull;</Text>
                      <Text className="text-white/70 text-sm">
                        {song?.album?.name}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          }
          data={options}
          keyExtractor={(item: any) => item.label}
          contentContainerStyle={{ marginTop: 10, paddingHorizontal: 12 }}
          renderItem={({ item }: { item: any }) => (
            <Pressable
              onPress={() => {
                {
                  ref.current?.close();
                  setTimeout(() => {
                    item.onPress?.();
                  }, 100);
                }
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 14,
              }}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                color={item.iconColor || "white"}
                size={23}
              />
              <Text className="text-white text-lg">{item.label}</Text>
            </Pressable>
          )}
        />
      </BottomSheet>
    );
  },
);
