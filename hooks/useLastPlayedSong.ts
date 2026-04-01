import { backendAPI } from "@/utils/backendAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useLastPlayedSong = () => {
  const [token, setToken] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    AsyncStorage.getItem("token").then(setToken);
  }, []);

  const {
    data: lastPlayedSong,
    isPending: loadingLastPlayed,
    refetch: refetchLastPlayedSong,
  } = useQuery({
    queryKey: ["lastPlayedSong"],
    queryFn: async () => {
      if (!token) throw new Error("No token found");
      const res = await backendAPI.get("/library/lastplayed", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    },
    enabled: !!token,
  });

  const { mutate: updateLastPlayedSong, isPending: updatingLastPlayedSong } =
    useMutation({
      mutationFn: async (songId: string) => {
        if (!token) throw new Error("No token found");
        const res = await backendAPI.patch(
          "/library/lastplayed/update",
          { songId },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        return res.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["lastPlayedSong"] });
      },
    });

  return {
    lastPlayedSong,
    loadingLastPlayed,
    updateLastPlayedSong,
    updatingLastPlayedSong,
    refetchLastPlayedSong,
  };
};

export default useLastPlayedSong;
