import { api } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { backendAPI } from "../utils/backendAPI";

const useLib = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("token").then(setToken);
  }, []);

  const {
    data: library,
    isPending: isLoadingLibrary,
    isError: isLibraryError,
  } = useQuery({
    queryKey: ["library"],
    queryFn: async () => {
      if (!token) throw new Error("No token found");
      const res = await backendAPI.get("/library", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      return data || [];
    },
  });

  //artists
  const {
    data: artistDetails,
    isPending: isLoadingArtistDetails,
    isError: isArtistDetailsError,
  } = useQuery({
    queryKey: ["libraryArtistDetails"],
    enabled: !!library?.artists?.length,
    queryFn: async () => {
      const results = await Promise.allSettled(
        (library.artists || []).map(async (artist: any) => {
          const res = await api.get(`/artists/${artist.artistId}`);
          return res.data;
        }),
      );
      return results
        .map((r) => (r.status === "fulfilled" ? r.value : null))
        .filter(Boolean);
    },
  });

  //albums
  const {
    data: albumDetails,
    isPending: isLoadingAlbumDetails,
    isError: isAlbumDetailError,
  } = useQuery({
    queryKey: ["libraryAlbumDetails"],
    enabled: !!library?.albums?.length,
    queryFn: async () => {
      const results = await Promise.allSettled(
        (library.albums || []).map(async (album: any) => {
          const res = await api.get(`/albums?id=${album.albumId}`);
          return res.data;
        }),
      );
      return results
        .map((r) => (r.status === "fulfilled" ? r.value : null))
        .filter(Boolean);
    },
  });

  //playlists
  const {
    data: playlistDetails,
    isPending: isLoadingPlaylistDetails,
    isError: isPlaylistDetailError,
  } = useQuery({
    queryKey: ["libraryPlaylistDetails"],
    enabled: !!library?.playlists?.length,
    queryFn: async () => {
      const results = await Promise.allSettled(
        (library.playlists || []).map(async (playlist: any) => {
          const res = await api.get(`/playlists?id=${playlist.playlistId}`);
          return res.data;
        }),
      );
      return results
        .map((r) => (r.status === "fulfilled" ? r.value : null))
        .filter(Boolean);
    },
  });

  const libraryItems = useMemo(() => {
    return [
      ...(artistDetails || []),
      ...(albumDetails || []),
      ...(playlistDetails || []),
    ];
  }, [artistDetails, albumDetails, playlistDetails]);

  const isLoading =
    isLoadingLibrary ||
    isLoadingArtistDetails ||
    isLoadingAlbumDetails ||
    isLoadingPlaylistDetails;

  const isError =
    isLibraryError ||
    isArtistDetailsError ||
    isPlaylistDetailError ||
    isAlbumDetailError;

  return { libraryItems, isLoading, isError };
};

export default useLib;
