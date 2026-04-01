import { backendAPI } from "@/utils/backendAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useMyPlaylist = (id?: string) => {
  const [token, setToken] = useState<string | null>(null);
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    AsyncStorage.getItem("token").then((t) => {
      setToken(t);
      setIsTokenLoading(false);
    });
  }, []);

  const { data: playlist, isPending: loadingPlaylist } = useQuery({
    queryKey: ["my-playlists", id],
    queryFn: async () => {
      const res = await backendAPI.get(`/playlist/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    },
    enabled: !!token && !isTokenLoading && !!id,
  });

  const {
    data: myPlaylists,
    isPending: loadingPlaylists,
    refetch: refetchPlaylists,
  } = useQuery({
    queryKey: ["my-playlists"],
    queryFn: async () => {
      const res = await backendAPI.get("/playlist/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    },
    enabled: !!token && !isTokenLoading,
  });

  const { mutate: createPlaylist, isPending: creatingPlaylist } = useMutation({
    mutationFn: async ({
      name,
      coverImage,
    }: {
      name: string;
      coverImage: string;
    }) => {
      if (isTokenLoading || !token) {
        throw new Error("Token not found");
      }
      const res = await backendAPI.post(
        "/playlist/create",
        {
          name,
          coverImage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-playlists"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: addSong, isPending: addingSong } = useMutation({
    mutationFn: async ({
      playlistIds,
      songId,
    }: {
      playlistIds: string[];
      songId: string;
    }) => {
      if (isTokenLoading || !token) {
        throw new Error("Token not found");
      }
      const res = await backendAPI.post(
        "/playlist/add-song",
        {
          playlistIds,
          songId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-playlists"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return {
    myPlaylists,
    loadingPlaylists,
    refetchPlaylists,
    createPlaylist,
    creatingPlaylist,
    addSong,
    addingSong,
    playlist,
    loadingPlaylist,
  };
};

export default useMyPlaylist;
